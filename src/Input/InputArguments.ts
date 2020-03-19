/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { ArgumentValue } from "./ArgumentValue";

export interface InputArguments {
    [key: string]: ArgumentValue;
}
