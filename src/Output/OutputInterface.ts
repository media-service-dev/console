/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { OutputFormatterInterface } from "../Formatter/OutputFormatterInterface";
import { OutputMode } from "./OutputMode";
import { OutputOptions } from "./OutputOptions";

export interface OutputInterface {

    /**
     * Writes messages to the output.
     *
     * @param {string | string[]} messages
     * @param {Partial<OutputOptions>} options
     */
    write(messages: string | string[], options?: Partial<OutputOptions>): void;

    /**
     * Writes messages to the output line by line.
     *
     * @param {string | string[]} messages
     * @param {Partial<Pick<OutputOptions, "mode">>} options
     */
    writeln(messages: string | string[], options?: Partial<Pick<OutputOptions, "mode">>): void;

    /**
     * Set the output verbosity.
     *
     * @param {OutputMode} mode
     */
    setVerbosity(mode: OutputMode): void;

    /**
     * Get the output verbosity.
     *
     * @returns {OutputMode}
     */
    getVerbosity(): OutputMode;

    /**
     * If the output is quiet.
     *
     * @returns {boolean}
     */
    isQuiet(): boolean;

    /**
     * If the output mode is verbose.
     *
     * @returns {boolean}
     */
    isVerbose(): boolean;

    /**
     * If the output mode is very verbose.
     *
     * @returns {boolean}
     */
    isVeryVerbose(): boolean;

    /**
     * If the output mode is debug.
     *
     * @returns {boolean}
     */
    isDebug(): boolean;

    /**
     * Activate or deactivate decorated output.
     *
     * @param {boolean} decorated
     */
    setDecorated(decorated: boolean): void;

    /**
     * If the output is decorated.
     *
     * @returns {boolean}
     */
    isDecorated(): boolean;

    /**
     * Set the output formatter.
     *
     * @param {OutputFormatterInterface} formatter
     */
    setFormatter(formatter: OutputFormatterInterface): void;

    /**
     * Get the output formatter.
     *
     * @returns {OutputFormatterInterface}
     */
    getFormatter(): OutputFormatterInterface;

}
