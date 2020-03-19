/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { NullOutputFormatterStyle } from "../../src/Formatter/NullOutputFormatterStyle";
import { OutputFormatterStyleInterface } from "../../src/Formatter/OutputFormatterStyleInterface";

describe("NullOutputFormatterStyle", () => {

    it("should just return the input", () => {
        // Arrange
        const formatter = new NullOutputFormatterStyle();

        // Act
        const actual = formatter.apply("foo");

        // Assert
        expect(actual).toBe("foo");
    });

    it("should not set background", () => {
        // Arrange
        const formatter: OutputFormatterStyleInterface = new NullOutputFormatterStyle();
        formatter.setBackground("black");

        // Act
        const actual = formatter.apply("foo");

        // Assert
        expect(actual).toBe("foo");
    });

    it("should not set foreground", () => {
        // Arrange
        const formatter: OutputFormatterStyleInterface = new NullOutputFormatterStyle();
        formatter.setForeground("black");

        // Act
        const actual = formatter.apply("foo");

        // Assert
        expect(actual).toBe("foo");
    });

    it("should not set option", () => {
        // Arrange
        const formatter: OutputFormatterStyleInterface = new NullOutputFormatterStyle();
        formatter.setOption("bold");
        formatter.setOption("conceal");

        // Act
        const actual = formatter.apply("foo");

        // Assert
        expect(actual).toBe("foo");
    });

});
