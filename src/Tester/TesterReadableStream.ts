/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { Readable } from "stream";

export class TesterReadableStream extends Readable {

    protected contents: Buffer = Buffer.from("");

    public constructor(data: string, highWaterMark: number = 16) {
        super({ objectMode: true, highWaterMark });
        this.contents = Buffer.from(data);
    }

    public _read(size: number) {
        if (!this.contents.length) {
            this.push(null);
        } else {
            const result = this.contents.slice(0, size);
            this.contents = this.contents.slice(size);
            this.push(result);
        }
    }

    public getContents(): string {
        return this.contents.toString();
    }

}
