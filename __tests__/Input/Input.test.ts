/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { ArgumentException } from "../../src/Exception/ArgumentException";
import { RuntimeException } from "../../src/Exception/RuntimeException";
import { ArgumentDefinition } from "../../src/Input/ArgumentDefinition";
import { ArgumentMode } from "../../src/Input/ArgumentMode";
import { CollectionInput } from "../../src/Input/CollectionInput";
import { InputDefinition } from "../../src/Input/InputDefinition";
import { OptionDefinition } from "../../src/Input/OptionDefinition";
import { OptionMode } from "../../src/Input/OptionMode";
import { TesterDuplexStream } from "../../src/Tester/TesterDuplexStream";

describe("Input", () => {

    describe("constructor", () => {

        it("should takes an InputDefinition as an argument", () => {
            // Act
            const input = new CollectionInput([["name", "foo"]], new InputDefinition([new ArgumentDefinition("name")]));

            // Assert
            expect(input.getArgument("name")).toBe("foo");
        });

    });

    describe("getOption, getOptions and setOption", () => {

        it("should returns the value for the given option", () => {
            // Act
            const input = new CollectionInput([["--name", "foo"]], new InputDefinition([new OptionDefinition("name")]));

            // Assert
            expect(input.getOption("name")).toBe("foo");
        });

        it("should sets the value for a given option", () => {
            // Arrange
            const input = new CollectionInput([["--name", "foo"]], new InputDefinition([new OptionDefinition("name")]));

            // Act
            input.setOption("name", "bar");

            // Assert
            expect(input.getOption("name")).toBe("bar");
        });

        it("should returns the default value for optional options", () => {
            // Act
            const input = new CollectionInput([["--name", "foo"]], new InputDefinition([new OptionDefinition("name"), new OptionDefinition("bar", "", OptionMode.VALUE_OPTIONAL, "", "default")]));

            // Assert
            expect(input.getOption("bar")).toBe("default");
        });

        it("should returns null for options explicitly passed without value (or an empty value)", () => {
            // Act
            const input = new CollectionInput([["--name", "foo"], ["--bar", ""]], new InputDefinition([new OptionDefinition("name"), new OptionDefinition("bar", "", OptionMode.VALUE_OPTIONAL, "", "default")]));

            // Assert
            expect(input.getOption("bar")).toBe("");
        });

        it("should throw if option does not exist", () => {
            // Arrange
            const input = new CollectionInput([["--name", "foo"]], new InputDefinition([new OptionDefinition("name"), new OptionDefinition("bar", "", OptionMode.VALUE_OPTIONAL, "", "default")]));

            // Act & Assert
            expect(() => {
                input.getOption("foo");
            }).toThrow(ArgumentException);
        });

        it("should not set option if there is no definition", () => {
            // Arrange
            const input = new CollectionInput([["--name", "foo"]], new InputDefinition([new OptionDefinition("name"), new OptionDefinition("bar", "", OptionMode.VALUE_OPTIONAL, "", "default")]));

            // Act & Assert
            expect(() => {
                input.setOption("foo", "bar");
            }).toThrow(ArgumentException);
        });

        it("should returns all option values", () => {
            // Arrange
            const input = new CollectionInput([["--name", "foo"]], new InputDefinition([new OptionDefinition("name")]));

            // Assert
            expect(Array.from(input.getOptions().entries())).toEqual([["name", "foo"]]);
        });

        it("should returns all option values, even optional ones", () => {
            // Act
            const input = new CollectionInput([["--name", "foo"]], new InputDefinition([new OptionDefinition("name"), new OptionDefinition("bar", "", OptionMode.VALUE_OPTIONAL, "", "default")]));

            // Assert
            expect(Array.from(input.getOptions().entries())).toEqual([["name", "foo"], ["bar", "default"]]);
        });

        it("should returns all option values even with given option", () => {
            // Act
            const input = new CollectionInput([["--name", "foo"], ["--bar", ""]], new InputDefinition([new OptionDefinition("name"), new OptionDefinition("bar", "", OptionMode.VALUE_OPTIONAL, "", "default")]));

            // Assert
            expect(Array.from(input.getOptions().entries())).toEqual([["name", "foo"], ["bar", ""]]);
        });

    });

    describe("getArgument, getArguments and setArgument", () => {

        it("should returns the value for the given argument", () => {
            // Arrange
            const input = new CollectionInput([["name", "foo"]], new InputDefinition([new ArgumentDefinition("name")]));

            // Act
            const actual = input.getArgument("name");

            // Assert
            expect(actual).toBe("foo");
        });

        it("should sets the value for a given argument", () => {
            // Arrange
            const input = new CollectionInput([["name", "foo"]], new InputDefinition([new ArgumentDefinition("name")]));

            // Act
            input.setArgument("name", "bar");

            // Assert
            expect(input.getArgument("name")).toBe("bar");
            expect(Array.from(input.getArguments().entries())).toEqual([["name", "bar"]]);
        });

        it("should returns the default value for optional arguments", () => {
            // Arrange
            const input = new CollectionInput([["name", "foo"]], new InputDefinition([new ArgumentDefinition("name"), new ArgumentDefinition("bar", ArgumentMode.OPTIONAL, "", "default")]));

            // Act
            const actual = input.getArgument("bar");

            // Assert
            expect(actual).toBe("default");
        });

        it("should returns all argument values, even optional ones", () => {
            // Arrange
            const input = new CollectionInput([["name", "foo"]], new InputDefinition([new ArgumentDefinition("name"), new ArgumentDefinition("bar", ArgumentMode.OPTIONAL, "", "default")]));

            // Act
            const actual = input.getArguments();

            // Assert
            expect(Array.from(actual.entries())).toEqual([["name", "foo"], ["bar", "default"]]);
        });

        it("should throw on trying to set argument that is not defined", () => {
            // Arrange
            const input = new CollectionInput([["name", "foo"]], new InputDefinition([new ArgumentDefinition("name"), new ArgumentDefinition("bar", ArgumentMode.OPTIONAL, "", "default")]));

            // Act & Assert
            expect(() => {
                input.setArgument("foo", "bar");
            }).toThrow(ArgumentException);
        });

        it("should thow if argument does not exist", () => {
            // Arrange
            const input = new CollectionInput([["name", "foo"]], new InputDefinition([new ArgumentDefinition("name"), new ArgumentDefinition("bar", ArgumentMode.OPTIONAL, "", "default")]));

            // Act & Assert
            expect(() => {
                input.getArgument("foo");
            }).toThrow(ArgumentException);
        });

    });

    describe("validate", () => {

        it("should throw if argument is missing", () => {
            // Arrange
            const input = new CollectionInput([]);
            input.bind(new InputDefinition([new ArgumentDefinition("name", ArgumentMode.REQUIRED)]));

            // Act & Assert
            expect(() => {
                input.validate();
            }).toThrow(RuntimeException);
        });

        it("should throw on missing required arguments with optional", () => {
            // Arrange
            const input = new CollectionInput([["bar", "baz"]]);
            input.bind(new InputDefinition([new ArgumentDefinition("name", ArgumentMode.REQUIRED), new ArgumentDefinition("bar", ArgumentMode.OPTIONAL)]));

            // Act & Assert
            expect(() => {
                input.validate();
            }).toThrow(RuntimeException);
        });

        it("should validate", () => {
            // Arrange
            const input = new CollectionInput([["name", "foo"]]);
            input.bind(new InputDefinition([new ArgumentDefinition("name", ArgumentMode.REQUIRED)]));

            // Act & Assert
            expect(() => {
                input.validate();
            }).not.toThrow();
        });

    });

    describe("isInteractive and setInteractive", () => {

        it("should set interactive", () => {
            // Arrange
            const input = new CollectionInput([]);

            // Act
            input.setInteractive(false);

            // Assert
            expect(input.isInteractive()).toBeFalsy();
        });

        it("should check if it is interactive", () => {
            // Arrange
            const input = new CollectionInput([]);

            // Act
            const actual = input.isInteractive();

            // Assert
            expect(actual).toBeTruthy();
        });

    });

    describe("setStream and getStream", () => {

        it("should set stream", () => {
            // Arrange
            const input = new CollectionInput([]);
            const stream = new TesterDuplexStream();

            // Act
            input.setStream(stream);

            // Assert
            expect(input.getStream()).toBe(stream);
        });

        it("should get stream", () => {
            // Arrange
            const input = new CollectionInput([]);
            const stream = new TesterDuplexStream();
            input.setStream(stream);

            // Act
            const actual = input.getStream();

            // Assert
            expect(actual).toBe(stream);
        });

    });

});
