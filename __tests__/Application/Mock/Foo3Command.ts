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

export class Foo3Command extends Command {

    protected configure(): void {
        this.setName("foo3:bar")
            .setDescription("The foo3:bar command");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected async execute(input: InputInterface, output: OutputInterface): Promise<number> {
        throw new Error("Something went wrong.");
    }

}
