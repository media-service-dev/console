/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { Command } from "../../../src/Command/Command";

export class Foo4Command extends Command {

    protected configure(): void {
        this.setName("foo3:bar:baz")
            .setDescription("The foo3:bar:baz command");
    }

}
