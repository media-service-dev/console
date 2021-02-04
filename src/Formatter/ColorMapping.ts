/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { Style } from "./Style";

export interface ColorMapping {
    black: Style;

    red: Style;

    green: Style;

    yellow: Style;

    blue: Style;

    magenta: Style;

    cyan: Style;

    white: Style;

    default: Style;
}
