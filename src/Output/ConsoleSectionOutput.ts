/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import * as os from "os";
import { Writable } from "stream";
import { OutputFormatterInterface } from "../Formatter/OutputFormatterInterface";
import { AbstractHelper } from "../Helper/AbstractHelper";
import { Terminal } from "../Terminal";
import { OutputMode } from "./OutputMode";
import { StreamOutput } from "./StreamOutput";

export class ConsoleSectionOutput extends StreamOutput {

    private lines: number = 0;

    private content: string[] = [];

    private sections: { sections: ConsoleSectionOutput[] };

    private terminal: Terminal;

    // eslint-disable-next-line max-params
    public constructor(sections: { sections: ConsoleSectionOutput[] }, stream: Writable, verbosity: OutputMode, decorated: boolean, formatter: OutputFormatterInterface) {
        super(stream, verbosity, decorated, formatter);
        sections.sections.unshift(this);
        this.sections = sections;
        this.terminal = new Terminal();
    }

    /**
     * Clear the content by n lines.
     *
     * @param {number | null} lines
     */
    public clear(lines: number | null = null) {
        if (!this.content.length || !this.isDecorated()) {
            return;
        }

        if (lines) {
            this.content.splice(-(lines * 2));
        } else {
            // eslint-disable-next-line prefer-destructuring
            lines = this.lines;
            this.content = [];
        }

        this.lines -= lines;

        super.doWrite(this.popStreamContentUntilCurrentSection(lines), false);
    }

    /**
     * Overwrite the content with the new message.
     *
     * @param {string} message
     */
    public overwrite(message: string) {
        this.clear();
        this.writeln(message);
    }

    /**
     * Get the content of the section.
     *
     * @returns {string}
     */
    public getContent(): string {
        return this.content.join("");
    }

    /**
     * Add content to the section.
     *
     * @param {string} input
     */
    public addContent(input: string) {
        const lines = input.split(os.EOL);
        for (const line of lines) {
            const width = Math.ceil(this.getDisplayLength(line) / this.terminal.getWidth());
            if (width > 0) {
                this.lines += width;
            } else {
                this.lines += 1;
            }
            this.content.push(line);
            this.content.push(os.EOL);
        }
    }

    /**
     * @inheritDoc
     */
    protected doWrite(message: string, newline: boolean): void {
        if (!this.isDecorated()) {
            super.doWrite(message, newline);
            return;
        }

        const erasedContent = this.popStreamContentUntilCurrentSection();

        this.addContent(message);
        super.doWrite(message, true);
        super.doWrite(erasedContent, false);
    }

    private popStreamContentUntilCurrentSection(lines: number = 0) {
        let numberOfLinesToClear = lines;
        const erasedContent: string[] = [];

        for (const section of this.sections.sections) {
            if (section === this) {
                break;
            }

            numberOfLinesToClear += section.lines;
            erasedContent.push(section.getContent());
        }

        if (numberOfLinesToClear > 0) {
            // move cursor up n lines
            super.doWrite(`\x1b[${numberOfLinesToClear}A`, false);
            // erase to end of screen
            super.doWrite("\x1b[0J", false);
        }

        return erasedContent.reverse().join("");
    }

    private getDisplayLength(line: string) {
        return AbstractHelper.lengthWithoutDecoration(this.getFormatter(), line.replace("\t", "        "));
    }

}
