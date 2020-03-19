/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { Command } from "../../../src/Command/Command";

export class DescriptorCommand1 extends Command {

    protected configure() {
        this
            .setName("descriptor:command1")
            .setAliases(["alias1", "alias2"])
            .setDescription("command 1 description")
            .setHelp("command 1 help");
    }

}
