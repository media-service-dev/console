/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import * as os from "os";

import { AbstractOutput } from "./AbstractOutput";

export class BufferedOutput extends AbstractOutput {

    protected buffer: string = "";

    public fetch(): string {
        const content = this.buffer;

        this.buffer = "";

        return content;
    }

    protected doWrite(message: string, newline: boolean): void {
        this.buffer += message;

        if (newline) {
            this.buffer += os.EOL;
        }
    }

}
