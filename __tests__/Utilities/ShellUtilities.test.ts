/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import each from "jest-each";
import { ShellUtilities } from "../../src/Utilities/ShellUtilities";

describe("ShellUtilities tests", () => {

    each([
        ["--foo", "--foo"],
        ["--fo o ", "'--fo o '"],
        ["--fo2=o", "'--fo2=o'"],
    ]).it("should escape token", (input, expected) => {
        const result = ShellUtilities.escapeToken(input);
        expect(result).toBe(expected);
    });

    it("should escape argument", () => {
        const result = ShellUtilities.escapeShellArgument("foo bar");
        expect(result).toBe("'foo bar'");
    });

    it("should escape argument that contains apostrophe", () => {
        const result = ShellUtilities.escapeShellArgument("foo's bar");
        expect(result).toBe("'foo\\'s bar'");
    });

});
