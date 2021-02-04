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

export class FoobarCommand extends Command {

    public input: InputInterface;

    public output: OutputInterface;

    protected configure(): void {
        this.setName("foobar:foo")
            .setDescription("The foobar:foo command");
    }

    protected async execute(input: InputInterface, output: OutputInterface): Promise<number> {
        this.input = input;
        this.output = output;

        return 0;
    }

}
