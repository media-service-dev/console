/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { OutputFormatterInterface } from "./OutputFormatterInterface";

export interface WrappableOutputFormatterInterface extends OutputFormatterInterface {

    formatAndWrap(message: string, width: number): string;

}
