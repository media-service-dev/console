/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { Duplex, DuplexOptions } from "stream";

export class TesterDuplexStream extends Duplex {

    protected contents: Buffer = Buffer.from("");

    public constructor(options: DuplexOptions = { emitClose: true }) {
        super(options);
    }

    public _write(chunk: string, encoding: string, callback: () => void) {
        this.contents = Buffer.from(this.contents.toString() + chunk);
        callback();
    }

    public _read(size: number) {
        const result = this.contents.slice(0, size);

        this.contents = this.contents.slice(size);
        this.push(result);
    }

    public getContents(): string {
        return this.contents.toString();
    }

}
