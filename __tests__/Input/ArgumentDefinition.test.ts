/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { LogicException } from "../../src/Exception/LogicException";
import { ArgumentDefinition } from "../../src/Input/ArgumentDefinition";
import { ArgumentMode } from "../../src/Input/ArgumentMode";

describe("ArgumentDefinition", () => {

    describe("constructor", () => {
        it("should takes a name as its first argument", () => {
            // Arrange
            const argument = new ArgumentDefinition("foo");

            // Act
            const actual = argument.getName();

            // Assert
            expect(actual).toBe("foo");
        });
    });

    describe("modes", () => {

        it("should have ArgumentMode.OPTIONAL by default", () => {
            // Arrange
            const argument = new ArgumentDefinition("foo");

            // Act
            const actual = argument.isRequired();

            // Assert
            expect(actual).toBeFalsy();
        });

        it("should take null as ArgumentMode.OPTIONAL", () => {
            // Arrange
            const argument = new ArgumentDefinition("foo", null);

            // Act
            const actual = argument.isRequired();

            // Assert
            expect(actual).toBeFalsy();
        });

        it("should take ArgumentMode.OPTIONAL as mode", () => {
            // Arrange
            const argument = new ArgumentDefinition("foo", ArgumentMode.OPTIONAL);

            // Act
            const actual = argument.isRequired();

            // Assert
            expect(actual).toBeFalsy();
        });

        it("should take ArgumentMode.REQUIRED as mode", () => {
            // Arrange
            const argument = new ArgumentDefinition("foo", ArgumentMode.REQUIRED);

            // Act
            const actual = argument.isRequired();

            // Assert
            expect(actual).toBeTruthy();
        });

    });

    describe("isArray", () => {

        it("should returns true if the argument can be an array", () => {
            // Arrange
            const argument = new ArgumentDefinition("foo", ArgumentMode.IS_ARRAY);

            // Act
            const actual = argument.isArray();

            // Assert
            expect(actual).toBeTruthy();
        });

        it("should returns true if the argument can be an array with optional", () => {
            // Arrange
            const argument = new ArgumentDefinition("foo", ArgumentMode.OPTIONAL | ArgumentMode.IS_ARRAY);

            // Act
            const actual = argument.isArray();

            // Assert
            expect(actual).toBeTruthy();
        });

        it("should returns false if the argument can not be an array", () => {
            // Arrange
            const argument = new ArgumentDefinition("foo", ArgumentMode.OPTIONAL);

            // Act
            const actual = argument.isArray();

            // Assert
            expect(actual).toBeFalsy();
        });

    });

    describe("getDescription", () => {

        it("should return the description message", () => {
            // Arrange
            const argument = new ArgumentDefinition("foo", null, "Some description");

            // Act
            const actual = argument.getDescription();

            // Assert
            expect(actual).toBe("Some description");
        });

        it("should return the default description message", () => {
            // Arrange
            const argument = new ArgumentDefinition("foo", null);

            // Act
            const actual = argument.getDescription();

            // Assert
            expect(actual).toBe("");
        });

    });

    describe("getDefault", () => {

        it("should return the default value", () => {
            // Arrange
            const argument = new ArgumentDefinition("foo", ArgumentMode.OPTIONAL, "", "default");

            // Act
            const actual = argument.getDefault();

            // Assert
            expect(actual).toBe("default");
        });

    });

    describe("setDefault", () => {

        it("should reset default value by passing null", () => {
            // Arrange
            const argument = new ArgumentDefinition("foo", ArgumentMode.OPTIONAL, "", "default");

            // Act
            argument.setDefault(null);

            // Assert
            expect(argument.getDefault()).toBeNull();
        });

        it("should changes the default value", () => {
            // Arrange
            const argument = new ArgumentDefinition("foo", ArgumentMode.OPTIONAL, "", "default");

            // Act
            argument.setDefault("bar");

            // Assert
            expect(argument.getDefault()).toBe("bar");
        });

        it("should changes the default value for array", () => {
            // Arrange
            const argument = new ArgumentDefinition("foo", ArgumentMode.OPTIONAL | ArgumentMode.IS_ARRAY);

            // Act
            argument.setDefault(["foo", "bar"]);

            // Assert
            expect(argument.getDefault()).toEqual(["foo", "bar"]);
        });

        it("should not set default with required argument", () => {
            // Arrange
            const argument = new ArgumentDefinition("foo", ArgumentMode.REQUIRED);

            // Act & Assert
            expect(() => {
                argument.setDefault("default");
            }).toThrow(LogicException);
        });

        it("should not set default with required argument", () => {
            // Arrange
            const argument = new ArgumentDefinition("foo", ArgumentMode.REQUIRED);

            // Act & Assert
            expect(() => {
                argument.setDefault("default");
            }).toThrow(LogicException);
        });

        it("should not set not array value on array definition", () => {
            // Arrange
            const argument = new ArgumentDefinition("foo", ArgumentMode.IS_ARRAY);

            // Act & Assert
            expect(() => {
                argument.setDefault("default");
            }).toThrow(LogicException);
        });

    });

});
