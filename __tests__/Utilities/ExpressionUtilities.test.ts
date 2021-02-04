/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { ArgumentException } from "../../src/Exception/ArgumentException";
import { ExpressionUtilities } from "../../src/Utilities/ExpressionUtilities";

describe("ExpressionUtilitites tests", () => {

    it("should fail on missing global flag", () => {
        expect(() => {
            ExpressionUtilities.matchAll("example", /example/);
        }).toThrowError(ArgumentException);
    });

    it("should match all", () => {
        const result = ExpressionUtilities.matchAll("a,b,c,d,e,f,g", /(\w+),/g);

        expect(JSON.stringify(result)).toEqual("[[\"a,\",\"a\"],[\"b,\",\"b\"],[\"c,\",\"c\"],[\"d,\",\"d\"],[\"e,\",\"e\"],[\"f,\",\"f\"]]");
    });

});
