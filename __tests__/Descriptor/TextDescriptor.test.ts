/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import each from "jest-each";
import { TextDescriptor } from "../../src/Descriptor/TextDescriptor";
import { TesterDuplexStream } from "../../src/Tester/TesterDuplexStream";
import { createOutput } from "../Helper/Utils/CreateOutput";
import { TestDataProvider } from "./TestDataProvider";

describe("TextDescriptor", () => {

    const descriptor = new TextDescriptor();
    const options = { rawOutput: false, rawText: false, format: "txt" };

    each(TestDataProvider.getArgumentDefinitions())
        .it("should describe argument definitions", (argumentDefinition, expected) => {
            // Arrange
            const output = createOutput();

            // Act
            descriptor.describe(output, argumentDefinition, options);

            // Assert
            const stream = output.getStream() as TesterDuplexStream;
            const buffer = stream.getContents();
            const actual = buffer.toString().trim();
            expect(actual).toBe(expected);
        });

    each(TestDataProvider.getOptionDefinitions())
        .it("should describe option definitions", (optionDefinition, expected) => {
            // Arrange
            const output = createOutput();

            // Act
            descriptor.describe(output, optionDefinition, options);

            // Assert
            const stream = output.getStream() as TesterDuplexStream;
            const buffer = stream.getContents();
            const actual = buffer.toString().trim();
            expect(actual).toBe(expected);
        });

    each(TestDataProvider.getInputDefinitions())
        .it("should describe input definitions", (inputDefinition, expected) => {
            // Arrange
            const output = createOutput();

            // Act
            descriptor.describe(output, inputDefinition, options);

            // Assert
            const stream = output.getStream() as TesterDuplexStream;
            const buffer = stream.getContents();
            const actual = buffer.toString().trim();
            expect(actual).toBe(expected);
        });

    each(TestDataProvider.getCommands())
        .it("should describe commands", (command, expected) => {
            // Arrange
            const output = createOutput();

            // Act
            descriptor.describe(output, command, options);

            // Assert
            const stream = output.getStream() as TesterDuplexStream;
            const buffer = stream.getContents();
            const actual = buffer.toString().trim();
            expect(actual).toBe(expected);
        });

    each(TestDataProvider.getApplications())
        .it("should describe applications", (command, expected) => {
            // Arrange
            const output = createOutput();

            // Act
            descriptor.describe(output, command, options);

            // Assert
            const stream = output.getStream() as TesterDuplexStream;
            const buffer = stream.getContents();
            const actual = buffer.toString().trim();
            expect(actual).toBe(expected);
        });

});
