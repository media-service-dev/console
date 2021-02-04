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

export class FooCommand extends Command {

    public input!: InputInterface;

    public output!: OutputInterface;

    protected configure(): void {
        this.setName("foo:bar")
            .setDescription("The foo:bar command")
            .setAliases(["afoobar"]);
    }

    protected async interact(input: InputInterface, output: OutputInterface): Promise<void> {
        output.writeln("interact called");
    }

    protected async execute(input: InputInterface, output: OutputInterface): Promise<number> {

        this.input = input;
        this.output = output;

        output.writeln("called");

        return 0;
    }

}
