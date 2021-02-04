/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { Command } from "../../../src/Command/Command";

export class DescriptorCommand3 extends Command {

    protected configure() {
        this
            .setName("descriptor:command3")
            .setDescription("command 3 description")
            .setHelp("command 3 help")
            .setHidden(true);
    }

}
