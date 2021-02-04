/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { ArgumentException } from "../../src/Exception/ArgumentException";
import { LogicException } from "../../src/Exception/LogicException";
import { ArgumentDefinition } from "../../src/Input/ArgumentDefinition";
import { ArgumentMode } from "../../src/Input/ArgumentMode";
import { InputDefinition } from "../../src/Input/InputDefinition";
import { OptionDefinition } from "../../src/Input/OptionDefinition";
import { OptionMode } from "../../src/Input/OptionMode";

describe("InputDefinition", () => {

    let fooArgument: ArgumentDefinition;
    let barArgument: ArgumentDefinition;
    let foo1Argument: ArgumentDefinition;
    let foo2Argument: ArgumentDefinition;

    let fooOption: OptionDefinition;
    let barOption: OptionDefinition;
    let foo1Option: OptionDefinition;
    let foo2Option: OptionDefinition;

    let multi: OptionDefinition;

    beforeEach(() => {
        fooArgument = new ArgumentDefinition("foo");
        barArgument = new ArgumentDefinition("bar");
        foo1Argument = new ArgumentDefinition("foo");
        foo2Argument = new ArgumentDefinition("foo2", ArgumentMode.REQUIRED);

        fooOption = new OptionDefinition("foo", "f");
        barOption = new OptionDefinition("bar", "b");
        foo1Option = new OptionDefinition("foo", "f");
        foo2Option = new OptionDefinition("foo", "p");
        multi = new OptionDefinition("multi", "m|mm|mmm");
    });

    describe("constructor", () => {
        it("should create empty arguments object", () => {
            // Act
            const definition = new InputDefinition();

            // Assert
            const actual = definition.getArguments();
            expect(Array.from(actual.entries())).toEqual([]);
        });

        it("should take an array of ArgumentDefinition objects as argument", () => {
            // Act
            const definition = new InputDefinition([fooArgument, barArgument]);

            // Assert
            const actual = Array.from(definition.getArguments());
            expect(actual).toEqual([["foo", fooArgument], ["bar", barArgument]]);
        });

        it("should create empty options object", () => {
            // Act
            const definition = new InputDefinition();

            // Assert
            const actual = definition.getOptions();
            expect(Array.from(actual.entries())).toEqual([]);
        });

        it("should take an array of OptionDefinition objects as argument", () => {
            // Act
            const definition = new InputDefinition([fooOption, barOption]);

            // Assert
            const actual = Array.from(definition.getOptions());
            expect(actual).toEqual([["foo", fooOption], ["bar", barOption]]);
        });

    });

    describe("setArguments", () => {

        it("should sets the array of ArgumentDefinition objects", () => {
            // Arrange
            const definition = new InputDefinition();

            // Act
            definition.setArguments([fooArgument]);

            // Assert
            const actual = Array.from(definition.getArguments());
            expect(actual).toEqual([["foo", fooArgument]]);
        });

        it("should clears all ArgumentDefinition objects", () => {
            // Arrange
            const definition = new InputDefinition();

            // Act
            definition.setArguments([fooArgument]);
            definition.setArguments([barArgument]);

            // Assert
            const actual = Array.from(definition.getArguments());
            expect(actual).toEqual([["bar", barArgument]]);
        });

    });

    describe("addArguments", () => {

        it("should adds an array of ArgumentDefinition objects", () => {
            // Arrange
            const definition = new InputDefinition();

            // Act
            definition.addArguments([fooArgument]);

            // Assert
            const actual = Array.from(definition.getArguments());
            expect(actual).toEqual([["foo", fooArgument]]);
        });

        it("should not clear ArgumentDefinition objects", () => {
            // Arrange
            const definition = new InputDefinition();

            // Act
            definition.addArguments([fooArgument]);
            definition.addArguments([barArgument]);

            // Assert
            const actual = Array.from(definition.getArguments());
            expect(actual).toEqual([["foo", fooArgument], ["bar", barArgument]]);
        });

    });

    describe("addArgument", () => {
        it("should adds a ArgumentDefinition object", () => {
            // Arrange
            const definition = new InputDefinition();

            // Act
            definition.addArgument(fooArgument);

            // Assert
            const actual = Array.from(definition.getArguments());
            expect(actual).toEqual([["foo", fooArgument]]);
        });

        it("should not clear ArgumentDefinition objects", () => {
            // Arrange
            const definition = new InputDefinition();

            // Act
            definition.addArgument(fooArgument);
            definition.addArgument(barArgument);

            // Assert
            const actual = Array.from(definition.getArguments());
            expect(actual).toEqual([["foo", fooArgument], ["bar", barArgument]]);
        });

        it("should not takes arguments with same name", () => {
            // Arrange
            const definition = new InputDefinition();
            definition.addArgument(fooArgument);

            // Act & Assert
            expect(() => {
                definition.addArgument(foo1Argument);
            }).toThrow(LogicException);
        });

        it("should not take array as not last argument", () => {
            // Arrange
            const definition = new InputDefinition();
            definition.addArgument(new ArgumentDefinition("fooarray", ArgumentMode.IS_ARRAY));

            // Act & Assert
            expect(() => {
                definition.addArgument(foo1Argument);
            }).toThrow(LogicException);
        });

        it("should not take required after optional one", () => {
            // Arrange
            const definition = new InputDefinition();
            definition.addArgument(fooArgument);

            // Act & Assert
            expect(() => {
                definition.addArgument(foo2Argument);
            }).toThrow(LogicException);
        });
    });

    describe("getArgument", () => {

        it("should returns a ArgumentDefinition by its name", () => {
            // Arrange
            const definition = new InputDefinition();
            definition.addArgument(fooArgument);

            // Act
            const actual = definition.getArgument("foo");

            // Assert
            expect(actual).toBe(fooArgument);
        });

        it("should throw on invalid argument", () => {
            // Arrange
            const definition = new InputDefinition();
            definition.addArgument(fooArgument);

            // Act & Assert
            expect(() => {
                definition.getArgument("bar");
            }).toThrow(ArgumentException);
        });
    });

    describe("hasArgument", () => {

        it("should return true if a ArgumentDefinition exists for given name", () => {
            // Arrange
            const definition = new InputDefinition();
            definition.addArgument(fooArgument);

            // Act
            const actual = definition.hasArgument("foo");

            // Assert
            expect(actual).toBeTruthy();
        });

        it("should return false if a ArgumentDefinition does not exist for given name", () => {
            // Arrange
            const definition = new InputDefinition();
            definition.addArgument(fooArgument);

            // Act
            const actual = definition.hasArgument("bar");

            // Assert
            expect(actual).toBeFalsy();
        });

    });

    describe("getArgumentRequiredCount", () => {

        it("should return the correct number of required count", () => {
            // Arrange
            const definition = new InputDefinition();

            // Act
            definition.addArgument(foo2Argument);

            // Assert
            expect(definition.getArgumentRequiredCount()).toBe(1);
            // definition.addArgument(fooArgument);
            // expect(definition.getArgumentRequiredCount()).toBe(1);
        });

        it("should return the correct number of required count with more than one argument", () => {
            // Arrange
            const definition = new InputDefinition();
            definition.addArgument(foo2Argument);

            // Act
            definition.addArgument(fooArgument);

            // Assert
            expect(definition.getArgumentRequiredCount()).toBe(1);
        });

    });

    describe("getArgumentCount", () => {

        it("should returns the correct number of arguments", () => {
            // Arrange
            const definition = new InputDefinition();

            // Act
            definition.addArgument(foo2Argument);

            // Assert
            expect(definition.getArgumentCount()).toBe(1);
        });

        it("should returns the correct number of arguments with multiple arguments", () => {
            // Arrange
            const definition = new InputDefinition();
            definition.addArgument(foo2Argument);

            // Act
            definition.addArgument(fooArgument);

            // Assert
            expect(definition.getArgumentCount()).toBe(2);
        });

    });

    describe("getArgumentDefaults", () => {

        it("should return the correct default value for each argument", () => {
            // Arrange
            const definition = new InputDefinition([
                new ArgumentDefinition("foo1", ArgumentMode.OPTIONAL),
                new ArgumentDefinition("foo2", ArgumentMode.OPTIONAL, "", "default"),
                new ArgumentDefinition("foo3", ArgumentMode.OPTIONAL | ArgumentMode.IS_ARRAY),
            ]);

            // Act
            const defaultValues = definition.getArgumentDefaults();

            // Assert
            expect(Array.from(defaultValues.entries())).toEqual([["foo1", null], ["foo2", "default"], ["foo3", []]]);
        });

        it("should return the correct default value for array argument", () => {
            // Arrange
            const definition = new InputDefinition([
                new ArgumentDefinition("foo4", ArgumentMode.OPTIONAL | ArgumentMode.IS_ARRAY, "", ["foo", "bar"]),
            ]);

            // Act
            const defaultValues = definition.getArgumentDefaults();

            // Assert
            expect(Array.from(defaultValues.entries())).toEqual([["foo4", ["foo", "bar"]]]);
        });

    });

    describe("setOptions", () => {

        it("should set the OptionsDefinition", () => {
            // Act
            const definition = new InputDefinition([fooOption]);

            // Assert
            expect(Array.from(definition.getOptions().entries())).toEqual([["foo", fooOption]]);
        });

        it("should clears all OptionDefinitions", () => {
            // Arrange
            const definition = new InputDefinition([fooOption]);

            // Act
            definition.setOptions([barOption]);

            // Assert
            expect(Array.from(definition.getOptions().entries())).toEqual([["bar", barOption]]);
        });

        it("should throw if the options got cleared", () => {
            // Arrange
            const definition = new InputDefinition([fooOption]);
            definition.setOptions([barOption]);

            // Act & Assert
            expect(() => {
                definition.getOptionForShortcut("f");
            }).toThrow(ArgumentException);
        });

    });

    describe("addOptions", () => {

        it("should adds an array of OptionDefinition objects", () => {
            // Arrange
            const definition = new InputDefinition([fooOption]);

            // Pre assert
            expect(Array.from(definition.getOptions().entries())).toEqual([["foo", fooOption]]);

            // Act
            definition.addOptions([barOption]);

            // Assert
            expect(Array.from(definition.getOptions().entries())).toEqual([["foo", fooOption], ["bar", barOption]]);
        });

    });

    describe("addOption", () => {

        it("should adds a OptionDefinition object", () => {
            // Arrange
            const definition = new InputDefinition();

            // Act
            definition.addOption(fooOption);

            // Assert
            expect(Array.from(definition.getOptions().entries())).toEqual([["foo", fooOption]]);
        });

        it("should adds another OptionDefinition object", () => {
            // Arrange
            const definition = new InputDefinition();
            definition.addOption(fooOption);

            // Act
            definition.addOption(barOption);

            // Assert
            expect(Array.from(definition.getOptions().entries())).toEqual([["foo", fooOption], ["bar", barOption]]);
        });

        it("should not add option with same name", () => {
            // Arrange
            const definition = new InputDefinition();
            definition.addOption(fooOption);

            // Act & Assert
            expect(() => {
                definition.addOption(foo2Option);
            }).toThrow(LogicException);
        });

        it("should not add same shortcut again", () => {
            // Arrange
            const definition = new InputDefinition();
            definition.addOption(fooOption);

            // Act & Assert
            expect(() => {
                definition.addOption(foo1Option);
            }).toThrow(LogicException);
        });

    });

    describe("getOption", () => {

        it("should return OptionDefinition by its name", () => {
            // Arrange
            const definition = new InputDefinition([fooOption]);

            // Act
            const actual = definition.getOption("foo");

            // Assert
            expect(actual).toBe(fooOption);
        });

        it("should throw if the OptionDefinition could not found by its name", () => {
            // Arrange
            const definition = new InputDefinition([fooOption]);

            // Act && Assert
            expect(() => {
                definition.getOption("bar");
            }).toThrow(ArgumentException);
        });

    });

    describe("hasOption", () => {
        it("should returns true if a OptionDefinition exists for the given name", () => {
            // Arrange
            const definition = new InputDefinition([fooOption]);

            // Act && Assert
            expect(definition.hasOption("foo")).toBeTruthy();
        });

        it("should returns false if a OptionDefinition does not exist for the given name", () => {
            // Arrange
            const definition = new InputDefinition([fooOption]);

            // Act && Assert
            expect(definition.hasOption("bar")).toBeFalsy();
        });
    });

    describe("hasShortcut", () => {

        it("should returns true if a OptionsDefinition exists for the given shortcut", () => {
            // Arrange
            const definition = new InputDefinition([fooOption]);

            // Act && Assert
            expect(definition.hasShortcut("f")).toBeTruthy();
        });

        it("should returns false if a OptionDefinition does not exists for the given shortcut", () => {
            // Arrange
            const definition = new InputDefinition([fooOption]);

            // Act && Assert
            expect(definition.hasShortcut("b")).toBeFalsy();
        });

    });

    describe("getOptionForShortcut", () => {

        it("should returns a OptionDefinition by its shortcut", () => {
            // Arrange
            const definition = new InputDefinition([fooOption]);

            // Act
            const actual = definition.getOptionForShortcut("f");

            // Assert
            expect(actual).toBe(fooOption);
        });

        it("should returns a OptionDefinition by all its shortcuts", () => {
            // Arrange
            const definition = new InputDefinition([multi]);

            // Act && Assert
            expect(definition.getOptionForShortcut("m")).toBe(multi);
            expect(definition.getOptionForShortcut("mmm")).toBe(multi);
        });

        it("should throw if there is no ObjectDefinition with given shortcut", () => {
            // Arrange
            const definition = new InputDefinition([fooOption]);

            // Act & Assert
            expect(() => {
                definition.getOptionForShortcut("b");
            }).toThrow(ArgumentException);
        });

    });

    describe("getOptionDefaults", () => {
        it("should returns the default values for all options", () => {
            // Arrange
            const definition = new InputDefinition([
                new OptionDefinition("foo1", null, OptionMode.VALUE_NONE),
                new OptionDefinition("foo2", null, OptionMode.VALUE_REQUIRED),
                new OptionDefinition("foo3", null, OptionMode.VALUE_REQUIRED, "", "default"),
                new OptionDefinition("foo4", null, OptionMode.VALUE_OPTIONAL),
                new OptionDefinition("foo5", null, OptionMode.VALUE_OPTIONAL, "", "default"),
                new OptionDefinition("foo6", null, OptionMode.VALUE_OPTIONAL | OptionMode.VALUE_IS_ARRAY),
                new OptionDefinition("foo7", null, OptionMode.VALUE_OPTIONAL | OptionMode.VALUE_IS_ARRAY, "", ["foo", "bar"]),
            ]);

            // Act
            const actual = definition.getOptionDefaults();

            // Assert
            expect(Array.from(actual.entries())).toEqual([
                ["foo1", false],
                ["foo2", null],
                ["foo3", "default"],
                ["foo4", null],
                ["foo5", "default"],
                ["foo6", []],
                ["foo7", ["foo", "bar"]],
            ]);
        });
    });

    describe("getSynopsisData", () => {

        it("should puts optional options in square brackets", () => {
            // Arrange
            const definition = new InputDefinition([new OptionDefinition("foo")]);

            // Act
            const actual = definition.getSynopsis();

            // Assert
            expect(actual).toBe("[--foo]");
        });

        it("should separates shortcut with a pipe", () => {
            // Arrange
            const definition = new InputDefinition([new OptionDefinition("foo", "f")]);

            // Act
            const actual = definition.getSynopsis();

            // Assert
            expect(actual).toBe("[-f|--foo]");
        });

        it("uses shortcut as value placeholder", () => {
            // Arrange
            const definition = new InputDefinition([new OptionDefinition("foo", "f", OptionMode.VALUE_REQUIRED)]);

            // Act
            const actual = definition.getSynopsis();

            // Assert
            expect(actual).toBe("[-f|--foo FOO]");
        });

        it("puts optional values in square brackets", () => {
            // Arrange
            const definition = new InputDefinition([new OptionDefinition("foo", "f", OptionMode.VALUE_OPTIONAL)]);

            // Act
            const actual = definition.getSynopsis();

            // Assert
            expect(actual).toBe("[-f|--foo [FOO]]");
        });

        it("puts arguments in angle brackets", () => {
            // Arrange
            const definition = new InputDefinition([new ArgumentDefinition("foo", ArgumentMode.REQUIRED)]);

            // Act
            const actual = definition.getSynopsis();

            // Assert
            expect(actual).toBe("<foo>");
        });

        it("puts optional arguments in square brackets", () => {
            // Arrange
            const definition = new InputDefinition([new ArgumentDefinition("foo")]);

            // Act
            const actual = definition.getSynopsis();

            // Assert
            expect(actual).toBe("[<foo>]");
        });

        it("chains optional arguments inside brackets", () => {
            // Arrange
            const definition = new InputDefinition([new ArgumentDefinition("foo"), new ArgumentDefinition("bar")]);

            // Act
            const actual = definition.getSynopsis();

            // Assert
            expect(actual).toBe("[<foo> [<bar>]]");
        });

        it("uses an ellipsis for array arguments", () => {
            // Arrange
            const definition = new InputDefinition([new ArgumentDefinition("foo", ArgumentMode.IS_ARRAY)]);

            // Act
            const actual = definition.getSynopsis();

            // Assert
            expect(actual).toBe("[<foo>...]");
        });

        it("uses an ellipsis for required array arguments", () => {
            // Arrange
            const definition = new InputDefinition([new ArgumentDefinition("foo", ArgumentMode.REQUIRED | ArgumentMode.IS_ARRAY)]);

            // Act
            const actual = definition.getSynopsis();

            // Assert
            expect(actual).toBe("<foo>...");
        });

        it("puts [--] between options and arguments", () => {
            // Arrange
            const definition = new InputDefinition([new OptionDefinition("foo"), new ArgumentDefinition("foo", ArgumentMode.REQUIRED)]);

            // Act
            const actual = definition.getSynopsis();

            // Assert
            expect(actual).toBe("[--foo] [--] <foo>");
        });

        it("should groups options in [options] on short synopsis", () => {
            // Arrange
            const definition = new InputDefinition([new OptionDefinition("foo"), new OptionDefinition("bar"), new ArgumentDefinition("cat")]);

            // Act
            const actual = definition.getSynopsis(true);

            // Assert
            expect(actual).toBe("[options] [--] [<cat>]");
        });

    });

});
