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
import { WriteStream } from "tty";
import { ArgumentException } from "../Exception/ArgumentException";
import { OutputFormatterInterface } from "../Formatter/OutputFormatterInterface";
import { AbstractOutput } from "./AbstractOutput";
import { OutputMode } from "./OutputMode";

export class StreamOutput extends AbstractOutput {

    private stream: Writable;

    // eslint-disable-next-line max-params
    public constructor(stream: Writable, verbosity: OutputMode = OutputMode.VERBOSITY_NORMAL, decorated: boolean | null = null, formatter: OutputFormatterInterface | null = null) {
        super(verbosity, false, formatter);

        if (!(stream instanceof Writable)) {
            throw new ArgumentException("The StreamOutput class needs a writable stream as its first argument.");
        }

        this.stream = stream;

        if (null === decorated) {
            decorated = this.hasColorSupport();
        }

        this.setDecorated(decorated);
    }

    /**
     * Get the output stream.
     *
     * @returns {Writable}
     */
    public getStream() {
        return this.stream;
    }

    /**
     * @inheritDoc
     */
    protected doWrite(message: string, newline: boolean): void {
        if (newline) {
            message += os.EOL;
        }

        this.stream.write(message);
    }

    private hasColorSupport(): boolean {
        if (typeof process.env.NO_COLOR !== "undefined" && process.env.NO_COLOR) {
            return false;
        }

        if (this.stream instanceof WriteStream) {
            return this.stream.hasColors();
        }

        return false;
    }

}
