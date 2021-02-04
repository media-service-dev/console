/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as stream from "stream";

export function promisifyStream(stream: stream.Writable | stream.Readable) {
    if ("writableEnded" in stream) {
        if (!stream.writableEnded) {
            stream.end();
        }
    }

    return new Promise<string[]>((resolve) => {
        const data: string[] = [];

        stream.on("data", (chunk) => {
            data.push(chunk.toString());
        });

        stream.on("finish", () => {
            resolve(data);
        });

        stream.on("end", () => {
            resolve(data);
        });
    });
}
