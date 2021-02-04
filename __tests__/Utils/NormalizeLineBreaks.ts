/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import * as os from "os";

export function normalizeLineBreaks(text: string) {
    return text.replace(new RegExp(os.EOL, "g"), "\n");
}
