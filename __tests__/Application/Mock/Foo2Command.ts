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

export class Foo2Command extends Command {

    protected configure(): void {
        this.setName("foo1:bar")
            .setDescription("The foo1:bar command")
            .setAliases(["afoobar2"]);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected async execute(input: InputInterface, output: OutputInterface): Promise<number> {
        return 0;
    }

}
