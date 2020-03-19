/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import each from "jest-each";
import { ChoiceQuestion } from "../../src/Question/ChoiceQuestion";

describe("ChoiceQuestion test", () => {

    each([
        [
            false,
            ["First response", "First response ", " First response", " First response "],
            "First response",
        ],
        [
            true,
            ["First response", "First response ", " First response", " First response "],
            ["First response"],
        ],
        [
            true,
            ["First response,Second response", " First response , Second response "],
            ["First response", "Second response"],
        ],
    ]).it("should handle default expression - test set #%#", (multiselect, answers, expected) => {
        const question = new ChoiceQuestion("A Question", [
            "First response",
            "Second response",
            "Third response",
            "Fourth response",
        ]);

        question.setMultiselect(multiselect);

        for (const answer of answers) {
            const validator = question.getValidator();
            expect(validator).not.toBeNull();
            if (validator) {
                const actual = validator(answer);
                expect(actual).toEqual(expected);
            }
        }
    });

    it("should handle disabled trimmable", () => {
        const question = new ChoiceQuestion("A Question", [
            "First response ",
            " Second response",
            "  Third response  ",
        ]);

        question.setTrimmable(false);

        const validator = question.getValidator();
        expect(validator).not.toBeNull();
        if (validator) {
            expect(validator("  Third response  ")).toBe("  Third response  ");

            question.setTrimmable(false);

            expect(validator("  Third response  ")).toEqual("  Third response  ");

            question.setMultiselect(true);

            expect(validator("First response , Second response")).toEqual(["First response ", " Second response"]);
        }
    });

});
