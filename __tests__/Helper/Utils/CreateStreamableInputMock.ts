/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { Readable } from "stream";
import { CollectionInput } from "../../../src/Input/CollectionInput";

jest.mock("../../../src/Input/CollectionInput");

export function createStreamableInputMock(stream: Readable | null = null, interactive: boolean = true) {
    CollectionInput.prototype.getStream = jest.fn().mockImplementation(() => {
        return stream;
    });

    CollectionInput.prototype.isInteractive = jest.fn().mockImplementation(() => {
        return interactive;
    });

    return new CollectionInput([]);
}
