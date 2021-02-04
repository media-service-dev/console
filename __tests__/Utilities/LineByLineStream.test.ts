/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { TesterReadableStream } from "../../src/Tester/TesterReadableStream";
import { LineByLineStream } from "../../src/Utilities/LineByLineStream";
import { promisifyStream } from "../Utils/PromisifyStream";

describe("LineByLineStream", () => {

    it("should output chunks by line", async () => {
        // Arrange
        const input = new TesterReadableStream("foo\nbar\n", 2);
        const stream = new LineByLineStream(input);

        stream.resume();
        // Act
        const actual = await promisifyStream(stream);

        // Assert
        expect(actual).toEqual(["foo\n", "bar\n"]);
    });

});
