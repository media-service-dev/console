/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { FormatterHelper } from "../../src/Helper/FormatterHelper";

describe("FormatterHelper", () => {

    describe("formatSection", () => {

        it("should formats a message in a section", () => {
            // Arrange
            const formatter = new FormatterHelper();

            // Act
            const actual = formatter.formatSection("cli", "Some text to display");

            // Assert
            expect(actual).toBe("<info>[cli]</info> Some text to display");
        });

    });

    describe("formatBlock", () => {

        it("should formats a message in a block", () => {
            // Arrange
            const formatter = new FormatterHelper();

            // Act
            const actual = formatter.formatBlock("Some text to display", "error");

            // Assert
            expect(actual).toBe("<error> Some text to display </error>");
        });

        it("should formats messages in a block", () => {
            // Arrange
            const formatter = new FormatterHelper();

            // Act
            const actual = formatter.formatBlock(["Some text to display", "foo bar"], "error");

            // Assert
            expect(actual).toBe("<error> Some text to display </error>\n<error> foo bar              </error>");
        });

        it("should formats message in a block with padding", () => {
            // Arrange
            const formatter = new FormatterHelper();

            // Act
            const actual = formatter.formatBlock("Some text to display", "error", true);

            // Assert
            expect(actual).toBe("<error>                        </error>\n<error>  Some text to display  </error>\n<error>                        </error>");
        });

        it("should formats message in a block with escaping", () => {
            // Arrange
            const formatter = new FormatterHelper();

            // Act
            const actual = formatter.formatBlock("<info>some info</info>", "error", true);

            // Assert
            expect(actual).toBe("<error>                            </error>\n<error>  \\<info>some info\\</info>  </error>\n<error>                            </error>");
        });

    });

    describe("truncate", () => {

        it("should truncate in correct length", () => {
            // Arrange
            const formatter = new FormatterHelper();
            const message = "testing truncate";

            // Act & Assert
            expect(formatter.truncate(message, 4)).toBe("test...");
            expect(formatter.truncate(message, 15)).toBe("testing truncat...");
            expect(formatter.truncate(message, 16)).toBe("testing truncate...");
        });

        it("should truncate with custom suffix", () => {
            // Arrange
            const formatter = new FormatterHelper();
            const message = "testing truncate";

            // Act
            const actual = formatter.truncate(message, 4, "!");

            // Assert
            expect(actual).toBe("test!");
        });

        it("should truncate on longer", () => {
            // Arrange
            const formatter = new FormatterHelper();
            const message = "test";

            // Act
            const actual = formatter.truncate(message, 10);

            // Assert
            expect(actual).toBe(message);
        });

        it("should truncate on negative length", () => {
            // Arrange
            const formatter = new FormatterHelper();
            const message = "testing truncate";

            // Act & Assert
            expect(formatter.truncate(message, -5)).toBe("testing tru...");
            expect(formatter.truncate(message, -100)).toBe("...");
        });

    });

});
