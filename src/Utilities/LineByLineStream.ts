/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { Readable } from "stream";

/**
 * LineByLineStream is a stream that returns the data line by line, byside that it ignore the size from the _read statement to do so.
 * This stream returns buffer like every stream, but internaly works in object mode, so it also return empty strings, what is wanted.
 */
export class LineByLineStream extends Readable {

    protected contents: Buffer = Buffer.from("");

    protected stream: Readable;

    public constructor(stream: Readable) {
        super({ objectMode: true, highWaterMark: 0 });

        this.stream = stream;
        this.stream.on("data", (chunk) => {
            this.contents = Buffer.concat([this.contents, Buffer.from(chunk)]);
        });
        this.stream.resume();

        this.pause();
    }

    public _read() {
        if (!this.contents.length) {
            this.push(null);
        } else {
            const data = this.contents.toString("utf8");
            for (let index = 0; index < data.length; index++) {
                const character = data.charAt(index);
                const nextCharacter = data.charAt(index + 1);
                if ("\r" === character && "\n" === nextCharacter) {
                    const item = data.slice(0, index + 1);
                    const rest = data.slice(index + 2);
                    this.contents = Buffer.from(rest);
                    this.push(item, "utf8");
                    return;
                } else if ("\n" === character || "\r" === character) {
                    const item = data.slice(0, index + 1);
                    const rest = data.slice(index + 1);
                    this.contents = Buffer.from(rest);
                    this.push(item, "utf8");
                    return;
                }
            }

            this.contents = Buffer.from("");
            this.push(data, "utf8");
        }
    }

}
