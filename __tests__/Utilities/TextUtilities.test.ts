/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import each from "jest-each";
import { TextUtilities } from "../../src/Utilities/TextUtilities";

describe("TextUtilities tests", () => {

    it("should trim left", () => {
        const result = TextUtilities.trimLeft("\r\n   foo bar   \r\n");
        expect(result).toBe("foo bar   \r\n");
    });

    it("should trim left with char given", () => {
        const result = TextUtilities.trimLeft("foo bar", "fo");
        expect(result).toBe(" bar");
    });

    it("should trim right", () => {
        const result = TextUtilities.trimRight("\r\n   foo bar   \r\n");
        expect(result).toBe("\r\n   foo bar");
    });
    it("should trim right with char given", () => {
        const result = TextUtilities.trimRight("foo bar", "bar");
        expect(result).toBe("foo ");
    });

    it("should trim both", () => {
        const result = TextUtilities.trim("\r\n   foo bar   \r\n");
        expect(result).toBe("foo bar");
    });

    it("should trim both with char given", () => {
        const result = TextUtilities.trim("foo bar", "fobar");
        expect(result).toBe(" ");
    });

    each([
        ["foo <custom>bar</custom>", "foo bar"],
        ["foo <fg=blue>bar</fg=blue>", "foo bar"],
        ["foo <fg=blue>bar</>", "foo bar"],
    ]).it("should strip tags", (input, expected) => {
        const result = TextUtilities.stripTags(input);
        expect(result).toBe(expected);
    });

});
