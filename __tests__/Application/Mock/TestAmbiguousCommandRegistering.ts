/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { Command } from "../../../src/Command/Command";
import { InputInterface } from "../../../src/Input/InputInterface";
import { OutputInterface } from "../../../src/Output/OutputInterface";

export class TestAmbiguousCommandRegistering extends Command {

    protected configure(): void {
        this
            .setName("test-ambiguous")
            .setDescription("The test-ambiguous command")
            .setAliases(["test"]);
    }

    protected async execute(input: InputInterface, output: OutputInterface): Promise<number> {
        output.write("test-ambiguous");

        return 0;
    }

}
