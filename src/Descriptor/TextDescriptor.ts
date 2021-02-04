/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { ApplicationInterface } from "../Application/ApplicationInterface";
import { CommandInterface } from "../Command/CommandInterface";
import { OutputFormatter } from "../Formatter/OutputFormatter";
import { ArgumentDefinition } from "../Input/ArgumentDefinition";
import { ArgumentValue } from "../Input/ArgumentValue";
import { InputDefinition } from "../Input/InputDefinition";
import { OptionDefinition } from "../Input/OptionDefinition";
import { OptionValue } from "../Input/OptionValue";
import { TextUtilities } from "../Utilities/TextUtilities";
import { AbstractDescriptor } from "./AbstractDescriptor";
import { ApplicationDescription } from "./ApplicationDescription";
import { TextDescriptorOptions } from "./TextDescriptorOptions";

export class TextDescriptor extends AbstractDescriptor<TextDescriptorOptions> {

    protected describeArgumentDefinition(argument: ArgumentDefinition, options: TextDescriptorOptions) {
        let defaultValue = "";

        if (null !== argument.getDefault() && (!Array.isArray(argument.getDefault()) || argument.getDefault().length)) {
            defaultValue = `<comment> [default: ${this.getFormatedValue(argument.getDefault())}]</comment>`;
        }

        const totalWidth = options.totalWidth
            ? options.totalWidth
            : argument.getName().length;
        const spacingWidth = totalWidth - argument.getName().length;

        this.writeText(`  <info>${argument.getName()}</info>  ${" ".repeat(spacingWidth)}${argument.getDescription().replace(/\s*[\r\n]\s*/, "\n" + " ".repeat(totalWidth + 4))}${defaultValue}`, options);
    }

    protected describeInputDefinition(inputDefinition: InputDefinition, options: TextDescriptorOptions) {
        let totalWidth = this.calculateTotalWidthForOptions(Array.from(inputDefinition.getOptions().values()));

        for (const argument of inputDefinition.getArguments().values()) {
            totalWidth = Math.max(totalWidth, argument.getName().length);
        }

        if (inputDefinition.getArguments().size) {
            this.writeText("<comment>Arguments:</comment>", options);
            this.writeText("\n");
            for (const argument of inputDefinition.getArguments().values()) {
                this.describeArgumentDefinition(argument, { ...options, totalWidth: totalWidth });
                this.writeText("\n");
            }
        }

        if (inputDefinition.getArguments().size && inputDefinition.getOptions().size) {
            this.writeText("\n");
        }

        if (inputDefinition.getOptions().size) {
            const laterOptions: OptionDefinition[] = [];

            this.writeText("<comment>Options:</comment>", options);
            for (const option of inputDefinition.getOptions().values()) {
                const shortcut = option.getShortcut();

                if (shortcut && shortcut.length > 0) {
                    laterOptions.push(option);
                    continue;
                }

                this.writeText("\n");
                this.describeOptionDefinition(option, { ...options, totalWidth: totalWidth });
            }

            for (const option of laterOptions) {
                this.writeText("\n");
                this.describeOptionDefinition(option, { ...options, totalWidth: totalWidth });
            }
        }
    }

    protected describeApplication(application: ApplicationInterface, options: TextDescriptorOptions) {
        const describedNamespace = options.namespace ?? null;
        const applicationDescription = new ApplicationDescription(application, describedNamespace);

        if (options.rawText ?? false) {
            const width = this.getColumnWidth(Array.from(applicationDescription.getCommands().values()));

            for (const command of applicationDescription.getCommands().values()) {
                const spaces = width - command.getName().length;

                this.writeText(`${command.getName()}${" ".repeat(spaces)}${command.getDescription()}`);
                this.writeText("\n");
            }
        } else {
            const help = application.getHelp();

            if (help.length > 0) {
                this.writeText(`${help}\n\n`, options);
            }

            this.writeText("<comment>Usage:</comment>\n", options);
            this.writeText("  command [options] [arguments]\n\n", options);

            const optionDefinitions = Array.from(application.getDefinition().getOptions().values());

            this.describeInputDefinition(new InputDefinition(optionDefinitions), options);
            this.writeText("\n");
            this.writeText("\n");

            const commands = applicationDescription.getCommands();
            const namespaces = applicationDescription.getNamespaces();

            if (describedNamespace && namespaces.size > 0) {
                const [namespace] = Array.from(namespaces.values());

                for (const name of namespace.commands) {
                    commands.set(name, applicationDescription.getCommand(name));
                }
            }

            const keys = Array.from(commands.keys());
            const width = this.getColumnWidth(Array.from(namespaces.values())
                .map((namespace) => {
                    return namespace.commands.filter(item => keys.includes(item));
                })
                .reduce(((previousValue, currentValue) => {
                    return [...previousValue, ...currentValue];
                }), []));

            if (describedNamespace) {
                this.writeText(`<comment>Available commands for the "${describedNamespace}" namespace:</comment>`);
            } else {
                this.writeText("<comment>Available commands:</comment>", options);
            }

            for (const namespace of namespaces.values()) {
                namespace.commands = namespace.commands.filter((name) => {
                    return commands.has(name);
                });

                if (!namespace.commands) {
                    continue;
                }

                if (!describedNamespace && ApplicationDescription.GLOBAL_NAMESPACE !== namespace.id && namespace.commands.length > 0) {
                    this.writeText("\n");
                    this.writeText(` <comment>${namespace.id}</comment>`, options);
                }

                for (const name of namespace.commands) {
                    this.writeText("\n");
                    const spacingWidth = width - name.length;
                    const command = commands.get(name);

                    if (command) {
                        const commandAliases = name === command.getName()
                            ? this.getCommandAliasesText(command)
                            : "";
                        const commandDescription: string = command.getDescription() ?? "";

                        this.writeText(`  <info>${name}</info>${" ".repeat(spacingWidth)}${commandAliases + commandDescription}`, options);
                    }
                }
            }

            this.writeText("\n");
        }
    }

    protected describeCommand(command: CommandInterface, options: TextDescriptorOptions) {
        command.getSynopsis(true);
        command.getSynopsis(false);
        command.mergeApplicationDefinition(false);

        const description = command.getDescription();

        if (description && description.length > 0) {
            this.writeText("<comment>Description:</comment>", options);
            this.writeText("\n");
            this.writeText("  " + description);
            this.writeText("\n\n");
        }

        this.writeText("<comment>Usage:</comment>", options);
        const usages = [command.getSynopsis(true), ...command.getAliases(), ...command.getUsages()];

        for (const usage of usages) {
            this.writeText("\n");
            this.writeText("  " + OutputFormatter.escapeBackslashes(usage), options);
        }

        this.writeText("\n");

        const definition = command.getNativeDefinition();

        if (definition.getOptions().size || definition.getArguments().size) {
            this.writeText("\n");
            this.describeInputDefinition(definition, options);
            this.writeText("\n");
        }

        const help = command.getProcessedHelp();

        if (help && help !== description) {
            this.writeText("\n");
            this.writeText("<comment>Help:</comment>", options);
            this.writeText("\n");
            this.writeText("  " + help.replace("\n", "\n  "), options);
            this.writeText("\n");

        }
    }

    protected describeOptionDefinition(optionDefinition: OptionDefinition, options: TextDescriptorOptions) {
        let defaultValue = "";
        const optionDefault = optionDefinition.getDefault();

        if (optionDefinition.acceptValue() && null !== optionDefault && (!Array.isArray(optionDefault) || optionDefault.length)) {
            defaultValue = `<comment> [default: ${this.getFormatedValue(optionDefault)}]</comment>`;
        }

        let value = "";

        if (optionDefinition.acceptValue()) {
            value = "=" + optionDefinition.getName().toUpperCase();

            if (optionDefinition.isValueOptional()) {
                value = `[${value}]`;
            }
        }

        const totalWidth = options.totalWidth ?? this.calculateTotalWidthForOptions([optionDefinition]);
        const shortcut = optionDefinition.getShortcut();
        const synopsis = `${shortcut
            ? `-${shortcut}, `
            : "    "}--${optionDefinition.getName()}${value}`;

        const spacingWidth = totalWidth - synopsis.length;
        const prefixSpace = " ".repeat(totalWidth + 4);

        this.writeText([
            `  <info>${synopsis}</info>  `,
            " ".repeat(spacingWidth),
            optionDefinition.getDescription().replace(/\s*[\r?\n]\s*/g, "\n" + prefixSpace),
            defaultValue,
            optionDefinition.isArray()
                ? " <comment>(multiple values allowed)</comment>"
                : "",
        ].join(""), options);
    }

    private getFormatedValue(value: ArgumentValue | OptionValue) {
        if (typeof value === "number" && value === Infinity) {
            return "INF";
        } else if (typeof value === "string") {
            value = OutputFormatter.escapeBackslashes(value);
        } else if (Array.isArray(value)) {
            value = value.map((item) => {
                return OutputFormatter.escapeBackslashes(item);
            });
        }

        return JSON.stringify(value).replace(/\\\\/g, "\\");
    }

    private writeText(text: string, options: TextDescriptorOptions = { format: "txt", rawText: false }) {
        this.write(
            (options.rawText ?? false)
                ? TextUtilities.stripTags(text)
                : text,
            (options.rawOutput ?? true),
        );
    }

    private calculateTotalWidthForOptions(optionDefinitions: OptionDefinition[]): number {
        let totalWidth: number = 0;

        for (const optionDefinition of optionDefinitions) {
            const shortcut = optionDefinition.getShortcut();
            let nameLength = 1 + (shortcut
                ? shortcut.length
                : 1) + 4 + optionDefinition.getName().length;

            if (optionDefinition.acceptValue()) {
                let valueLength = 1 + optionDefinition.getName().length;

                if (optionDefinition.isValueOptional()) {
                    valueLength += 2;
                } else {
                    valueLength += 0;
                }

                nameLength += valueLength;
            }

            totalWidth = Math.max(totalWidth, nameLength);
        }

        return totalWidth;
    }

    private getColumnWidth(commands: CommandInterface[] | string[]) {
        const widths: number[] = [];

        for (const command of commands) {
            if (typeof command === "string") {
                widths.push(command.length);
            } else {
                widths.push(command.getName().length);
                for (const alias of command.getAliases()) {
                    widths.push(alias.length);
                }
            }
        }

        if (widths.length) {
            return Math.max(...widths) + 2;
        }

        return 0;
    }

    private getCommandAliasesText(command: CommandInterface) {
        let text = "";
        const aliases = command.getAliases();

        if (aliases.length > 0) {
            text = `[${aliases.join("|")}] `;
        }

        return text;
    }

}
