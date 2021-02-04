/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { ConsoleSectionOutput } from "./ConsoleSectionOutput";
import { OutputInterface } from "./OutputInterface";

export interface ConsoleOutputInterface extends OutputInterface {

    /**
     * Get the error output.
     *
     * @returns {OutputInterface}
     */
    getErrorOutput(): OutputInterface;

    /**
     * Set the error output.
     *
     * @param {OutputInterface} error
     */
    setErrorOutput(error: OutputInterface): void;

    /**
     * Create a new console section output.
     *
     * @returns {ConsoleSectionOutput}
     */
    section(): ConsoleSectionOutput;

}
