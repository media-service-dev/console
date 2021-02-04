/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { ArgumentException } from "../../src/Exception/ArgumentException";
import { Question } from "../../src/Question/Question";
import { Validator } from "../../src/Question/Validator";

describe("Question tests", () => {

    it("should handle question in constructor", () => {
        const question = new Question("Foo?");

        expect(question.getMessage()).toBe("Foo?");
        expect(question.getDefault()).toBeNull();
    });

    it("should handle default value in constructor", () => {
        const question = new Question("Foo?", "bar");

        expect(question.getMessage()).toBe("Foo?");
        expect(question.getDefault()).toBe("bar");
    });

    it("should handle prompt set and get", () => {
        const question = new Question("Foo?");

        expect(question.getPrompt()).toBe(">");
        question.setPrompt(" $>: ");
        expect(question.getPrompt()).toBe(" $>: ");
    });

    it("should handle maxAttempts get and set", () => {
        const question = new Question("Foo?");

        expect(question.getMaxAttempts()).toBeNull();
        question.setMaxAttempts(5);
        expect(question.getMaxAttempts()).toBe(5);
    });

    it("should should fail on negative numbers in max attempts", () => {
        expect.assertions(1);

        const question = new Question("Foo?");

        expect(() => {
            question.setMaxAttempts(-1337);
        }).toThrow(ArgumentException);
    });

    it("should handle hidden get and set", () => {
        const question = new Question("Foo?");
        expect(question.isHidden()).toBeFalsy();
        question.setHidden(true);
        expect(question.isHidden()).toBeTruthy();
    });

    it("should handle trimmable get and set", () => {
        const question = new Question("Foo?");
        expect(question.isTrimmable()).toBeTruthy();
        question.setTrimmable(false);
        expect(question.isTrimmable()).toBeFalsy();
    });

    it("should handle validator get and set", () => {
        const question = new Question<string>("Foo?");
        const validator: Validator<string> = (value: string | null) => {
            if (!value) {
                throw new Error("error");
            }
            return value;
        };

        expect(question.getValidator()).toBeNull();
        question.setValidator(validator);
        expect(question.getValidator()).toBe(validator);
    });

    it("should handle normalizer get and set", () => {
        const question = new Question<number>("Foo?");
        const normalizer = (value: string) => {
            return parseInt(value, 10);
        };

        expect(question.getNormalizer()).toBeNull();
        question.setNormalizer(normalizer);
        expect(question.getNormalizer()).toBe(normalizer);
    });

});
