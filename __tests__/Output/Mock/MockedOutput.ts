/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { AbstractOutput } from "../../../src/Output/AbstractOutput";

export class MockedOutput extends AbstractOutput {

    protected lines: string[] = [];

    protected buffer: string = "";

    public getLines() {
        if (this.buffer.length > 0) {
            this.lines.push(this.buffer);
            this.buffer = "";
        }

        return this.lines;
    }

    public clear() {
        this.buffer = "";
        this.lines = [];
    }

    public getBuffer() {
        return this.buffer;
    }

    protected doWrite(message: string, newline: boolean): void {
        this.buffer += message;

        if (newline) {
            this.lines.push(this.buffer);
            this.buffer = "";
        }
    }

}
