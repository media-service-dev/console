/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import * as os from "os";

import { OutputFormatter } from "../../src/Formatter/OutputFormatter";
import { ConsoleSectionOutput } from "../../src/Output/ConsoleSectionOutput";
import { OutputMode } from "../../src/Output/OutputMode";
import { StreamOutput } from "../../src/Output/StreamOutput";
import { TesterDuplexStream } from "../../src/Tester/TesterDuplexStream";
import { promisifyStream } from "../Utils/PromisifyStream";

describe("ConsoleSectionOutput", () => {

    let stream: TesterDuplexStream;

    beforeEach(() => {
        stream = new TesterDuplexStream();
    });

    afterAll(() => {
        stream.destroy();
    });

    it("should clear all", async () => {
        // Arrange
        const sections = { sections: [] };
        const output = new ConsoleSectionOutput(sections, stream, OutputMode.VERBOSITY_NORMAL, true, new OutputFormatter());

        // Act
        output.writeln("FOO" + os.EOL + "Bar");
        output.clear();

        // Assert
        const data: string[] = await promisifyStream(stream);

        expect(data).toEqual(["FOO" + os.EOL + "Bar" + os.EOL + "\u001b[2A\u001b[0J"]);
    });

    it("should clear number of lines", async () => {
        // Arrange
        const sections = { sections: [] };
        const output = new ConsoleSectionOutput(sections, stream, OutputMode.VERBOSITY_NORMAL, true, new OutputFormatter());

        // Act
        output.writeln("Foo\nBar\nBaz\nFooBar");
        output.clear(2);

        // Assert
        const data: string[] = await promisifyStream(stream);

        expect(data).toEqual(["Foo\nBar\nBaz\nFooBar" + os.EOL + "\u001b[2A\u001b[0J"]);
    });

    it("should clear number of lines with multiple sections", async () => {
        // Arrange
        const output = new StreamOutput(stream);
        const sections = { sections: [] };
        const outputOne = new ConsoleSectionOutput(sections, output.getStream(), OutputMode.VERBOSITY_NORMAL, true, new OutputFormatter());
        const outputTwo = new ConsoleSectionOutput(sections, output.getStream(), OutputMode.VERBOSITY_NORMAL, true, new OutputFormatter());

        // Act
        outputTwo.writeln("Foo");
        outputTwo.writeln("Bar");
        outputTwo.clear(1);
        outputOne.writeln("Baz");

        // Assert
        const data: string[] = await promisifyStream(stream);

        expect(data).toEqual(["Foo" + os.EOL + "Bar" + os.EOL + "\u001b[1A\u001b[0J\u001b[1A\u001b[0JBaz" + os.EOL + "Foo" + os.EOL]);
    });

    it("should clear preserving empty lines", async () => {
        // Arrange
        const output = new StreamOutput(stream);
        const sections = { sections: [] };
        const outputOne = new ConsoleSectionOutput(sections, output.getStream(), OutputMode.VERBOSITY_NORMAL, true, new OutputFormatter());
        const outputTwo = new ConsoleSectionOutput(sections, output.getStream(), OutputMode.VERBOSITY_NORMAL, true, new OutputFormatter());

        // Act
        outputTwo.writeln(os.EOL + "foo");
        outputTwo.clear(1);
        outputOne.writeln("bar");

        // Assert
        const data: string[] = await promisifyStream(stream);

        expect(data).toEqual([os.EOL + "foo" + os.EOL + "\u001b[1A\u001b[0J\u001b[1A\u001b[0Jbar" + os.EOL + os.EOL]);
    });

    it("should overwrite", async () => {
        // Arrange
        const sections = { sections: [] };
        const output = new ConsoleSectionOutput(sections, stream, OutputMode.VERBOSITY_NORMAL, true, new OutputFormatter());

        // Act
        output.writeln("Foo");
        output.overwrite("Bar");

        // Assert
        const data: string[] = await promisifyStream(stream);

        expect(data).toEqual(["Foo" + os.EOL + "\u001b[1A\u001b[0JBar" + os.EOL]);
    });

    it("should overwrite multiple lines", async () => {
        // Arrange
        const sections = { sections: [] };
        const output = new ConsoleSectionOutput(sections, stream, OutputMode.VERBOSITY_NORMAL, true, new OutputFormatter());

        // Act
        output.writeln("Foo" + os.EOL + "Bar" + os.EOL + "Baz");
        output.overwrite("Bar");

        // Assert
        const data: string[] = await promisifyStream(stream);

        expect(data).toEqual(["Foo" + os.EOL + "Bar" + os.EOL + "Baz" + os.EOL + "\u001b[3A\u001b[0JBar" + os.EOL]);
    });

    it("should handle multiple sections", () => {
        // Arrange
        const sections = { sections: [] };

        // Act
        new ConsoleSectionOutput(sections, stream, OutputMode.VERBOSITY_NORMAL, true, new OutputFormatter());
        new ConsoleSectionOutput(sections, stream, OutputMode.VERBOSITY_NORMAL, true, new OutputFormatter());

        // Assert
        expect(sections.sections.length).toBe(2);
    });

    it("should output with multiple sections", async () => {
        // Arrange
        const output = new StreamOutput(stream);
        const sections = { sections: [] };
        const outputOne = new ConsoleSectionOutput(sections, output.getStream(), OutputMode.VERBOSITY_NORMAL, true, new OutputFormatter());
        const outputTwo = new ConsoleSectionOutput(sections, output.getStream(), OutputMode.VERBOSITY_NORMAL, true, new OutputFormatter());

        // Act
        outputOne.writeln("Foo");
        outputTwo.writeln("Bar");

        outputOne.overwrite("Baz");
        outputTwo.overwrite("Foobar");

        // Assert
        const data: string[] = await promisifyStream(stream);

        expect(data).toEqual(["Foo" + os.EOL + "Bar" + os.EOL + "\u001b[2A\u001b[0JBar" + os.EOL + "\u001b[1A\u001b[0JBaz" + os.EOL + "Bar" + os.EOL + "\u001b[1A\u001b[0JFoobar" + os.EOL]);
    });

    // @note for later usage if the helper is available
    // it("should handle clear section containing question", async () => {
    //     const inputStream = new CustomStream();
    //     inputStream.write("Kebab with fries.\n");
    //
    //     const input = new CollectionInput([]);
    //     input.setInteractive(true);
    //     input.setStream(inputStream);
    //
    //     const sections = {sections: []};
    //     const output = new ConsoleSectionOutput(sections, stream, OutputMode.VERBOSITY_NORMAL, true, new OutputFormatter());
    //
    //     const questionHelper = new QuestionHelper();
    //     const question = new Question("What's your favorite food?");
    //     await questionHelper.ask(input, output, question);
    //     output.clear();
    //
    //     const data: string[] = await promisifyStream(stream);
    //
    //     expect(data).toEqual(["What's your favorite food?" + os.EOL + " > \u001b[2A\u001b[0J"]);
    // });

});
