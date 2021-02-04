/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { Command } from "../../../src/Command/Command";

export class DescriptorCommand4 extends Command {

    protected configure() {
        this
            .setName("descriptor:command4")
            .setAliases(["descriptor:aliasCommand4", "command4:descriptor"]);
    }

}
