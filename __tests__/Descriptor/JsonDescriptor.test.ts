/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import each from "jest-each";
import { ApplicationInterface } from "../../src/Application/ApplicationInterface";
import { JsonDescriptor } from "../../src/Descriptor/JsonDescriptor";
import { TesterDuplexStream } from "../../src/Tester/TesterDuplexStream";
import { createOutput } from "../Helper/Utils/CreateOutput";
import { TestDataProvider } from "./TestDataProvider";

describe("JsonDescriptor", () => {

    const descriptor = new JsonDescriptor();
    const options = { rawOutput: false, rawText: false, format: "json" };

    each(TestDataProvider.getArgumentDefinitions())
        .it("should describe argument definitions", (argumentDefinition, _, expected) => {
            // Arrange
            const output = createOutput();

            // Act
            descriptor.describe(output, argumentDefinition, options);

            // Assert
            const stream = output.getStream() as TesterDuplexStream;
            const buffer = stream.getContents();
            const actual = buffer.toString().trim();
            expect(JSON.parse(actual)).toEqual(expected);
        });

    each(TestDataProvider.getOptionDefinitions())
        .it("should describe option definitions", (optionDefinition, _, expected) => {
            // Arrange
            const output = createOutput();

            // Act
            descriptor.describe(output, optionDefinition, options);

            // Assert
            const stream = output.getStream() as TesterDuplexStream;
            const buffer = stream.getContents();
            const actual = buffer.toString().trim();
            expect(JSON.parse(actual)).toEqual(expected);
        });

    each(TestDataProvider.getInputDefinitions())
        .it("should describe input definitions", (inputDefinition, _, expected) => {
            // Arrange
            const output = createOutput();

            // Act
            descriptor.describe(output, inputDefinition, options);

            // Assert
            const stream = output.getStream() as TesterDuplexStream;
            const buffer = stream.getContents();
            const actual = buffer.toString().trim();
            expect(JSON.parse(actual)).toEqual(expected);
        });

    each(TestDataProvider.getCommands())
        .it("should describe commands", (inputDefinition, _, expected) => {
            // Arrange
            const output = createOutput();

            // Act
            descriptor.describe(output, inputDefinition, options);

            // Assert
            const stream = output.getStream() as TesterDuplexStream;
            const buffer = stream.getContents();
            const actual = buffer.toString().trim();
            expect(JSON.parse(actual)).toEqual(expected);
        });

    each(TestDataProvider.getApplications())
        .it("should describe applications", (application: ApplicationInterface, _, expected) => {
            // Arrange

            // Replaces the dynamic placeholders of the command help text with a static version.
            // The placeholder %command.full_name% includes the script path that is not predictable
            // and can not be tested against.
            for (const command of application.all().values()) {
                command.setHelp((command.getHelp() ?? "").replace(/%command.full_name%/g, "bin/console %command.name%"));
            }

            const output = createOutput();

            // Act
            descriptor.describe(output, application, options);

            // Assert
            const stream = output.getStream() as TesterDuplexStream;
            const buffer = stream.getContents();
            const actual = buffer.toString().trim();
            expect(JSON.parse(actual)).toEqual(expected);
        });

});
