/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { TesterReadableStream } from "../../../src/Tester/TesterReadableStream";
import { LineByLineStream } from "../../../src/Utilities/LineByLineStream";

// eslint-disable-next-line no-magic-numbers
export function createStream(data: string, highWaterMark: number = 16) {
    return new LineByLineStream(new TesterReadableStream(data, highWaterMark));
}
