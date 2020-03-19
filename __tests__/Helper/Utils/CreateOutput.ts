/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { StreamOutput } from "../../../src/Output/StreamOutput";
import { TesterDuplexStream } from "../../../src/Tester/TesterDuplexStream";

export function createOutput() {
    return new StreamOutput(new TesterDuplexStream());
}
