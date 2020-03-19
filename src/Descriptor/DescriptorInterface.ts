/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { ApplicationInterface } from "../Application/ApplicationInterface";
import { CommandInterface } from "../Command/CommandInterface";
import { ArgumentDefinition } from "../Input/ArgumentDefinition";
import { InputDefinition } from "../Input/InputDefinition";
import { OptionDefinition } from "../Input/OptionDefinition";
import { OutputInterface } from "../Output/OutputInterface";

export interface DescriptorInterface<Options> {

    describe(output: OutputInterface, target: ArgumentDefinition | OptionDefinition | InputDefinition | CommandInterface | ApplicationInterface, options: Options): void;

}
