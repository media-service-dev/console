/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import * as os from "os";
import { ArgumentException } from "../../src/Exception/ArgumentException";
import { OutputMode } from "../../src/Output/OutputMode";
import { StreamOutput } from "../../src/Output/StreamOutput";
import { TesterDuplexStream } from "../../src/Tester/TesterDuplexStream";

describe("StreamOutput", () => {

    let stream: TesterDuplexStream;

    beforeEach(() => {
        stream = new TesterDuplexStream();
    });

    afterAll(() => {
        stream.destroy();
    });

    it("should accept constructor", () => {
        const output = new StreamOutput(stream, OutputMode.VERBOSITY_QUIET, true);

        expect(output.getVerbosity()).toBe(OutputMode.VERBOSITY_QUIET);
        expect(output.isDecorated()).toBeTruthy();
    });

    it("should only accept stream", () => {
        expect(() => {
            new StreamOutput("test" as any);
        }).toThrow(ArgumentException);
    });

    it("should return stream", () => {
        const output = new StreamOutput(stream);
        expect(output.getStream()).toBe(stream);
    });

    it("should write to stream", async () => {
        const output = new StreamOutput(stream);

        output.writeln("foo");

        const data: string = await (new Promise((resolve) => {
            stream.on("data", (chunk) => {
                resolve(chunk.toString());
            });
        }));

        expect(data).toBe("foo" + os.EOL);

    });
});
