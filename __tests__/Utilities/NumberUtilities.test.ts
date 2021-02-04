/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import each from "jest-each";
import { NumberUtilities } from "../../src/Utilities/NumberUtilities";

describe("NumberUtilities tests", () => {

    each([
        [100, 100],
        [-10, -10],
        ["10", 10],
        ["A10", NaN],
        [" 0xF", NaN],
        ["F", NaN],
        [0x0, 0],
        [15.99, 15.99],
        ["15 * 3", NaN],
        ["123_456", NaN],
    ]).it("should parse int strict", (input, expected) => {
        const result = NumberUtilities.parseIntStrict(input);
        expect(result).toBe(expected);
    });

    each([
        [100, true],
        [-10, true],
        ["10", true],
        ["A10", false],
        [" 0xF", false],
        ["F", false],
        [0x0, true],
        [15.99, true],
        ["15 * 3", false],
        ["123_456", false],
    ]).it("should check int strict", (input, expected) => {
        const result = NumberUtilities.isIntStrict(input);
        expect(result).toBe(expected);
    });

});
