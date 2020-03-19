/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { ApplicationInterface } from "../Application/ApplicationInterface";
import { CommandInterface } from "../Command/CommandInterface";
import { BaseDescriptorOptions } from "../Helper/BaseDescriptorOptions";
import { ArgumentDefinition } from "../Input/ArgumentDefinition";
import { InputDefinition } from "../Input/InputDefinition";
import { OptionDefinition } from "../Input/OptionDefinition";
import { AbstractDescriptor } from "./AbstractDescriptor";
import { ApplicationData } from "./ApplicationData";
import { ApplicationDescription } from "./ApplicationDescription";
import { ArgumentDefinitionData } from "./ArgumentDefinitionData";
import { CommandData } from "./CommandData";
import { InputDefinitionData } from "./InputDefinitionData";
import { OptionDefinitionData } from "./OptionDefinitionData";

export class JsonDescriptor extends AbstractDescriptor<BaseDescriptorOptions> {

    protected describeApplication(application: ApplicationInterface, options: BaseDescriptorOptions) {
        const describedNamespace = options.namespace ?? null;
        const description = new ApplicationDescription(application, describedNamespace, true);
        const commands: CommandData[] = [];

        for (const command of description.getCommands().values()) {
            commands.push(this.getCommandData(command));
        }

        const data: ApplicationData = {
            commands,
            application: {
                name: application.getName(),
                version: application.getVersion().format(),
            },
        };

        if (describedNamespace) {
            data.namespace = describedNamespace;
        } else {
            data.namespaces = Array.from(description.getNamespaces().values());
        }

        this.writeData(data);
    }

    protected describeArgumentDefinition(argumentDefinition: ArgumentDefinition) {
        this.writeData(this.getArgumentDefinitionData(argumentDefinition));
    }

    protected describeCommand(command: CommandInterface) {
        this.writeData(this.getCommandData(command));
    }

    protected describeInputDefinition(inputDefinition: InputDefinition) {
        this.writeData(this.getInputDefinitionData(inputDefinition));
    }

    protected describeOptionDefinition(optionDefinition: OptionDefinition) {
        this.writeData(this.getOptionDefinitionData(optionDefinition));
    }

    private writeData(data: unknown) {
        this.write(JSON.stringify(data));
    }

    private getArgumentDefinitionData(argumentDefinition: ArgumentDefinition): ArgumentDefinitionData {
        const defaultValue = argumentDefinition.getDefault();

        return {
            name: argumentDefinition.getName(),
            isRequired: argumentDefinition.isRequired(),
            isArray: argumentDefinition.isArray(),
            description: argumentDefinition.getDescription().replace(/\s*[\r\n]\s*/, " "),
            default: (defaultValue as unknown) === Infinity ? "INF" : defaultValue,
        };
    }

    private getOptionDefinitionData(optionDefinition: OptionDefinition): OptionDefinitionData {
        const defaultValue = optionDefinition.getDefault();

        return {
            name: "--" + optionDefinition.getName(),
            shortcut: optionDefinition.getShortcut()
                ? "-" + (optionDefinition.getShortcut() ?? "").replace(/[|]/g, "|-")
                : "",
            acceptValue: optionDefinition.acceptValue(),
            isValueRequired: optionDefinition.isValueRequired(),
            isMultiple: optionDefinition.isArray(),
            description: optionDefinition.getDescription().replace(/\s*[\r\n]\s*/, " "),
            default: (defaultValue as unknown) === Infinity ? "INF" : defaultValue,
        };

    }

    private getInputDefinitionData(inputDefinition: InputDefinition): InputDefinitionData {
        const inputArguments: { [key: string]: ArgumentDefinitionData } = {};
        for (const [name, argument] of inputDefinition.getArguments().entries()) {
            inputArguments[name] = this.getArgumentDefinitionData(argument);
        }

        const inputOptions: { [key: string]: OptionDefinitionData } = {};
        for (const [name, option] of inputDefinition.getOptions()) {
            inputOptions[name] = this.getOptionDefinitionData(option);
        }
        return { arguments: inputArguments, options: inputOptions };
    }

    private getCommandData(command: CommandInterface): CommandData {
        command.getSynopsis();
        command.mergeApplicationDefinition(false);

        return {
            name: command.getName(),
            usage: [command.getSynopsis(), ...command.getUsages(), ...command.getAliases()],
            description: command.getDescription(),
            help: command.getProcessedHelp(),
            definition: this.getInputDefinitionData(command.getNativeDefinition()),
            hidden: command.isHidden(),
        };
    }

}
