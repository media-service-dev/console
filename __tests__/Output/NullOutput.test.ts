/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { NullOutputFormatter } from "../../src/Formatter/NullOutputFormatter";
import { OutputFormatter } from "../../src/Formatter/OutputFormatter";
import { NullOutput } from "../../src/Output/NullOutput";
import { OutputInterface } from "../../src/Output/OutputInterface";
import { OutputMode } from "../../src/Output/OutputMode";

describe("NullOutput", () => {

    describe("verbosity", () => {
        it("should returns VERBOSITY_QUIET for NullOutput by default", () => {
            // Arrange
            const output = new NullOutput();

            // Act
            const actual = output.getVerbosity();

            // Assert
            expect(actual).toBe(OutputMode.VERBOSITY_QUIET);
        });

        it("should always returns VERBOSITY_QUIET for NullOutput", () => {
            // Arrange
            const output: OutputInterface = new NullOutput();
            output.setVerbosity(OutputMode.VERBOSITY_NORMAL);

            // Act
            const actual = output.getVerbosity();

            // Assert
            expect(actual).toBe(OutputMode.VERBOSITY_QUIET);
        });
    });

    describe("formatter", () => {
        it("should returns NullFormatterOutput in default", () => {
            // Arrange
            const output: OutputInterface = new NullOutput();

            // Act
            const actual = output.getFormatter();

            // Assert
            expect(actual).toBeInstanceOf(NullOutputFormatter);
        });

        it("should always return NullFormatterOutput", () => {
            // Arrange
            const output: OutputInterface = new NullOutput();
            output.setFormatter(new OutputFormatter());

            // Act
            const actual = output.getFormatter();

            // Assert
            expect(actual).toBeInstanceOf(NullOutputFormatter);
        });
    });

    describe("decorated", () => {
        it("should return false in default", () => {
            // Arrange
            const output: OutputInterface = new NullOutput();

            // Act
            const actual = output.isDecorated();

            // Assert
            expect(actual).toBeFalsy();
        });

        it("should return always false", () => {
            // Arrange
            const output: OutputInterface = new NullOutput();
            output.setDecorated(true);

            // Act
            const actual = output.isDecorated();

            // Assert
            expect(actual).toBeFalsy();
        });
    });

    describe("verbose", () => {

        it("should return false in default", () => {
            // Arrange
            const output = new NullOutput();

            // Act
            const actual = output.isVerbose();

            // Assert
            expect(actual).toBeFalsy();
        });

        it("should return always false", () => {
            // Arrange
            const output: OutputInterface = new NullOutput();
            output.setVerbosity(OutputMode.VERBOSITY_VERBOSE);

            // Act
            const actual = output.isVerbose();

            // Assert
            expect(actual).toBeFalsy();
        });

    });

    describe("very verbose", () => {

        it("should return false in default", () => {
            // Arrange
            const output = new NullOutput();

            // Act
            const actual = output.isVeryVerbose();

            // Assert
            expect(actual).toBeFalsy();
        });

        it("should return always false", () => {
            // Arrange
            const output: OutputInterface = new NullOutput();
            output.setVerbosity(OutputMode.VERBOSITY_VERY_VERBOSE);

            // Act
            const actual = output.isVeryVerbose();

            // Assert
            expect(actual).toBeFalsy();
        });

    });

    describe("debug", () => {

        it("should return false in default", () => {
            // Arrange
            const output = new NullOutput();

            // Act
            const actual = output.isDebug();

            // Assert
            expect(actual).toBeFalsy();
        });

        it("should return always false", () => {
            // Arrange
            const output: OutputInterface = new NullOutput();
            output.setVerbosity(OutputMode.VERBOSITY_DEBUG);

            // Act
            const actual = output.isDebug();

            // Assert
            expect(actual).toBeFalsy();
        });

    });

});
