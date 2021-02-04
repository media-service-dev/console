/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { ApplicationInterface } from "../Application/ApplicationInterface";
import { Command } from "../Command/Command";
import { CommandInterface } from "../Command/CommandInterface";
import { ArgumentException } from "../Exception/ArgumentException";
import { ArgumentDefinition } from "../Input/ArgumentDefinition";
import { InputDefinition } from "../Input/InputDefinition";
import { OptionDefinition } from "../Input/OptionDefinition";
import { OutputInterface } from "../Output/OutputInterface";
import { OutputMode } from "../Output/OutputMode";
import { DescriptorInterface } from "./DescriptorInterface";

export abstract class AbstractDescriptor<Options> implements DescriptorInterface<Options> {

    protected output!: OutputInterface;

    public describe(output: OutputInterface, target: ArgumentDefinition | OptionDefinition | InputDefinition | CommandInterface | ApplicationInterface, options: Options): void {
        this.output = output;

        if (target instanceof ArgumentDefinition) {
            this.describeArgumentDefinition(target, options);
        } else if (target instanceof OptionDefinition) {
            this.describeOptionDefinition(target, options);
        } else if (target instanceof InputDefinition) {
            this.describeInputDefinition(target, options);
        } else if (target instanceof Command) {
            this.describeCommand(target, options);
            // } else if (target instanceof Application) {
            //     this.describeApplication(target, options);
        } else {
            /**
             *  @todo hack to avoid circular dependency:
             *        -> import { Application } from "../Application/Application"; on top of this file and your have following dependency:
             *        -> Application/Application.ts > Command/HelpCommand.ts > Helper/DescriptorHelper.ts > Descriptor/JsonDescriptor.ts > Descriptor/AbstractDescriptor.ts
             */
            const app = require("../Application/Application");

            if (target instanceof app.Application) {
                this.describeApplication(target as ApplicationInterface, options);
            } else {
                throw new ArgumentException("Object is not describable.");
            }
        }
    }

    protected write(content: string, decorated: boolean = false) {
        if (decorated) {
            this.output.write(content, { newline: false, mode: OutputMode.OUTPUT_NORMAL });
        } else {
            this.output.write(content, { newline: false, mode: OutputMode.OUTPUT_RAW });
        }
    }

    protected abstract describeArgumentDefinition(argumentDefinition: ArgumentDefinition, options: Options): void;

    protected abstract describeOptionDefinition(optionDefinition: OptionDefinition, options: Options): void;

    protected abstract describeInputDefinition(inputDefinition: InputDefinition, options: Options): void;

    protected abstract describeCommand(command: CommandInterface, options: Options): void;

    protected abstract describeApplication(application: ApplicationInterface, options: Options): void;

}
