/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { DescriptorHelper } from "../Helper/DescriptorHelper";
import { ArgumentDefinition } from "../Input/ArgumentDefinition";
import { ArgumentMode } from "../Input/ArgumentMode";
import { InputArguments } from "../Input/InputArguments";
import { InputInterface } from "../Input/InputInterface";
import { InputOptions } from "../Input/InputOptions";
import { OptionDefinition } from "../Input/OptionDefinition";
import { OptionMode } from "../Input/OptionMode";
import { OutputInterface } from "../Output/OutputInterface";
import { Command } from "./Command";
import { CommandInterface } from "./CommandInterface";

export interface HelpCommandArguments extends InputArguments {
    commandName: string;
}

export interface HelpCommandOptions extends InputOptions {
    format: string;

    raw: boolean;
}

export class HelpCommand extends Command<HelpCommandArguments, HelpCommandOptions> {

    protected command: CommandInterface | null = null;

    public setCommand(command: CommandInterface) {
        this.command = command;
    }

    public getName(): string {
        return "help";
    }

    protected configure(): void {
        this.setDefinition([
            new ArgumentDefinition("commandName", ArgumentMode.OPTIONAL, "The command name", "help"),
            new OptionDefinition("format", null, OptionMode.VALUE_REQUIRED, "The output format (txt or json)", "txt"),
            new OptionDefinition("raw", null, OptionMode.VALUE_NONE, "To output raw command help"),
        ])
            .setDescription("Displays help for a command")
            .setHelp(`The <info>%command.name%</info> command displays help for a given command:

  <info>node %command.full_name% list</info>

You can also output the help in other formats by using the <comment>--format</comment> option:

  <info>node %command.full_name% --format=json list</info>

To display the list of available commands, please use the <info>list</info> command.`);
    }

    protected async execute(input: InputInterface<HelpCommandArguments, HelpCommandOptions>, output: OutputInterface): Promise<number> {
        if (null === this.command) {
            const name = input.getArgument("commandName");
            const application = this.getApplication();
            if (name && typeof name === "string" && application) {
                this.command = application.find(name);
            }
        }

        if (this.command) {
            const helper = new DescriptorHelper();
            helper.describe(output, this.command, {
                format: input.getOption("format"),
                rawText: input.getOption("raw"),
            });
        }

        this.command = null;

        return 0;
    }

}
