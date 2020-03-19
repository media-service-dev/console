/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import each from "jest-each";
import { ConfirmationQuestion } from "../../src/Question/ConfirmationQuestion";

describe("ConfirmationQuestion test", () => {

    each([
        [
            true,
            ["y", "Y", "yes", "YES", "yEs", ""],
            true,
        ],
        [
            true,
            ["n", "N", "no", "NO", "nO", "foo", "1", "0"],
            false,
        ],
        [
            false,
            ["y", "Y", "yes", "YES", "yEs"],
            true,
        ],
        [
            false,
            ["n", "N", "no", "NO", "nO", "foo", "1", "0", ""],
            false,
        ],
    ]).it("should handle default expression - test set #%#", (defaultValue, answers, expected) => {
        const question = new ConfirmationQuestion("A Question", defaultValue);

        for (const answer of answers) {
            const normalizer = question.getNormalizer();
            expect(normalizer).not.toBeNull();
            if (normalizer) {
                const actual = normalizer(answer);
                expect(actual).toBe(expected);
            }
        }
    });

});
