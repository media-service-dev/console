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

export class Foo1Command extends Command {

    public output: OutputInterface;

    public input: InputInterface;

    protected configure(): void {
        this.setName("foo:bar1")
            .setDescription("The foo:bar1 command")
            .setAliases(["afoobar1"]);
    }

    protected async execute(input: InputInterface, output: OutputInterface): Promise<number> {
        this.input = input;
        this.output = output;

        return 0;
    }

}
