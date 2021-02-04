/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import * as readline from "readline";
import { Readable } from "stream";

import { RuntimeException } from "../Exception/RuntimeException";
import { InputInterface } from "../Input/InputInterface";
import { StreamableInputInterface } from "../Input/StreamableInputInterface";
import { ConsoleOutput } from "../Output/ConsoleOutput";
import { ConsoleSectionOutput } from "../Output/ConsoleSectionOutput";
import { OutputInterface } from "../Output/OutputInterface";
import { StreamOutput } from "../Output/StreamOutput";
import { ChoiceQuestion } from "../Question/ChoiceQuestion";
import { Question } from "../Question/Question";
import { StyledOutput } from "../Style/StyledOutput";
import { LineByLineStream } from "../Utilities/LineByLineStream";
import { AbstractHelper } from "./AbstractHelper";
import { FormatterHelper } from "./FormatterHelper";

export class QuestionHelper extends AbstractHelper {

    private inputStream!: Readable;

    public async ask(input: InputInterface, output: OutputInterface, question: ChoiceQuestion): Promise<string | string[]>;

    public async ask<Type>(input: InputInterface, output: OutputInterface, question: Question<Type>): Promise<Type>;

    public async ask<Type>(input: InputInterface, output: OutputInterface, question: Question<Type>): Promise<unknown> {
        if (output instanceof ConsoleOutput) {
            output = output.getErrorOutput();
        }

        const validator = question.getValidator() as ((value: unknown) => unknown) | null;

        if (!input.isInteractive()) {
            const defaultValue = question.getDefault();

            if (null === defaultValue) {
                return defaultValue;
            }

            if (validator) {
                return validator(defaultValue);
            }

            if (question instanceof ChoiceQuestion) {
                const choices = question.getChoices();

                const keys = Array.from(choices.keys());
                const values = Array.from(choices.values());

                if (!question.isMultiselect()) {
                    if (typeof defaultValue === "string") {
                        if (keys.includes(defaultValue)) {
                            return choices.get(defaultValue);
                        }
                    }

                    return defaultValue;
                }

                if (typeof defaultValue === "string") {
                    const items = defaultValue.split(",");

                    return items.map(item => {
                        if (question.isTrimmable()) {
                            item = item.trim();
                        }

                        if (keys.includes(item)) {
                            return choices.get(item);
                        }

                        if (values.includes(item)) {
                            return item;
                        }

                        return defaultValue;
                    });
                }
            }

            return defaultValue;
        }

        if (this.isStreamable(input)) {
            const stream = input.getStream() ?? null;

            if (stream) {
                if (stream instanceof LineByLineStream) {
                    this.inputStream = stream;
                } else {
                    this.inputStream = new LineByLineStream(stream);
                }
            }
        }

        if (!validator) {
            return this.doAsk<Type>(output, question);
        }

        const interviewer = async () => {
            return this.doAsk<Type>(output, question);
        };

        return this.validateAttempts<Type>(interviewer, output, question);
    }

    public getName(): string {
        return "question";
    }

    protected isStreamable(input: any): input is StreamableInputInterface {
        return typeof input.getStream !== "undefined";
    }

    protected writePrompt<Type>(question: Question<Type>, output: OutputInterface) {
        if (question instanceof ChoiceQuestion) {
            output.writeln(this.formatChoiceQuestionChoices(question, "info"));
        }
    }

    protected formatChoiceQuestionChoices(question: ChoiceQuestion, style: string) {
        const choices = question.getChoices();
        const keys = Array.from(choices.keys());
        const values = Array.from(choices.values());

        const maxWidth = Math.max(...keys.concat(values).map((item) => item.length));
        const items: string[] = [];

        for (const [key, value] of choices.entries()) {
            if (question.isSimple()) {
                items.push(`  [<${style}>${value}${" ".repeat(maxWidth - value.length)}</${style}>] ${value}`);
            } else {
                items.push(`  [<${style}>${key}${" ".repeat(maxWidth - key.length)}</${style}>] ${value}`);
            }
        }

        return items;
    }

    protected writeError(output: OutputInterface, error: Error) {
        const helperSet = this.getHelperSet();

        if (helperSet && helperSet.has("formatter")) {
            const formatter = helperSet.get<FormatterHelper>("formatter");

            output.writeln(formatter.formatBlock(error.message, "error"));
        } else {
            output.writeln(`<error>${error.message}</error>`);
        }
    }

    protected getPrompt<Type>(question: Question<Type>): string {
        if (question instanceof ChoiceQuestion) {
            return question.getPrompt() + " ";
        }

        return question.getMessage().trim() + " ";
    }

    private async doAsk<Type>(output: OutputInterface, question: Question<Type>): Promise<Type | null> {
        const stream = this.inputStream ?? process.stdin;

        this.writePrompt(question, output);

        let outputStream;

        if (output instanceof StyledOutput) {
            const realOutput = output.getOutput();

            if (realOutput instanceof StreamOutput) {
                outputStream = realOutput.getStream();
            }
        } else if (output instanceof StreamOutput) {
            outputStream = output.getStream();
        }

        const read = readline.createInterface({
            input: stream,
            output: outputStream,
        });

        read.setPrompt(this.getPrompt(question));

        const suppress = (char: string) => {
            // noop
            if (char === "\n" || char === "\r" || char === "\u0004") {
                stream.pause();
                stream.removeListener("keypress", suppress);
            } else {
                setImmediate(() => {
                    read.write(`\u001b[2K\u001b[200D${this.getPrompt(question)}`);
                });
            }
        };

        function close() {
            read.close();
            read.removeAllListeners();
            stream.removeListener("keypress", suppress);
            stream.pause();
        }

        if (question.isHidden()) {
            stream.on("keypress", suppress);
        }

        read.prompt();

        let value: string = await (
            new Promise<string>((resolve, reject) => {
                let resolved: boolean = false;

                read.on("line", (input: string) => {
                    resolved = true;
                    resolve(input);
                    close();
                });

                // Fail if the stream is not the default stdin stream and the input is empty
                if (process.stdin !== stream) {
                    setTimeout(() => {
                        if (!resolved) {
                            reject(new RuntimeException("Aborted."));
                        }
                    }, 10);
                }
            })
        );

        if (question.isTrimmable()) {
            value = value.trim();
        }

        if (output instanceof ConsoleSectionOutput) {
            output.addContent(value);
        }

        value = value.length > 0 ? value : question.getDefault() as any;

        const normalizer = question.getNormalizer();

        if (normalizer) {
            return normalizer(value);
        }

        return value as unknown as Type;
    }

    private async validateAttempts<Type>(interviewer: () => Promise<Type | null>, output: OutputInterface, question: Question<Type>): Promise<Type> {
        let error: Error | null = null;
        let attempts = question.getMaxAttempts();
        const validator = question.getValidator();

        while (null === attempts || attempts--) {
            if (null !== error) {
                this.writeError(output, error);
            }

            try {
                const value = await interviewer();

                if (validator) {
                    return validator(value);
                }

                return value as Type;
            } catch (exception) {
                if (exception instanceof RuntimeException) {
                    throw exception;
                } else {
                    error = exception;
                }
            }
        }

        throw error;
    }

}
