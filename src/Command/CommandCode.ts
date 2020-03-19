/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { InputArguments } from "../Input/InputArguments";
import { InputInterface } from "../Input/InputInterface";
import { InputOptions } from "../Input/InputOptions";
import { OutputInterface } from "../Output/OutputInterface";

export type CommandCode<Arguments extends InputArguments = {}, Options extends InputOptions = {}> = (input: InputInterface<Arguments, Options>, output: OutputInterface) => Promise<number>;
