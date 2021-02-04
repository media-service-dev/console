/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import each from "jest-each";

import { OutputFormatter } from "../../src/Formatter/OutputFormatter";
import { OutputFormatterStyle } from "../../src/Formatter/OutputFormatterStyle";
import { OutputMode } from "../../src/Output/OutputMode";
import { MockedOutput } from "./Mock/MockedOutput";

describe("AbstractOutput", () => {

    it("should have default formatter", () => {
        // Arrange
        const output = new MockedOutput();

        // Act
        const formatter = output.getFormatter();

        // Assert
        expect(formatter).toBeInstanceOf(OutputFormatter);
    });

    it("should set and get formatter", () => {
        // Arrange
        const output = new MockedOutput();
        const customFormatter = new OutputFormatter();

        // Act
        output.setFormatter(customFormatter);
        const formatter = output.getFormatter();

        // Assert
        expect(formatter).toBe(customFormatter);
    });

    it("should set decorated to true", () => {
        // Arrange
        const output = new MockedOutput();

        // Act
        output.setDecorated(true);
        const decorated = output.isDecorated();

        // Assert
        expect(decorated).toBeTruthy();
    });

    it("should set decorated to false", () => {
        // Arrange
        const output = new MockedOutput();

        // Act
        output.setDecorated(false);
        const decorated = output.isDecorated();

        // Assert
        expect(decorated).toBeFalsy();
    });

    it("should set verbosity to quiet", () => {
        // Arrange
        const output = new MockedOutput();

        // Act
        output.setVerbosity(OutputMode.VERBOSITY_QUIET);

        // Assert
        expect(output.isQuiet()).toBeTruthy();
        expect(output.isVerbose()).toBeFalsy();
        expect(output.isVeryVerbose()).toBeFalsy();
        expect(output.isDebug()).toBeFalsy();
        expect(output.getVerbosity()).toBe(OutputMode.VERBOSITY_QUIET);
    });

    it("should set verbosity to normal", () => {
        // Arrange
        const output = new MockedOutput();

        // Act
        output.setVerbosity(OutputMode.VERBOSITY_NORMAL);

        // Assert
        expect(output.isQuiet()).toBeFalsy();
        expect(output.isVerbose()).toBeFalsy();
        expect(output.isVeryVerbose()).toBeFalsy();
        expect(output.isDebug()).toBeFalsy();
        expect(output.getVerbosity()).toBe(OutputMode.VERBOSITY_NORMAL);
    });

    it("should set verbosity to verbose", () => {
        // Arrange
        const output = new MockedOutput();

        // Act
        output.setVerbosity(OutputMode.VERBOSITY_VERBOSE);

        // Assert
        expect(output.isQuiet()).toBeFalsy();
        expect(output.isVerbose()).toBeTruthy();
        expect(output.isVeryVerbose()).toBeFalsy();
        expect(output.isDebug()).toBeFalsy();
        expect(output.getVerbosity()).toBe(OutputMode.VERBOSITY_VERBOSE);
    });

    it("should set verbosity to very verbose", () => {
        // Arrange
        const output = new MockedOutput();

        // Act
        output.setVerbosity(OutputMode.VERBOSITY_VERY_VERBOSE);

        // Assert
        expect(output.isQuiet()).toBeFalsy();
        expect(output.isVerbose()).toBeTruthy();
        expect(output.isVeryVerbose()).toBeTruthy();
        expect(output.isDebug()).toBeFalsy();
        expect(output.getVerbosity()).toBe(OutputMode.VERBOSITY_VERY_VERBOSE);
    });

    it("should set verbosity to debug", () => {
        // Arrange
        const output = new MockedOutput();

        // Act
        output.setVerbosity(OutputMode.VERBOSITY_DEBUG);

        // Assert
        expect(output.isQuiet()).toBeFalsy();
        expect(output.isVerbose()).toBeTruthy();
        expect(output.isVeryVerbose()).toBeTruthy();
        expect(output.isDebug()).toBeTruthy();
        expect(output.getVerbosity()).toBe(OutputMode.VERBOSITY_DEBUG);
    });

    it("should not write with verbosity quite", () => {
        // Arrange
        const output = new MockedOutput(OutputMode.VERBOSITY_QUIET);

        // Act
        output.writeln("foo");
        const { length } = output.getLines();

        // Assert
        expect(length).toBe(0);
    });

    it("should write array of messages", () => {
        // Arrange
        const output = new MockedOutput();

        // Act
        output.writeln(["foo", "bar"]);
        const lines = output.getLines();

        // Assert
        expect(lines).toEqual(["foo", "bar"]);
    });

    it("should write raw messages", () => {
        // Arrange
        const output = new MockedOutput();

        // Act
        output.writeln("<info>foo</info>", { mode: OutputMode.OUTPUT_RAW });
        output.writeln("<info>foo</info>", { mode: OutputMode.OUTPUT_PLAIN });
        const lines = output.getLines();

        // Assert
        expect(lines).toEqual(["<info>foo</info>", "foo"]);
    });

    it("should write without decoration", () => {
        // Arrange
        const output = new MockedOutput();

        output.setDecorated(false);

        // Act
        output.writeln("<info>foo</info>");
        const lines = output.getLines();

        // Assert
        expect(lines).toEqual(["foo"]);
    });

    it("should write decorated message", () => {
        // Arrange
        const style = new OutputFormatterStyle("yellow", "red", ["blink"]);
        const output = new MockedOutput();

        output.getFormatter().setStyle("FOO", style);
        output.setDecorated(true);

        // Act
        output.writeln("<foo>foo</foo>");
        const lines = output.getLines();

        // Assert
        expect(lines).toEqual(["\u001b[33;41;5mfoo\u001b[39;49;25m"]);
    });

    it("should write with invalid style", () => {
        // Arrange
        const output = new MockedOutput();

        // Act
        output.clear();
        output.write("<bar>foo</bar>");
        const buffer = output.getBuffer();

        output.clear();
        output.writeln("<bar>foo</bar>");
        const lines = output.getLines();

        // Assert
        expect(buffer).toBe("<bar>foo</bar>");
        expect(lines).toEqual(["<bar>foo</bar>"]);
    });

    each([
        [OutputMode.VERBOSITY_QUIET, "2"],
        [OutputMode.VERBOSITY_NORMAL, "123"],
        [OutputMode.VERBOSITY_VERBOSE, "1234"],
        [OutputMode.VERBOSITY_VERY_VERBOSE, "12345"],
        [OutputMode.VERBOSITY_DEBUG, "123456"],
    ])
        .it("should write with verbosity option", (verbosity, expected) => {
            // Arrange
            const output = new MockedOutput();

            output.setVerbosity(verbosity);
            output.clear();

            // Act
            output.write("1", { newline: false });
            output.write("2", { newline: false, mode: OutputMode.VERBOSITY_QUIET });
            output.write("3", { newline: false, mode: OutputMode.VERBOSITY_NORMAL });
            output.write("4", { newline: false, mode: OutputMode.VERBOSITY_VERBOSE });
            output.write("5", { newline: false, mode: OutputMode.VERBOSITY_VERY_VERBOSE });
            output.write("6", { newline: false, mode: OutputMode.VERBOSITY_DEBUG });
            const lines = output.getLines();

            // Assert
            expect(lines).toEqual([expected]);
        });

});
