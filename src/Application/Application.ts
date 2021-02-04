/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import * as semver from "semver";

import { Command } from "../Command/Command";
import { CommandInterface } from "../Command/CommandInterface";
import { HelpCommand } from "../Command/HelpCommand";
import { ListCommand } from "../Command/ListCommand";
import { ArgumentException } from "../Exception/ArgumentException";
import { ConsoleException } from "../Exception/ConsoleException";
import { LogicException } from "../Exception/LogicException";
import { RuntimeException } from "../Exception/RuntimeException";
import { AbstractInputAwareHelper } from "../Helper/AbstractInputAwareHelper";
import { DebugFormatterHelper } from "../Helper/DebugFormatterHelper";
import { FormatterHelper } from "../Helper/FormatterHelper";
import { HelperSet } from "../Helper/HelperSet";
import { QuestionHelper } from "../Helper/QuestionHelper";
import { ArgumentDefinition } from "../Input/ArgumentDefinition";
import { ArgumentMode } from "../Input/ArgumentMode";
import { ArgvInput } from "../Input/ArgvInput";
import { CollectionInput } from "../Input/CollectionInput";
import { InputArguments } from "../Input/InputArguments";
import { InputDefinition } from "../Input/InputDefinition";
import { InputInterface } from "../Input/InputInterface";
import { InputOptions } from "../Input/InputOptions";
import { OptionDefinition } from "../Input/OptionDefinition";
import { OptionMode } from "../Input/OptionMode";
import { ConsoleOutput } from "../Output/ConsoleOutput";
import { OutputInterface } from "../Output/OutputInterface";
import { OutputMode } from "../Output/OutputMode";
import { NumberUtilities } from "../Utilities/NumberUtilities";
import { ApplicationInterface } from "./ApplicationInterface";

export class Application implements ApplicationInterface {

    private static SHELL_VERBOSITY_QUIET = -1;

    private static SHELL_VERBOSITY_NORMAL = 0;

    private static SHELL_VERBOSITY_VERBOSE = 1;

    private static SHELL_VERBOSITY_VERY_VERBOSE = 2;

    private static SHELL_VERBOSITY_DEBUG = 3;

    private static EXIT_CODE_LIMIT = 255;

    protected version!: semver.SemVer;

    protected name!: string;

    protected definition!: InputDefinition;

    protected singleCommand: boolean = false;

    protected defaultCommand: string = "list";

    protected commands: Map<string, CommandInterface>;

    protected wantHelps: boolean = false;

    protected initialized: boolean = false;

    protected catchExceptions: boolean = true;

    protected autoExit: boolean = true;

    protected runningCommand: CommandInterface | null = null;

    protected helperSet!: HelperSet;

    public constructor(name: string = "UNKNOWN", version: string = "0.1.0") {
        this.setName(name);
        this.setVersion(version);
        this.commands = new Map<string, CommandInterface>();
    }

    public setHelperSet(helperSet: HelperSet) {
        this.helperSet = helperSet;
    }

    public getHelperSet() {
        if (!this.helperSet) {
            this.helperSet = this.getDefaultHelperSet();
        }

        return this.helperSet;
    }

    public getVersion(): semver.SemVer {
        return this.version;
    }

    public setVersion(version: string): void {
        const parsedVersion = semver.parse(version);

        if (parsedVersion === null) {
            throw new RuntimeException(`Version "${version}" is invalid.`);
        }

        this.version = parsedVersion;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public async run(input: InputInterface | null = null, output: OutputInterface | null = null): Promise<number> {
        if (null === input) {
            input = new ArgvInput();
        }

        if (null === output) {
            output = new ConsoleOutput();
        }

        await this.configureIO(input, output);

        let exitCode: number;

        try {
            exitCode = await this.doRun(input, output);
        } catch (exception) {
            if (!this.catchExceptions) {
                throw exception;
            }

            this.writeException(output, exception);

            exitCode = exception?.exitCode ?? 1;
            if (!NumberUtilities.isIntStrict(exitCode)) {
                exitCode = NumberUtilities.parseIntStrict(exitCode);
                if (isNaN(exitCode)) {
                    exitCode = 1;
                }
            }

            if (0 === exitCode) {
                exitCode = 1;
            }
        }

        if (this.autoExit) {
            if (exitCode > Application.EXIT_CODE_LIMIT) {
                exitCode = Application.EXIT_CODE_LIMIT;
            }

            process.exit(exitCode);
        }

        return exitCode;
    }

    public getLongVersion() {
        return `${this.getName()} <info>${this.getVersion()}</info>`;
    }

    public getDefinition() {
        if (!this.definition) {
            this.definition = this.getDefaultInputDefinition();
        }

        if (this.singleCommand) {
            const inputDefinition = this.definition;

            inputDefinition.setArguments();

            return inputDefinition;
        }

        return this.definition;
    }

    public areExceptionsCaught() {
        return this.catchExceptions;
    }

    public setCatchExceptions(catchExceptions: boolean) {
        this.catchExceptions = catchExceptions;
    }

    public addCommands(commands: CommandInterface[]): this {
        for (const command of commands) {
            this.add(command);
        }

        return this;
    }

    public add<Arguments extends InputArguments = {}, Options extends InputOptions = {}>(command: CommandInterface<Arguments, Options>): CommandInterface<Arguments, Options> {
        this.init();

        command.setApplication(this);
        command.getDefinition();

        if (!command.getName()) {
            throw new LogicException(`The command defined in "${command.constructor.name}" cannot have an empty name.`);
        }

        this.commands.set(command.getName(), command);

        for (const alias of command.getAliases()) {
            this.commands.set(alias, command);
        }

        return command;
    }

    public get(name: string): CommandInterface {
        this.init();

        if (!this.has(name)) {
            throw new ArgumentException(`The command "${name}" does not exist.`);
        }

        const command = this.commands.get(name) as CommandInterface;

        if (this.wantHelps) {
            this.wantHelps = false;
            const helpCommand = this.get("help") as unknown as HelpCommand;

            helpCommand.setCommand(command);

            return helpCommand;
        }

        return command;
    }

    public has(name: string): boolean {
        this.init();

        return this.commands.has(name);
    }

    public find(name: string): CommandInterface {
        this.init();

        for (const command of this.commands.values()) {
            for (const alias of command.getAliases()) {
                if (!this.has(alias)) {
                    this.commands.set(alias, command);
                }
            }
        }

        if (this.has(name)) {
            return this.get(name);
        }

        throw new RuntimeException(`The command "${name}" does not exist.`);
    }

    public extractNamespace(name: string, limit: number | null = null) {
        const parts = name.split(":");

        parts.pop();

        if (null === limit) {
            return parts.join(":");
        }

        return parts.slice(0, limit).join(":");
    }

    public extractAllNamespaces(name: string) {
        const namespaces: string[] = [];
        const parts = name.split(":");

        parts.pop();

        for (const part of parts) {
            if (namespaces.length > 0) {
                const lastPart = namespaces[namespaces.length - 1];

                namespaces.push(`${lastPart}:${part}`);
            } else {
                namespaces.push(part);
            }
        }

        return namespaces;
    }

    public isSingleCommand(): boolean {
        return this.singleCommand;
    }

    public setDefaultCommand(name: string, isSingleCommand?: boolean): this {
        this.defaultCommand = name;

        if (isSingleCommand) {
            // Ensure the command exist
            this.find(name);
            this.singleCommand = true;
        }

        return this;
    }

    public findNamespace(namespace: string): string {
        let namespaces = this.getNamespaces();
        const expression = namespace.replace(/([^:]+|)/, (match) => {
            return match + "[^:]*";
        });

        namespaces = namespaces.filter((name: string) => name.match(new RegExp("^" + expression)));

        if (!namespaces.length) {
            throw new RuntimeException(`There are no commands defined in the "${namespace}".`);
        }

        const exact = namespaces.indexOf(namespace) !== -1;

        if (namespaces.length > 1 && !exact) {
            throw new RuntimeException(`The namespace "${namespace}" is ambiguous.`);
        }

        if (exact) {
            return namespace;
        }

        return namespaces[namespaces.length - 1];
    }

    public getNamespaces(): string[] {
        const namespaces = new Set<string>();

        for (const command of this.all().values()) {
            const extractedNamespaces = this.extractAllNamespaces(command.getName());

            for (const namespace of extractedNamespaces) {
                if (!namespaces.has(namespace)) {
                    namespaces.add(namespace);
                }
            }

            for (const alias of command.getAliases()) {
                const extractedAliasNamespaces = this.extractAllNamespaces(alias);

                for (const namespace of extractedAliasNamespaces) {
                    if (!namespaces.has(namespace)) {
                        namespaces.add(namespace);
                    }
                }
            }
        }

        return Array.from(namespaces.values());
    }

    public all(namespace: string | null = null): Map<string, CommandInterface> {
        this.init();

        if (null === namespace) {
            return this.commands;
        }

        const commands = new Map<string, CommandInterface>();

        for (const [name, command] of this.commands.entries()) {
            const extractedNamespace = this.extractNamespace(name, namespace.split(":").length);

            if (namespace === extractedNamespace) {
                commands.set(name, command);
            }
        }

        return commands;
    }

    public getHelp(): string {
        return this.getLongVersion();
    }

    public register<Arguments extends InputArguments = {}, Options extends InputOptions = {}>(name: string): CommandInterface<Arguments, Options> {
        return this.add(new Command<Arguments, Options>(name));
    }

    public setAutoExit(autoExit: boolean): this {
        this.autoExit = autoExit;

        return this;
    }

    public isAutoExitEnabled(): boolean {
        return this.autoExit;
    }

    protected async configureIO(input: InputInterface, output: OutputInterface) {
        if (input.hasParameterOption(["--ansi"], true)) {
            output.setDecorated(true);
        } else if (input.hasParameterOption(["--no-ansi"], true)) {
            output.setDecorated(false);
        }

        if (input.hasParameterOption(["--no-interaction", "-n"], true)) {
            input.setInteractive(false);
        }

        let shellVerbosity: number = Application.SHELL_VERBOSITY_NORMAL;

        if (input.hasParameterOption(["--quiet", "-q"], true)) {
            output.setVerbosity(OutputMode.VERBOSITY_QUIET);
            shellVerbosity = Application.SHELL_VERBOSITY_QUIET;
        } else {
            if (input.hasParameterOption("-vvv", true) || input.hasParameterOption("--verbose=3", true) || "3" === input.getParameterOption("--verbose", false, true)) {
                output.setVerbosity(OutputMode.VERBOSITY_DEBUG);
                shellVerbosity = Application.SHELL_VERBOSITY_DEBUG;
            } else if (input.hasParameterOption("-vv", true) || input.hasParameterOption("--verbose=2", true) || "2" === input.getParameterOption("--verbose", false, true)) {
                output.setVerbosity(OutputMode.VERBOSITY_VERY_VERBOSE);
                shellVerbosity = Application.SHELL_VERBOSITY_VERY_VERBOSE;
            } else if (input.hasParameterOption("-v", true) || input.hasParameterOption("--verbose=1", true) || input.getParameterOption("--verbose", true) || input.getParameterOption("--verbose", false, true)) {
                output.setVerbosity(OutputMode.VERBOSITY_VERBOSE);
                shellVerbosity = Application.SHELL_VERBOSITY_VERBOSE;
            }
        }

        if (-1 === shellVerbosity) {
            input.setInteractive(false);
        }

        process.env.SHELL_VERBOSITY = shellVerbosity.toString();
    }

    protected getDefaultInputDefinition() {
        return new InputDefinition([
            new ArgumentDefinition("command", ArgumentMode.REQUIRED, "The command to execute"),
            new OptionDefinition("--help", "-h", OptionMode.VALUE_NONE, "Display this help message"),
            new OptionDefinition("--quiet", "-q", OptionMode.VALUE_NONE, "Do not output any message"),
            new OptionDefinition("--version", "-V", OptionMode.VALUE_NONE, "Display this application version"),
            new OptionDefinition("--ansi", "", OptionMode.VALUE_NONE, "Force ANSI output"),
            new OptionDefinition("--no-ansi", "", OptionMode.VALUE_NONE, "Disable ANSI output"),
            new OptionDefinition("--no-interaction", "-n", OptionMode.VALUE_NONE, "Do not ask any interactive question"),
            new OptionDefinition("--verbose", "-v|vv|vvv", OptionMode.VALUE_NONE, "Increase the verbosity of messages: 1 for normal output, 2 for more verbose output and 3 for debug"),
        ]);
    }

    protected getCommandName(input: InputInterface) {
        if (this.singleCommand) {
            return this.defaultCommand;
        }

        return input.getFirstArgument();

    }

    protected async doRun(input: InputInterface, output: OutputInterface): Promise<number> {
        if (input.hasParameterOption(["--version", "-V"], true)) {
            output.writeln(this.getLongVersion());

            return 0;
        }

        try {
            // Makes input.getFirstArgument() able to distinguish an option from an argument.
            input.bind(this.getDefinition());
        } catch (e) {
            // Errors must be ignored, full binding/validation happens later when the command is known.
        }

        let name = this.getCommandName(input);

        if (input.hasParameterOption(["--help", "-h"], true)) {
            if (!name) {
                name = "help";
                input = new CollectionInput([["commandName", this.defaultCommand]]);
            } else {
                this.wantHelps = true;
            }
        }

        if (!name) {
            name = this.defaultCommand;
            const definition = this.getDefinition();

            const commandArgument = new ArgumentDefinition("command", ArgumentMode.OPTIONAL, definition.getArgument("command").getDescription(), name);
            const args = Array.from(definition.getArguments().values());
            const commandArgumentIndex = args.findIndex(item => item.getName() === "command");

            if (-1 !== commandArgumentIndex) {
                args[commandArgumentIndex] = commandArgument;
            }

            definition.setArguments(args);
        }

        this.runningCommand = null;
        const command = this.find(name);

        this.runningCommand = command;
        const exitCode = await this.doRunCommand(command, input, output);

        this.runningCommand = null;

        return exitCode;
    }

    protected getDefaultHelperSet() {
        return new HelperSet([
            new FormatterHelper(),
            new DebugFormatterHelper(),
            // new ProcessHelper(), // @todo
            new QuestionHelper(),
        ]);
    }

    protected getDefaultCommands(): CommandInterface[] {
        return [
            new HelpCommand(),
            new ListCommand(),
        ];
    }

    private init() {
        if (this.initialized) {
            return;
        }
        this.initialized = true;

        for (const command of this.getDefaultCommands()) {
            this.add(command);
        }
    }

    private async doRunCommand(command: CommandInterface, input: InputInterface, output: OutputInterface) {
        const helperSet = command.getHelperSet();

        if (helperSet) {
            for (const helper of helperSet.getHelpers().values()) {
                if (helper instanceof AbstractInputAwareHelper) {
                    helper.setInput(input);
                }
            }
        }

        return command.run(input, output);
    }

    private writeException(output: OutputInterface, exception: ConsoleException) {
        if (output.isDebug()) {
            output.writeln(`<error>${exception.stack}</error>`);
        } else {
            output.writeln(`<error>${exception.message}</error>`);
        }
    }

}
