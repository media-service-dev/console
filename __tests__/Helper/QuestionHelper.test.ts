/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import each from "jest-each";
import { ArgumentException } from "../../src/Exception/ArgumentException";
import { LogicException } from "../../src/Exception/LogicException";
import { RuntimeException } from "../../src/Exception/RuntimeException";
import { FormatterHelper } from "../../src/Helper/FormatterHelper";
import { HelperSet } from "../../src/Helper/HelperSet";
import { QuestionHelper } from "../../src/Helper/QuestionHelper";
import { ChoiceQuestion } from "../../src/Question/ChoiceQuestion";
import { ConfirmationQuestion } from "../../src/Question/ConfirmationQuestion";
import { Question } from "../../src/Question/Question";
import { TesterDuplexStream } from "../../src/Tester/TesterDuplexStream";
import { createOutput } from "./Utils/CreateOutput";
import { createStream } from "./Utils/CreateStream";
import { createStreamableInputMock } from "./Utils/CreateStreamableInputMock";

describe("QuestionHelper", () => {

    const questionHelper = new QuestionHelper();
    const helperSet = new HelperSet([new FormatterHelper()]);
    const heroes = ["Superman", "Batman", "Spiderman"];
    questionHelper.setHelperSet(helperSet);

    describe("Interactive", () => {

        it("should handle enter press and default value", async () => {
            // Arrange
            const question = new ChoiceQuestion("What is your favorite superhero?", heroes, "Spiderman");
            question.setMaxAttempts(1);

            const input = createStreamableInputMock(createStream("\n"));
            const output = createOutput();

            // Act
            const actual = await questionHelper.ask(input, output, question);

            // Assert
            expect(actual).toBe("Spiderman");
        });

        it("should handle input", async () => {
            // Arrange
            const question = new ChoiceQuestion("What is your favorite superhero?", heroes);
            question.setMaxAttempts(1);
            const input = createStreamableInputMock(createStream("Batman\n"));
            const output = createOutput();

            // Act
            const actual = await questionHelper.ask(input, output, question);

            // Assert
            expect(actual).toBe("Batman");
        });

        it("should handle input with spaces", async () => {
            // Arrange
            const question = new ChoiceQuestion("What is your favorite superhero?", heroes);
            question.setMaxAttempts(1);
            const input = createStreamableInputMock(createStream("  Batman  \n"));
            const output = createOutput();

            // Act
            const actual = await questionHelper.ask(input, output, question);

            // Assert
            expect(actual).toBe("Batman");
        });

        it("should handle bad input with custom message", async () => {
            // Arrange
            const question = new ChoiceQuestion("What is your favorite superhero?", heroes);
            question.setErrorMessage("Input \"%s\" is not a superhero!");
            question.setMaxAttempts(2);

            const stream = createStream("Foo\nBatman", 2);
            const input = createStreamableInputMock(stream);
            const output = createOutput();

            // Act
            const actual = await questionHelper.ask(input, output, question);

            // Assert
            const data = (output.getStream() as TesterDuplexStream).getContents().toString();
            expect(actual).toBe("Batman");
            expect(data).toContain("Input \"Foo\" is not a superhero!");
        });

        it("should handle mutiple inputs with single select", async () => {
            // Arrange
            const question = new ChoiceQuestion("What is your favorite superhero?", heroes, null);
            question.setMaxAttempts(1);
            question.setMultiselect(true);

            const input = createStreamableInputMock(createStream("Batman\n"));
            const output = createOutput();

            // Act
            const actual = await questionHelper.ask(input, output, question);

            // Assert
            expect(actual).toEqual(["Batman"]);
        });

        it("should handle mutiple inputs with multiple select", async () => {
            // Arrange
            const question = new ChoiceQuestion("What is your favorite superhero?", heroes, null);
            question.setMaxAttempts(1);
            question.setMultiselect(true);

            const input = createStreamableInputMock(createStream("Superman,Spiderman\n"));
            const output = createOutput();

            // Act
            const actual = await questionHelper.ask(input, output, question);

            // Assert
            expect(actual).toEqual(["Superman", "Spiderman"]);
        });

        it("should handle mutiple inputs with multiple select and spaces", async () => {
            // Arrange
            const question = new ChoiceQuestion("What is your favorite superhero?", heroes, null);
            question.setMaxAttempts(1);
            question.setMultiselect(true);

            const input = createStreamableInputMock(createStream(" Superman , Spiderman  \n"));
            const output = createOutput();

            // Act
            const actual = await questionHelper.ask(input, output, question);

            // Assert
            expect(actual).toEqual(["Superman", "Spiderman"]);
        });

        it("should handle mutiple inputs with enter and default values", async () => {
            // Arrange
            const question = new ChoiceQuestion("What is your favorite superhero?", heroes, "Superman,Batman");
            question.setMaxAttempts(1);
            question.setMultiselect(true);

            const input = createStreamableInputMock(createStream("\n\n\n"));
            const output = createOutput();

            // Act
            const actual = await questionHelper.ask(input, output, question);

            // Assert
            expect(actual).toEqual(["Superman", "Batman"]);
        });

        it("should handle mutiple inputs with enter and default values with spaces", async () => {
            // Arrange
            const question = new ChoiceQuestion("What is your favorite superhero?", heroes, " Superman , Batman ");
            question.setMaxAttempts(1);
            question.setMultiselect(true);

            const input = createStreamableInputMock(createStream("\n\n"));
            const output = createOutput();

            // Act
            const actual = await questionHelper.ask(input, output, question);

            // Assert
            expect(actual).toEqual(["Superman", "Batman"]);
        });

        it("should handle enter with default index value", async () => {
            // Arrange
            const question = new ChoiceQuestion("What is your favorite superhero?", heroes, "Superman");
            const input = createStreamableInputMock(createStream("\n"));
            const output = createOutput();

            // Act
            const actual = await questionHelper.ask(input, output, question);

            // Assert
            expect(actual).toBe("Superman");
        });

    });

    describe("Not interactive", () => {

        it("should handle enter press and default value", async () => {
            // Arrange
            const question = new ChoiceQuestion("What is your favorite superhero?", heroes, "Superman");
            question.setMaxAttempts(1);

            const input = createStreamableInputMock(createStream("\n"), false);
            const output = createOutput();

            // Act
            const actual = await questionHelper.ask(input, output, question);

            // Assert
            expect(actual).toBe("Superman");
        });

        it("should handle input with default value", async () => {
            // Arrange
            const question = new ChoiceQuestion("What is your favorite superhero?", heroes, "Batman");
            question.setMaxAttempts(1);
            const input = createStreamableInputMock(createStream("Batman\n"), false);
            const output = createOutput();

            // Act
            const actual = await questionHelper.ask(input, output, question);

            // Assert
            expect(actual).toBe("Batman");
        });

        it("should handle input with null as default", async () => {
            // Arrange
            const question = new ChoiceQuestion("What is your favorite superhero?", heroes, null);
            question.setMaxAttempts(1);
            const input = createStreamableInputMock(createStream("  Batman  \n"), false);
            const output = createOutput();

            // Act
            const actual = await questionHelper.ask(input, output, question);

            // Assert
            expect(actual).toBeNull();
        });

        it("should handle default value and null validator", async () => {
            // Arrange
            const question = new ChoiceQuestion("What is your favorite superhero?", heroes, "Superman");
            question.setValidator(null);
            const input = createStreamableInputMock(createStream("Foo\n"), false);
            const output = createOutput();

            // Act
            const actual = await questionHelper.ask(input, output, question);

            // Assert
            expect(actual).toBe("Superman");
        });

        it("should handle default value input with multiple select", async () => {
            // Arrange
            const question = new ChoiceQuestion("What is your favorite superhero?", heroes, "Superman,Spiderman");
            question.setMaxAttempts(1);
            question.setMultiselect(true);

            const input = createStreamableInputMock(createStream("Superman,Batman\n"), false);
            const output = createOutput();

            // Act
            const actual = await questionHelper.ask(input, output, question);

            // Assert
            expect(actual).toEqual(["Superman", "Spiderman"]);
        });

        it("should handle default value input with multiple select and spaces", async () => {
            // Arrange
            const question = new ChoiceQuestion("What is your favorite superhero?", heroes, " Superman , Spiderman  ");
            question.setMaxAttempts(1);
            question.setMultiselect(true);

            const input = createStreamableInputMock(createStream(" Batman , Superman  \n"), false);
            const output = createOutput();

            // Act
            const actual = await questionHelper.ask(input, output, question);

            // Assert
            expect(actual).toEqual(["Superman", "Spiderman"]);
        });

        it("should handle mutiple inputs with enter and default values", async () => {
            // Arrange
            const question = new ChoiceQuestion("What is your favorite superhero?", heroes, "Superman,Batman");
            question.setMaxAttempts(1);
            question.setMultiselect(true);

            const input = createStreamableInputMock(createStream("\n"), false);
            const output = createOutput();

            // Act
            const actual = await questionHelper.ask(input, output, question);

            // Assert
            expect(actual).toEqual(["Superman", "Batman"]);
        });

    });

    describe("Ask Question", () => {

        it("should handle simple question with default value and not input", async () => {
            // Arrange
            const question = new Question("What time is it?", "2PM");
            const input = createStreamableInputMock(createStream("\n8AM\n"));
            const output = createOutput();

            // Act
            const actual = await questionHelper.ask(input, output, question);

            // Assert
            expect(actual).toBe("2PM");
        });

        it("should handle simple question with default value and input", async () => {
            // Arrange
            const question = new Question("What time is it?", "2PM");
            const input = createStreamableInputMock(createStream("8AM\n"));
            const output = createOutput();

            // Act
            const actual = await questionHelper.ask(input, output, question);

            // Assert
            const data = (output.getStream() as TesterDuplexStream).getContents().toString();
            expect(actual).toBe("8AM");
            expect(data).toContain("What time is it?");
        });

        it("should handle simple question with no trimmed", async () => {
            // Arrange
            const question = new Question("What time is it?", "2PM");
            question.setTrimmable(false);
            const input = createStreamableInputMock(createStream("  8AM  "));
            const output = createOutput();

            // Act
            const actual = await questionHelper.ask(input, output, question);

            // Assert
            const data = (output.getStream() as TesterDuplexStream).getContents().toString();
            expect(actual).toBe("  8AM  ");
            expect(data).toContain("What time is it?");
        });

    });

    describe("Ask with hidden", () => {

        it("should work with hiden input", async () => {
            // Arrange
            const question = new Question("What time is it?");
            question.setHidden(true);
            const input = createStreamableInputMock(createStream("8AM\n"));
            const output = createOutput();

            // Act
            const actual = await questionHelper.ask(input, output, question);

            // Assert
            expect(actual).toBe("8AM");
        });

        it("should work with hiden input and not trimmed", async () => {
            // Arrange
            const question = new Question("What time is it?");
            question.setHidden(true);
            question.setTrimmable(false);
            const input = createStreamableInputMock(createStream("  8AM  \n"));
            const output = createOutput();

            // Act
            const actual = await questionHelper.ask(input, output, question);

            // Assert
            expect(actual).toBe("  8AM  ");
        });

        it("should work with hidden input and trimmed", async () => {
            // Arrange
            const question = new Question("What time is it?");
            question.setHidden(true);
            const input = createStreamableInputMock(createStream("  8AM  \n"));
            const output = createOutput();

            // Act
            const actual = await questionHelper.ask(input, output, question);

            // Assert
            expect(actual).toBe("8AM");
        });

    });

    describe("Ask confirmation", () => {

        each([
            ["", true],
            ["", false, false],
            ["y", true],
            ["yes", true],
            ["n", false],
            ["no", false],
        ]).it("should ", async (awnser: string, expected: boolean, defaultValue: boolean = true) => {
            // Arrange
            const question = new ConfirmationQuestion("Do you like potatos?", defaultValue);
            const input = createStreamableInputMock(createStream(awnser + "\n"));
            const output = createOutput();

            // Act
            const actual = await questionHelper.ask(input, output, question);

            // Assert
            expect(actual).toBe(expected);
        });

        it("should handle custom true answer", async () => {
            // Arrange
            const question = new ConfirmationQuestion("Do you like potatos?", false, /^(aaa)/i);
            const input = createStreamableInputMock(createStream("aaa\n"));
            const input1 = createStreamableInputMock(createStream("bbb\n"));
            const output = createOutput();

            // Act
            const actual = await questionHelper.ask(input, output, question);
            const actual1 = await questionHelper.ask(input1, output, question);

            // Assert
            expect(actual).toBeTruthy();
            expect(actual1).toBeFalsy();
        });

    });

    describe("Ask and validate", () => {

        it("should handle custom validation", async () => {
            // Arrange
            const helper = new QuestionHelper();
            const helperSet = new HelperSet([new FormatterHelper()]);
            helper.setHelperSet(helperSet);
            const expectedError = "This is not a color!";
            const validator = (color: string | null) => {
                if (!color || ["white", "black"].indexOf(color) === -1) {
                    throw new ArgumentException(expectedError);
                }

                return color;
            };
            const question = new Question("What color has a white horse?", "white");
            question.setValidator(validator);
            question.setMaxAttempts(2);
            const input1 = createStream("\nblack\n");
            const input2 = createStreamableInputMock(createStream("green\nyellow\norange\n"));
            const output = createOutput();

            // Act
            const actual1 = await questionHelper.ask(createStreamableInputMock(input1), output, question);
            const actual2 = await questionHelper.ask(createStreamableInputMock(input1), output, question);
            const actual3 = async () => {
                await questionHelper.ask(input2, output, question);
            };

            // Assert
            expect(actual1).toBe("white");
            expect(actual2).toBe("black");
            await expect(actual3()).rejects.toThrow(expectedError);
        });

    });

    describe("simple choices", () => {

        each([
            ["My environment 1", "My environment 1"],
            ["My environment 2", "My environment 2"],
            ["My environment 3", "My environment 3"],
        ])
            .it("should select choice from simple choices", async (providedAnswer, expectedValue) => {
                // Arrange
                const helper = new QuestionHelper();
                const helperSet = new HelperSet([new FormatterHelper()]);
                helper.setHelperSet(helperSet);
                const question = new ChoiceQuestion("Please select the environment to load", [
                    "My environment 1",
                    "My environment 2",
                    "My environment 3",
                ]);
                question.setMaxAttempts(1);
                const output = createOutput();

                // Act
                const actual = await helper.ask(createStreamableInputMock(createStream(providedAnswer + "\n")), output, question);

                // Assert
                expect(actual).toBe(expectedValue);
            });

        each([
            [".", ["."]],
            ["., src", [".", "src"]],
        ])
            .it("should select choice with special chars", async (providedAnswer, expectedValue) => {
                // Arrange
                const helper = new QuestionHelper();
                const helperSet = new HelperSet([new FormatterHelper()]);
                helper.setHelperSet(helperSet);
                const question = new ChoiceQuestion("Please select the directory", [
                    ".",
                    "src",
                ]);
                question.setMaxAttempts(1);
                question.setMultiselect(true);
                const output = createOutput();

                // Act
                const actual = await helper.ask(createStreamableInputMock(createStream(providedAnswer + "\n")), output, question);

                // Assert
                expect(actual).toEqual(expectedValue);
            });

        each([
            ["0", "0"],
            ["No environment", "0"],
            ["1", "1"],
            ["env_2", "env_2"],
            ["3", "3"],
            ["My environment 1", "1"],
        ])
            .it("should select choice with mixed keys", async (providedAnswer, expectedValue) => {
                // Arrange
                const helper = new QuestionHelper();
                const helperSet = new HelperSet([new FormatterHelper()]);
                helper.setHelperSet(helperSet);
                const question = new ChoiceQuestion("Please select the environment to load", [
                    ["0", "No environment"],
                    ["1", "My environment 1"],
                    ["env_2", "My environment 2"],
                    ["3", "My environment 3"],
                ]);
                question.setMaxAttempts(1);
                const output = createOutput();

                // Act
                const actual = await helper.ask(createStreamableInputMock(createStream(providedAnswer + "\n")), output, question);

                // Assert
                expect(actual).toEqual(expectedValue);
            });

        each([
            ["env_1", "env_1"],
            ["env_2", "env_2"],
            ["env_3", "env_3"],
            ["My environment 1", "env_1"],
        ])
            .it("should select choice with mixed keys", async (providedAnswer, expectedValue) => {
                // Arrange
                const helper = new QuestionHelper();
                const helperSet = new HelperSet([new FormatterHelper()]);
                helper.setHelperSet(helperSet);
                const question = new ChoiceQuestion("Please select the environment to load", [
                    ["env_1", "My environment 1"],
                    ["env_2", "My environment"],
                    ["env_3", "My environment"],
                ]);
                question.setMaxAttempts(1);
                const output = createOutput();

                // Act
                const actual = await helper.ask(createStreamableInputMock(createStream(providedAnswer + "\n")), output, question);

                // Assert
                expect(actual).toEqual(expectedValue);
            });

        it("should throw on ambiguous answers", async () => {
            // Arrange
            const helper = new QuestionHelper();
            const helperSet = new HelperSet([new FormatterHelper()]);
            helper.setHelperSet(helperSet);
            const question = new ChoiceQuestion("Please select the environment to load", [
                ["env_1", "My first environment"],
                ["env_2", "My environment"],
                ["env_3", "My environment"],
            ]);
            question.setMaxAttempts(1);
            const output = createOutput();

            // Act
            const actual = async () => {
                await helper.ask(createStreamableInputMock(createStream("My environment\n")), output, question);
            };

            // Assert
            await expect(actual()).rejects.toThrow(ArgumentException);
        });

    });

    it("should work without interaction ", async () => {
        // Arrange
        const helper = new QuestionHelper();
        const question = new Question("Do you have a job?", "not yet");

        // Act
        const actual = await helper.ask(createStreamableInputMock(null, false), createOutput(), question);

        // Assert
        expect(actual).toBe("not yet");
    });

    it("should throw on missing input", async () => {
        // Arrange
        const helper = new QuestionHelper();
        const question = new Question("Whats your name?");

        // Act
        const actual = async () => {
            await helper.ask(createStreamableInputMock(createStream("")), createOutput(), question);
        };

        // Assert
        await expect(actual()).rejects.toThrow(RuntimeException);
    });

    it("should throw on missing input for choice question", async () => {
        // Arrange
        const helper = new QuestionHelper();
        const question = new ChoiceQuestion("Choice", ["a", "b"]);

        // Act
        const actual = async () => {
            await helper.ask(createStreamableInputMock(createStream("")), createOutput(), question);
        };

        // Assert
        await expect(actual()).rejects.toThrow(RuntimeException);
    });

    it("should throw on missing input with validator", async () => {
        // Arrange
        const helper = new QuestionHelper();
        const question = new Question<string>("Whats your name?");
        question.setValidator((value: string | null) => {
            if (!value) {
                throw new Error("A value is required");
            }

            return value;
        });

        // Act
        const actual = async () => {
            await helper.ask(createStreamableInputMock(createStream("")), createOutput(), question);
        };

        // Assert
        await expect(actual()).rejects.toThrow(RuntimeException);
    });

    it("should throw with empty choices", () => {
        // Act
        const actual = () => {
            new ChoiceQuestion("Something?", [], "Irrelevant");
        };

        // Assert
        expect(actual).toThrow(LogicException);
    });

    it("should handle multiple questions", async () => {
        // Arrange
        const question0 = new Question("File?");
        const question1 = new Question("Password?");
        const question2 = new ConfirmationQuestion("Should you do? (Y/n)");
        question1.setHidden(true);
        question0.setPrompt("File: ");
        question1.setPrompt("Password: ");
        question2.setPrompt("Do it? : ");

        const stream = createStream("example.json\nfoo\ny\n");
        const input = createStreamableInputMock(stream, true);
        const output = createOutput();

        // Act
        const actual0 = await questionHelper.ask(input, output, question0);
        const actual1 = await questionHelper.ask(input, output, question1);
        const actual2 = await questionHelper.ask(input, output, question2);

        // Assert
        expect(actual0).toBe("example.json");
        expect(actual1).toBe("foo");
        expect(actual2).toBeTruthy();
    });

});
