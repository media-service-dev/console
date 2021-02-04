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
import { OptionDefinition } from "../../src/Input/OptionDefinition";
import { OptionMode } from "../../src/Input/OptionMode";

describe("OptionsDefinition", function () {

    describe("constructor", () => {
        it("should take in constructor a name as its first argument", () => {
            // Act
            const option = new OptionDefinition("foo");
            const actual = option.getName();

            // Assert
            expect(actual).toBe("foo");
        });

        it("should remove the leading -- in constructor name argument", () => {
            // Act
            const option = new OptionDefinition("--foo");
            const actual = option.getName();

            // Assert
            expect(actual).toBe("foo");
        });
    });

    it("should throw on array mode without value", () => {
        expect(() => {
            new OptionDefinition("foo", "f", OptionMode.VALUE_IS_ARRAY);
        }).toThrow(ArgumentException);
    });

    describe("shortcut", () => {
        it("should take a shortcut in constructor as its second argument", () => {
            // Act
            const option = new OptionDefinition("foo", "f");
            const actual = option.getShortcut();

            // Assert
            expect(actual).toBe("f");
        });

        it("should take shortcuts in constructor and removes the leading -", () => {
            // Act
            const option = new OptionDefinition("foo", "-f|-ff|fff");
            const actual = option.getShortcut();

            // Assert
            expect(actual).toBe("f|ff|fff");
        });

        it("should take shortcuts as array in constructor and removes the leading -", () => {
            // Act
            const option = new OptionDefinition("foo", ["f", "ff", "-fff"]);
            const actual = option.getShortcut();

            // Assert
            expect(actual).toBe("f|ff|fff");
        });
    });

    describe("modes", () => {

        it("should have a default mode", () => {
            // Act
            const option = new OptionDefinition("foo", "f");

            // Assert
            expect(option.acceptValue()).toBeFalsy();
            expect(option.isValueRequired()).toBeFalsy();
            expect(option.isValueOptional()).toBeFalsy();
        });

        it("should take null as mode", () => {
            // Act
            const option = new OptionDefinition("foo", "f", null);

            // Assert
            expect(option.acceptValue()).toBeFalsy();
            expect(option.isValueRequired()).toBeFalsy();
            expect(option.isValueOptional()).toBeFalsy();
        });

        it("should take OptionMode.VALUE_NONE as mode", () => {
            // Act
            const option = new OptionDefinition("foo", "f", OptionMode.VALUE_NONE);

            // Assert
            expect(option.acceptValue()).toBeFalsy();
            expect(option.isValueRequired()).toBeFalsy();
            expect(option.isValueOptional()).toBeFalsy();
        });

        it("should take OptionMode.VALUE_REQUIRED as mode", () => {
            // Act
            const option = new OptionDefinition("foo", "f", OptionMode.VALUE_REQUIRED);

            // Assert
            expect(option.acceptValue()).toBeTruthy();
            expect(option.isValueRequired()).toBeTruthy();
            expect(option.isValueOptional()).toBeFalsy();
        });

        it("should take OptionMode.VALUE_OPTIONAL as mode", () => {
            // Act
            const option = new OptionDefinition("foo", "f", OptionMode.VALUE_OPTIONAL);

            // Assert
            expect(option.acceptValue()).toBeTruthy();
            expect(option.isValueRequired()).toBeFalsy();
            expect(option.isValueOptional()).toBeTruthy();
        });

    });

    it("should not take invalid mode", () => {
        expect(() => {
            new OptionDefinition("foo", "f", -1);
        }).toThrow(ArgumentException);
    });

    it("should throw on empty name", () => {
        expect(() => {
            new OptionDefinition("");
        }).toThrow(ArgumentException);
    });

    it("should throw on name is double dash", () => {
        expect(() => {
            new OptionDefinition("--");
        }).toThrow(ArgumentException);
    });

    it("should throw on shortcut is dash", () => {
        expect(() => {
            new OptionDefinition("foo", "-");
        }).toThrow(ArgumentException);
    });

    describe("isArray", () => {
        it("should returns true if the option can be an array", () => {
            // Act
            const option = new OptionDefinition("foo", null, OptionMode.VALUE_OPTIONAL | OptionMode.VALUE_IS_ARRAY);
            const actual = option.isArray();

            // Assert
            expect(actual).toBeTruthy();
        });

        it("should returns false if the option can not be an array", () => {
            // Act
            const option = new OptionDefinition("foo", null, OptionMode.VALUE_NONE);
            const actual = option.isArray();

            // Assert
            expect(actual).toBeFalsy();
        });
    });

    it("should get description", () => {
        // Act
        const option = new OptionDefinition("foo", "f", null, "Bar");
        const actual = option.getDescription();

        // Assert
        expect(actual).toBe("Bar");
    });

    describe("getDefault", () => {

        it("should returns the default value on optional", () => {
            // Arrange
            const option = new OptionDefinition("foo", null, OptionMode.VALUE_OPTIONAL, "", "default");

            // Act
            const actual = option.getDefault();

            // Assert
            expect(actual).toBe("default");
        });

        it("should returns the default value on required", () => {
            // Arrange
            const option = new OptionDefinition("foo", null, OptionMode.VALUE_REQUIRED, "", "default");

            // Act
            const actual = option.getDefault();

            // Assert
            expect(actual).toBe("default");
        });

        it("should returns null if not default is configured", () => {
            // Arrange
            const option = new OptionDefinition("foo", null, OptionMode.VALUE_REQUIRED);

            // Act
            const actual = option.getDefault();

            // Assert
            expect(actual).toBeNull();
        });

        it("should returns an empty array if option is an array", () => {
            // Arrange
            const option = new OptionDefinition("foo", null, OptionMode.VALUE_OPTIONAL | OptionMode.VALUE_IS_ARRAY);

            // Act
            const actual = option.getDefault();

            // Assert
            expect(actual).toEqual([]);
        });

        it("should returns false if the option does not take a value", () => {
            // Arrange
            const option = new OptionDefinition("foo", null, OptionMode.VALUE_NONE);

            // Act
            const actual = option.getDefault();

            // Assert
            expect(actual).toBe(false);
        });

    });

    describe("setDefault", () => {

        it("should reset default value by passing null", () => {
            // Arrange
            const option = new OptionDefinition("foo", null, OptionMode.VALUE_REQUIRED, "", "default");

            // Act
            option.setDefault(null);

            // Assert
            const actual = option.getDefault();
            expect(actual).toBeNull();
        });

        it("should change the default value", () => {
            // Arrange
            const option = new OptionDefinition("foo", null, OptionMode.VALUE_REQUIRED, "", "default");

            // Act
            option.setDefault("another");

            // Assert
            const actual = option.getDefault();
            expect(actual).toBe("another");
        });

        it("should change the default value on array", () => {
            // Arrange
            const option = new OptionDefinition("foo", null, OptionMode.VALUE_REQUIRED | OptionMode.VALUE_IS_ARRAY, "");

            // Act
            option.setDefault(["lorem", "ipsum"]);

            // Assert
            const actual = option.getDefault();
            expect(actual).toEqual(["lorem", "ipsum"]);
        });

    });

    it("should throw on OptionMode.VALUE_NONE when setDefault", () => {
        // Arrange
        const option = new OptionDefinition("foo", "f", OptionMode.VALUE_NONE);

        // Act & Assert
        expect(() => {
            option.setDefault("default");
        }).toThrow(LogicException);
    });

    it("should throw when set string default value on mode OptionMode.VALUE_IS_ARRAY", () => {
        // Arrange
        const option = new OptionDefinition("foo", "f", OptionMode.VALUE_OPTIONAL | OptionMode.VALUE_IS_ARRAY);

        // Act & Assert
        expect(() => {
            option.setDefault("default");
        }).toThrow(LogicException);
    });

    describe("equals", () => {

        it("should equal on different descriptions", () => {
            // Arrange
            const option = new OptionDefinition("foo", "f", null, "Foo");
            const option2 = new OptionDefinition("foo", "f", null, "Bar");

            // Act
            const actual = option.equals(option2);

            // Assert
            expect(actual).toBeTruthy();
        });

        it("should not equal on different default values", () => {
            // Arrange
            const option = new OptionDefinition("foo", "f", OptionMode.VALUE_OPTIONAL, "Foo");
            const option2 = new OptionDefinition("foo", "f", OptionMode.VALUE_OPTIONAL, "Foo", true);

            // Act
            const actual = option.equals(option2);

            // Assert
            expect(actual).toBeFalsy();
        });

        it("should not equal on different names", () => {
            // Arrange
            const option = new OptionDefinition("foo", "f", null, "Foo");
            const option2 = new OptionDefinition("bar", "f", null, "Foo");

            // Act
            const actual = option.equals(option2);

            // Assert
            expect(actual).toBeFalsy();
        });

        it("should not equal on different shortcuts", () => {
            // Arrange
            const option = new OptionDefinition("foo", "f", null, "Foo");
            const option2 = new OptionDefinition("foo", "", null, "Foo");

            // Act
            const actual = option.equals(option2);

            // Assert
            expect(actual).toBeFalsy();
        });

        it("should not equal on different mode", () => {
            // Arrange
            const option = new OptionDefinition("foo", "f", null, "Foo");
            const option2 = new OptionDefinition("foo", "f", OptionMode.VALUE_OPTIONAL, "Foo");

            // Act
            const actual = option.equals(option2);

            // Assert
            expect(actual).toBeFalsy();
        });

    });

});
