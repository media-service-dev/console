/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import * as path from "path";
import * as util from "util";
import { ApplicationInterface } from "../Application/ApplicationInterface";
import { ArgumentException } from "../Exception/ArgumentException";
import { LogicException } from "../Exception/LogicException";
import { HelperInterface } from "../Helper/HelperInterface";
import { HelperSet } from "../Helper/HelperSet";
import { ArgumentDefinition } from "../Input/ArgumentDefinition";
import { ArgumentMode } from "../Input/ArgumentMode";
import { ArgumentValue } from "../Input/ArgumentValue";
import { InputArguments } from "../Input/InputArguments";
import { InputDefinition } from "../Input/InputDefinition";
import { InputInterface } from "../Input/InputInterface";
import { InputOptions } from "../Input/InputOptions";
import { OptionDefinition } from "../Input/OptionDefinition";
import { OptionMode } from "../Input/OptionMode";
import { OptionValue } from "../Input/OptionValue";
import { OutputInterface } from "../Output/OutputInterface";
import { NumberUtilities } from "../Utilities/NumberUtilities";
import { CommandCode } from "./CommandCode";
import { CommandInterface } from "./CommandInterface";

export class Command<Arguments extends InputArguments = {}, Options extends InputOptions = {}> implements CommandInterface<Arguments, Options> {

    protected definition: InputDefinition;

    protected description: string | null = null;

    protected help: string | null = null;

    protected application: ApplicationInterface | null = null;

    protected applicationDefinitionMerged: boolean = false;

    protected applicationDefinitionMergedWithArgs: boolean = false;

    protected synopsis: Map<string, string> = new Map<string, string>();

    protected usages: string[] = [];

    protected hidden: boolean = false;

    protected validationErrors: boolean = false;

    protected helperSet: HelperSet | null = null;

    protected name: string;

    protected aliases: string[] = [];

    protected code: CommandCode<Arguments, Options> | null = null;

    public constructor(name?: string) {
        this.definition = new InputDefinition();
        if (name) {
            this.name = name;
        }
        this.configure();
    }

    public setCode(code: CommandCode<Arguments, Options>): this {
        this.code = code;

        return this;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): this {
        this.validateName(name);

        this.name = name;

        return this;
    }

    public async run(input: InputInterface<Arguments, Options>, output: OutputInterface): Promise<number> {
        this.getSynopsis(true);
        this.getSynopsis(false);

        this.mergeApplicationDefinition();

        try {
            input.bind(this.definition);
        } catch (exception) {
            if (!this.validationErrors) {
                throw exception;
            }
        }

        await this.initialize(input, output);

        if (input.isInteractive()) {
            await this.interact(input, output);
        }

        // The command name argument is often omitted when a command is executed directly with its run() method.
        // It would fail the validation if we didn't make sure the command argument is present,
        // since it's required by the application.
        if (input.hasArgument("command") && null === input.getArgument("command")) {
            input.setArgument("command", this.getName());
        }

        input.validate();

        let statusCode;
        if (this.code) {
            statusCode = await this.code(input, output);
        } else {
            statusCode = await this.execute(input, output);

            if (!NumberUtilities.isIntStrict(statusCode)) {
                throw new TypeError(util.format("Return value of \"%s.execute()\" must be of the type int, %s returned.", this.constructor.name, typeof statusCode));
            }
        }

        return statusCode;
    }

    public setApplication(application: ApplicationInterface | null = null): void {
        this.application = application;
        if (application) {
            this.setHelperSet(application.getHelperSet());
        } else {
            this.helperSet = null;
        }
    }

    public getApplication(): ApplicationInterface | null {
        return this.application;
    }

    public getDefinition(): InputDefinition {
        return this.definition;
    }

    public ignoreValidationErrors() {
        this.validationErrors = true;
    }

    public getAliases(): string[] {
        return this.aliases;
    }

    public setAliases(aliases: string[]): this {
        for (const alias of aliases) {
            this.validateName(alias);
        }

        this.aliases = aliases;

        return this;
    }

    public setDefinition(definitions: (OptionDefinition | ArgumentDefinition)[] | InputDefinition) {
        if (definitions instanceof InputDefinition) {
            this.definition = definitions;
        } else {
            this.definition.setDefinition(definitions);
        }

        return this;
    }

    public getDescription(): string | null {
        return this.description;
    }

    public setDescription(description: string): this {
        this.description = description;

        return this;
    }

    public getHelp(): string | null {
        return this.help;
    }

    public setHelp(help: string | null): this {
        this.help = help;

        return this;
    }

    // eslint-disable-next-line max-params
    public addArgument(name: string, mode: ArgumentMode = ArgumentMode.OPTIONAL, description: string = "", defaultValue: ArgumentValue | null = null): this {
        this.definition.addArgument(new ArgumentDefinition(name, mode, description, defaultValue));
        return this;
    }

    // eslint-disable-next-line max-params
    public addOption(name: string, shortcut: string | string[] | null = null, mode: OptionMode = OptionMode.VALUE_NONE, description: string = "", defaultValue: OptionValue | null = null): this {
        this.definition.addOption(new OptionDefinition(name, shortcut, mode, description, defaultValue));
        return this;
    }

    public getSynopsis(short?: boolean): string {
        const key = short
            ? "short"
            : "long";

        if (!this.synopsis.has(key)) {
            const synopsis = this.definition.getSynopsis(short);
            this.synopsis.set(key, `${this.getName()}${synopsis.length > 0 ? " " + synopsis : ""}`);
        }

        return this.synopsis.get(key) as string;

    }

    public getNativeDefinition(): InputDefinition {
        return this.definition;
    }

    /**
     * Get help processed with placeholder replacement
     *
     * @returns {string}
     */
    public getProcessedHelp(): string {
        const name = this.getName();
        const isSingleCommand = this.application && this.application.isSingleCommand();
        const help = this.getHelp();
        const text: string = (help && help.length > 0) ? help : (this.getDescription() ?? "");

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [nodePath, scriptFile] = process.argv;
        const scriptPath = path.relative(process.cwd(), scriptFile).replace(/[\\/]+/g, "/");

        return text
            .replace(/%command\.name%/g, name)
            .replace(/%command\.full_name%/g, isSingleCommand
                ? scriptPath
                : scriptPath + " " + name);
    }

    /**
     * Get all command usages
     *
     * @returns {string[]}
     */
    public getUsages(): string[] {
        return this.usages;
    }

    /**
     * Checks if the command is hidden
     * @returns {boolean}
     */
    public isHidden(): boolean {
        return this.hidden;
    }

    public addUsage(usage: string): this {
        if (this.getName().indexOf(usage) !== 0) {
            usage = `${this.getName()} ${usage}`;
        }

        this.usages.push(usage);

        return this;
    }

    public setHidden(hidden: boolean): this {
        this.hidden = hidden;

        return this;
    }

    public getHelperSet(): HelperSet | null {
        return this.helperSet;
    }

    public setHelperSet(helperSet: HelperSet) {
        this.helperSet = helperSet;
    }

    public getHelper<Type extends HelperInterface>(name: string): Type {
        if (null === this.helperSet) {
            throw new LogicException(`Cannot retrieve helper "${name}" because there is no HelperSet defined. Did you forget to add your command to the application or to set the application on the command using the setApplication() method? You can also set the HelperSet directly using the setHelperSet() method.`);
        }

        return this.helperSet.get<Type>(name);
    }

    public mergeApplicationDefinition(mergeArguments: boolean = true): void {
        if (null === this.application || (this.applicationDefinitionMerged && (this.applicationDefinitionMergedWithArgs || !mergeArguments))) {
            return;
        }

        if (!this.applicationDefinitionMerged) {
            const options = Array.from(this.application.getDefinition().getOptions().values());
            this.definition.addOptions(options);
            this.applicationDefinitionMerged = true;
        }

        if (mergeArguments) {
            const applicationArguments = Array.from(this.application.getDefinition().getArguments().values());
            const currentArguments = Array.from(this.definition.getArguments().values());

            this.definition.setArguments(applicationArguments);
            this.definition.addArguments(currentArguments);
            this.applicationDefinitionMergedWithArgs = true;
        }
    }

    /**
     * Initializes the command after the input has been bound and before the input is validated.
     *
     * This is mainly useful when a lot of commands extends one main command
     * where some things need to be initialized based on the input arguments and options.
     *
     * @param {InputInterface<Arguments, Options>} input
     * @param {OutputInterface} output
     * @returns {Promise<void>}
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected async initialize(input: InputInterface<Arguments, Options>, output: OutputInterface): Promise<void> {
        // optionally overwrite me
    }

    /**
     * Interacts with the user.
     *
     * This method is executed before the InputDefinition is validated.
     * This means that this is the only place where the command can
     * interactively ask for values of missing required arguments.
     *
     * @param {InputInterface<Arguments, Options>} input
     * @param {OutputInterface} output
     * @returns {Promise<void>}
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected async interact(input: InputInterface<Arguments, Options>, output: OutputInterface): Promise<void> {
        // optionally overwrite me
    }

    /**
     * Executes the current command.
     *
     * @param {InputInterface<Arguments, Options>} input
     * @param {OutputInterface} output
     * @returns {Promise<number>}
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected async execute(input: InputInterface<Arguments, Options>, output: OutputInterface): Promise<number> {
        throw new LogicException("You must override the execute() method in the concrete command class.");
    }

    /**
     * Configure the command definition
     */
    protected configure(): void {
        // optionally overwrite me
    }

    protected validateName(name: string) {
        if (!name.match(/^[^:]+(:[^:]+)*$/)) {
            throw new ArgumentException(util.format("Command name \"%s\" is invalid.", name));
        }
    }

}
