/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { OutputFormatter } from "../Formatter/OutputFormatter";
import { OutputFormatterInterface } from "../Formatter/OutputFormatterInterface";
import { TextUtilities } from "../Utilities/TextUtilities";
import { OutputInterface } from "./OutputInterface";
import { OutputMode } from "./OutputMode";
import { OutputOptions } from "./OutputOptions";

export abstract class AbstractOutput implements OutputInterface {

    private verbosity: OutputMode;

    private formatter: OutputFormatterInterface;

    public constructor(verbosity: OutputMode = OutputMode.VERBOSITY_NORMAL, decorated: boolean = false, formatter: OutputFormatterInterface | null = null) {
        this.verbosity = verbosity;
        this.formatter = formatter ?? new OutputFormatter();
        this.formatter.setDecorated(decorated);
    }

    /**
     * @inheritDoc
     */
    public write(messages: string | string[], options?: Partial<OutputOptions>): void {
        const outputOptions: OutputOptions = {
            newline: false,
            mode: OutputMode.OUTPUT_NORMAL,
            ...options,
        };

        if (!Array.isArray(messages)) {
            messages = [messages];
        }

        const modes: OutputMode = OutputMode.OUTPUT_NORMAL | OutputMode.OUTPUT_RAW | OutputMode.OUTPUT_PLAIN;
        const mode: OutputMode = modes & outputOptions.mode
            ? modes & outputOptions.mode
            : OutputMode.OUTPUT_NORMAL;

        const verbosities = OutputMode.VERBOSITY_QUIET | OutputMode.VERBOSITY_NORMAL | OutputMode.VERBOSITY_VERBOSE | OutputMode.VERBOSITY_VERY_VERBOSE | OutputMode.VERBOSITY_DEBUG;
        const verbosity: OutputMode = verbosities & outputOptions.mode
            ? verbosities & outputOptions.mode
            : OutputMode.VERBOSITY_NORMAL;

        if (verbosity > this.getVerbosity()) {
            return;
        }

        for (let message of messages) {
            if (mode === OutputMode.OUTPUT_NORMAL) {
                message = this.formatter.format(message);
            } else if (mode === OutputMode.OUTPUT_PLAIN) {
                message = this.formatter.format(TextUtilities.stripTags(message));
            }

            this.doWrite(message, outputOptions.newline);
        }
    }

    /**
     * @inheritDoc
     */
    public writeln(messages: string | string[], options?: Partial<Pick<OutputOptions, "mode">>): void {
        this.write(messages, {
            mode: OutputMode.OUTPUT_NORMAL,
            ...options,
            newline: true,
        });
    }

    /**
     * @inheritDoc
     */
    public setVerbosity(mode: OutputMode): void {
        this.verbosity = mode;
    }

    /**
     * @inheritDoc
     */
    public getVerbosity(): OutputMode {
        return this.verbosity;
    }

    /**
     * @inheritDoc
     */
    public isQuiet(): boolean {
        return OutputMode.VERBOSITY_QUIET === this.verbosity;
    }

    /**
     * @inheritDoc
     */
    public isVerbose(): boolean {
        return OutputMode.VERBOSITY_VERBOSE <= this.verbosity;
    }

    /**
     * @inheritDoc
     */
    public isVeryVerbose(): boolean {
        return OutputMode.VERBOSITY_VERY_VERBOSE <= this.verbosity;
    }

    /**
     * @inheritDoc
     */
    public isDebug(): boolean {
        return OutputMode.VERBOSITY_DEBUG <= this.verbosity;
    }

    /**
     * @inheritDoc
     */
    public setDecorated(decorated: boolean): void {
        this.formatter.setDecorated(decorated);
    }

    /**
     * @inheritDoc
     */
    public isDecorated(): boolean {
        return this.formatter.isDecorated();
    }

    /**
     * @inheritDoc
     */
    public setFormatter(formatter: OutputFormatterInterface): void {
        this.formatter = formatter;
    }

    /**
     * @inheritDoc
     */
    public getFormatter(): OutputFormatterInterface {
        return this.formatter;
    }

    /**
     * Do the actual write to the output.
     *
     * @param {string} message
     * @param {boolean} newline
     */
    protected abstract doWrite(message: string, newline: boolean): void;

}
