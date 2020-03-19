/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { NullOutputFormatter } from "../Formatter/NullOutputFormatter";
import { OutputFormatterInterface } from "../Formatter/OutputFormatterInterface";
import { OutputInterface } from "./OutputInterface";
import { OutputMode } from "./OutputMode";

export class NullOutput implements OutputInterface {

    private formatter: OutputFormatterInterface | null = null;

    public getFormatter(): OutputFormatterInterface {
        if (this.formatter) {
            return this.formatter;
        }

        this.formatter = new NullOutputFormatter();

        return this.formatter;
    }

    public getVerbosity(): OutputMode {
        return OutputMode.VERBOSITY_QUIET;
    }

    public isDebug(): boolean {
        return false;
    }

    public isDecorated(): boolean {
        return false;
    }

    public isQuiet(): boolean {
        return false;
    }

    public isVerbose(): boolean {
        return false;
    }

    public isVeryVerbose(): boolean {
        return false;
    }

    public setDecorated(): void {
        // do nothing
    }

    public setFormatter(): void {
        // do nothing
    }

    public setVerbosity(): void {
        // do nothing
    }

    public write(): void {
        // do nothing
    }

    public writeln(): void {
        // do nothing
    }

}
