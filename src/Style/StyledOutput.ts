/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import * as os from "os";
import * as util from "util";
import { OutputFormatter } from "../Formatter/OutputFormatter";
import { AbstractHelper } from "../Helper/AbstractHelper";
import { QuestionHelper } from "../Helper/QuestionHelper";
import { InputInterface } from "../Input/InputInterface";
import { BufferedOutput } from "../Output/BufferedOutput";
import { OutputInterface } from "../Output/OutputInterface";
import { OutputOptions } from "../Output/OutputOptions";
import { ChoiceQuestion } from "../Question/ChoiceQuestion";
import { ConfirmationQuestion } from "../Question/ConfirmationQuestion";
import { Question } from "../Question/Question";
import { Terminal } from "../Terminal";
import { TextUtilities } from "../Utilities/TextUtilities";
import { AbstractStyledOutput } from "./AbstractStyledOutput";

export class StyledOutput extends AbstractStyledOutput {

    private input: InputInterface;

    private lineLength: number;

    private bufferedOutput: BufferedOutput;

    private questionHelper: QuestionHelper;

    public constructor(input: InputInterface, output: OutputInterface) {
        super(output);
        this.input = input;
        this.bufferedOutput = new BufferedOutput();
        const width = (new Terminal()).getWidth();
        this.lineLength = Math.min(width, 120);
    }

    // eslint-disable-next-line max-params
    public block(messages: string | string[], type: string | null = null, style: string | null = null, prefix?: string, padding?: boolean, escape?: boolean): void {
        messages = Array.isArray(messages) ? messages : [messages];

        this.autoPrependBlock();
        this.writeln(this.createBlock(messages, type, style, prefix, padding, escape));
        this.newLine();
    }

    public title(message: string): void {
        this.autoPrependBlock();
        this.writeln([
            util.format("<comment>%s</>", OutputFormatter.escapeBackslashes(message)),
            util.format("<comment>%s</>", "=".repeat(AbstractHelper.lengthWithoutDecoration(this.getFormatter(), message))),
        ]);
        this.newLine();
    }

    public section(message: string): void {
        this.autoPrependBlock();
        this.writeln([
            util.format("<comment>%s</>", OutputFormatter.escapeBackslashes(message)),
            util.format("<comment>%s</>", "-".repeat(AbstractHelper.lengthWithoutDecoration(this.getFormatter(), message))),
        ]);
        this.newLine();
    }

    public listing(items: string[]): void {
        this.autoPrependText();
        this.writeln(items.map((item) => util.format(" * %s", item)));
        this.newLine();
    }

    public text(messages: string | string[]): void {
        this.autoPrependText();
        messages = Array.isArray(messages) ? messages : [messages];

        for (const message of messages) {
            this.writeln(util.format(" %s", message));
        }
    }

    public comment(message: string): void {
        this.block(message, null, null, "<fg=default;bg=default> // </>", false, false);
    }

    public success(message: string): void {
        this.block(message, "OK", "fg=black;bg=green", " ", true);
    }

    public error(message: string): void {
        this.block(message, "ERROR", "fg=white;bg=red", " ", true);
    }

    public warning(message: string): void {
        this.block(message, "WARNING", "fg=black;bg=yellow", " ", true);
    }

    public note(message: string): void {
        this.block(message, "NOTE", "fg=yellow", " ! ");
    }

    public caution(message: string): void {
        this.block(message, "CAUTION", "fg=white;bg=red", " ! ", true);
    }

    public async ask<Type>(question: string, defaultValue: Type | null = null, validator: ((response: (Type | null)) => Type) | null = null): Promise<Type> {
        const questionObject = new Question<Type>(question, defaultValue);
        questionObject.setValidator(validator);
        return this.askQuestion(questionObject);
    }

    public async askHidden<Type>(question: string, validator: ((response: (Type | null)) => Type) | null = null): Promise<Type> {
        const questionObject = new Question<Type>(question);
        questionObject.setHidden(true);
        questionObject.setValidator(validator);
        return this.askQuestion(questionObject);
    }

    public async confirm(question: string, defaultValue: boolean = true): Promise<boolean> {
        return this.askQuestion(new ConfirmationQuestion(question, defaultValue));
    }

    public async choice(question: string, choices: string[], defaultValue: string | null = null): Promise<string> {
        const questionObject = new ChoiceQuestion(question, choices, defaultValue);
        return (await this.askQuestion(questionObject)) as string;
    }

    public writeln(messages: string | string[], options: Partial<Pick<OutputOptions, "mode">> = {}): void {
        messages = Array.isArray(messages) ? messages : [messages];

        for (const message of messages) {
            super.writeln(message, options);
            this.writeBuffer(message, { ...options, newline: true });
        }
    }

    public write(messages: string | string[], options: Partial<OutputOptions> = {}): void {
        messages = Array.isArray(messages) ? messages : [messages];

        for (const message of messages) {
            super.write(message, options);
            this.writeBuffer(message, options);
        }
    }

    public newLine(amount: number = 1): void {
        this.write(os.EOL.repeat(amount));
        this.bufferedOutput.write("\n".repeat(amount));
    }

    public getErrorStyle() {
        return new StyledOutput(this.input, this.getErrorOutput());
    }

    private async askQuestion<Type>(question: Question<Type>): Promise<Type> {
        if (this.input.isInteractive()) {
            this.autoPrependBlock();
        }

        if (!this.questionHelper) {
            const module = require("../Helper/StyleQuestionHelper");
            this.questionHelper = new module.StyleQuestionHelper();
        }

        const result = await this.questionHelper.ask(this.input, this, question);

        if (this.input.isInteractive()) {
            this.newLine();
            this.bufferedOutput.write("\n");
        }

        return result;
    }

    private autoPrependBlock() {
        const characters = this.bufferedOutput.fetch().replace(os.EOL, "\n").substr(-2);
        if (characters.length === 0) {
            this.newLine();
            return;
        }

        this.newLine(2 - (characters.split("\n").length - 1));
    }

    private autoPrependText() {
        const fetched = this.bufferedOutput.fetch();

        // Prepend new line if last char isn't EOL:
        if ("\n" !== fetched.substr(-1)) {
            this.newLine();
        }
    }

    private writeBuffer(message: string, options: Partial<OutputOptions>) {
        // We need to know if the two last chars are os.EOL
        // Preserve the last 4 chars inserted (os.EOL on windows is two chars) in the history buffer
        this.bufferedOutput.write(message.substr(-4), options);
    }

    // eslint-disable-next-line max-params
    private createBlock(messages: string[], type: string | null = null, style: string | null = null, prefix: string = " ", padding: boolean = false, escape: boolean = false) {
        const prefixLength = AbstractHelper.lengthWithoutDecoration(this.getFormatter(), prefix);
        const lines: string[] = [];
        let indentLength = 0;
        let lineIndention = "";

        if (null !== type) {
            type = util.format("[%s] ", type);
            indentLength = type.length;
            lineIndention = " ".repeat(indentLength);
        }

        // wrap and add newlines for each element
        for (let index = 0; index < messages.length; index++) {
            let message = messages[index];
            if (escape) {
                message = OutputFormatter.escapeBackslashes(message);
            }

            const wrapped = TextUtilities.wrap(message, this.lineLength - prefixLength - indentLength, os.EOL, true);
            lines.push(...wrapped.split(os.EOL));

            if (messages.length > 1 && index < messages.length - 1) {
                lines.push("");
            }
        }

        let firstLineIndex = 0;
        if (padding && this.isDecorated()) {
            firstLineIndex = 1;
            lines.unshift("");
            lines.push("");
        }

        return lines.map((line: string, index: number) => {
            if (null !== type) {
                line = firstLineIndex === index ? type + line : lineIndention + line;
            }

            line = prefix + line;
            line += " ".repeat(this.lineLength - AbstractHelper.lengthWithoutDecoration(this.getFormatter(), line));

            if (style) {
                line = util.format("<%s>%s</>", style, line);
            }

            return line;
        });
    }

}
