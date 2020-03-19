/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { Command } from "../../../src/Command/Command";
import { ArgumentMode } from "../../../src/Input/ArgumentMode";
import { OptionMode } from "../../../src/Input/OptionMode";

export class DescriptorCommand2 extends Command {

    protected configure() {
        this
            .setName("descriptor:command2")
            .setDescription("command 2 description")
            .setHelp("command 2 help")
            .addUsage("-o|--optionName <argumentName>")
            .addUsage("<argumentName>")
            .addArgument("argumentName", ArgumentMode.REQUIRED)
            .addOption("optionName", "o", OptionMode.VALUE_NONE);
    }

}
