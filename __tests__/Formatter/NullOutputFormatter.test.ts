/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { NullOutputFormatter } from "../../src/Formatter/NullOutputFormatter";
import { NullOutputFormatterStyle } from "../../src/Formatter/NullOutputFormatterStyle";
import { OutputFormatterInterface } from "../../src/Formatter/OutputFormatterInterface";
import { OutputFormatterStyle } from "../../src/Formatter/OutputFormatterStyle";

describe("NullOutputFormatter", () => {

    it("should just return the input", () => {
        // Arrange
        const formatter = new NullOutputFormatter();

        // Act
        const actual = formatter.format("foo");

        // Assert
        expect(actual).toBe("foo");
    });

    describe("getStyle", () => {
        it("should return NullOutputFormatterStyle in default", () => {
            // Arrange
            const formatter: OutputFormatterInterface = new NullOutputFormatter();

            // Act
            const actual = formatter.getStyle("null");

            // Assert
            expect(actual).toBeInstanceOf(NullOutputFormatterStyle);
        });

        it("should always return NullOutputFormatterStyle", () => {
            // Arrange
            const formatter: OutputFormatterInterface = new NullOutputFormatter();
            const style = new OutputFormatterStyle();
            formatter.setStyle("null", style);

            // Act
            const actual = formatter.getStyle("null");

            // Assert
            expect(actual).not.toBe(style);
            expect(actual).toBeInstanceOf(NullOutputFormatterStyle);
        });
    });

    describe("hasStyle", () => {
        it("should return false", () => {
            // Arrange
            const formatter: OutputFormatterInterface = new NullOutputFormatter();

            // Act
            const actual = formatter.hasStyle("null");

            // Assert
            expect(actual).toBeFalsy();
        });
        it("should always return false", () => {
            // Arrange
            const formatter: OutputFormatterInterface = new NullOutputFormatter();
            formatter.setStyle("null", new OutputFormatterStyle());

            // Act
            const actual = formatter.hasStyle("null");

            // Assert
            expect(actual).toBeFalsy();
        });
    });

    describe("isDecorated", () => {
        it("should return false", () => {
            // Arrange
            const formatter = new NullOutputFormatter();

            // Act
            const actual = formatter.isDecorated();

            // Assert
            expect(actual).toBeFalsy();
        });

        it("should always return false", () => {
            // Arrange
            const formatter: OutputFormatterInterface = new NullOutputFormatter();
            formatter.setDecorated(true);

            // Act
            const actual = formatter.isDecorated();

            // Assert
            expect(actual).toBeFalsy();
        });
    });

});
