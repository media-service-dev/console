/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { DescriptorHelper } from "../Helper/DescriptorHelper";
import { ArgumentDefinition } from "../Input/ArgumentDefinition";
import { ArgumentMode } from "../Input/ArgumentMode";
import { InputArguments } from "../Input/InputArguments";
import { InputDefinition } from "../Input/InputDefinition";
import { InputInterface } from "../Input/InputInterface";
import { InputOptions } from "../Input/InputOptions";
import { OptionDefinition } from "../Input/OptionDefinition";
import { OptionMode } from "../Input/OptionMode";
import { OutputInterface } from "../Output/OutputInterface";
import { Command } from "./Command";
import { CommandInterface } from "./CommandInterface";

export interface ListCommandArguments extends InputArguments {
    namespace: string;
}

export interface ListCommandOptions extends InputOptions {
    format: string;

    raw: boolean;
}

export class ListCommand extends Command<ListCommandArguments, ListCommandOptions> {

    protected command: CommandInterface | null = null;

    public setCommand(command: CommandInterface) {
        this.command = command;
    }

    public getName(): string {
        return "list";
    }

    protected configure(): void {
        this
            .setDefinition(this.createDefinition())
            .setDescription("Lists commands")
            .setHelp(`The <info>%command.name%</info> command lists all commands:

  <info>node %command.full_name%</info>

You can also display the commands for a specific namespace:

  <info>node %command.full_name% test</info>

You can also output the information in other formats by using the <comment>--format</comment> option:

  <info>node %command.full_name% --format=json</info>

It's also possible to get raw list of commands (useful for embedding command runner):

  <info>node %command.full_name% --raw</info>`);
    }

    protected async execute(input: InputInterface<ListCommandArguments, ListCommandOptions>, output: OutputInterface): Promise<number> {
        const helper = new DescriptorHelper();
        const application = this.getApplication();

        if (application) {
            helper.describe(output, application, {
                format: input.getOption("format"),
                rawText: input.getOption("raw"),
                namespace: input.getArgument("namespace"),
            });
        }

        return 0;
    }

    private createDefinition(): InputDefinition {
        return new InputDefinition([
            new ArgumentDefinition("namespace", ArgumentMode.OPTIONAL, "The namespace name"),
            new OptionDefinition("raw", null, OptionMode.VALUE_NONE, "To output raw command list"),
            new OptionDefinition("format", null, OptionMode.VALUE_REQUIRED, "The output format (txt or json)", "txt"),
        ]);
    }

}
