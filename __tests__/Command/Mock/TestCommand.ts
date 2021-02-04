/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { Command } from "../../../src/Command/Command";
import { InputInterface } from "../../../src/Input/InputInterface";
import { OutputInterface } from "../../../src/Output/OutputInterface";

export class TestCommand extends Command {

    protected configure(): void {
        this.setName("namespace:name")
            .setAliases(["name"])
            .setDescription("description")
            .setHelp("help");
    }

    protected async execute(input: InputInterface, output: OutputInterface): Promise<number> {
        output.writeln("execute called");

        return 0;
    }

    protected async interact(input: InputInterface, output: OutputInterface): Promise<void> {
        output.writeln("interact called");
    }

}
