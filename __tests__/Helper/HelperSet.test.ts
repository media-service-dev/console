/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { Command } from "../../src/Command/Command";
import { ArgumentException } from "../../src/Exception/ArgumentException";
import { HelperSet } from "../../src/Helper/HelperSet";
import { genericHelper } from "./Mock/GenericHelper";

describe("HelperSet", () => {

    describe("constructor", () => {

        it("should set given helper to helpers", () => {
            // Act
            const helper = genericHelper("mock");
            const helperSet = new HelperSet([helper]);

            // Assert
            const actual = helperSet.get("mock");
            expect(actual).toBe(helper);
        });

    });

    describe("set", () => {

        it("should adds helper to helpers", () => {
            // Arrange
            const helper = genericHelper("foo");
            const helperSet = new HelperSet();

            // Act
            helperSet.set(helper);

            // Assert
            expect(helperSet.has("foo")).toBeTruthy();
        });

        it("should adds more than one helper to helpers", () => {
            // Arrange
            const helperFoo = genericHelper("foo");
            const helperBar = genericHelper("bar");
            const helperSet = new HelperSet();

            // Act
            helperSet.set(helperFoo);
            helperSet.set(helperBar);

            // Assert
            expect(helperSet.has("foo")).toBeTruthy();
            expect(helperSet.has("bar")).toBeTruthy();
        });

    });

    describe("has", () => {

        it("should find set helper", () => {
            // Arrange
            const helperSet = new HelperSet([genericHelper("foo")]);

            // Act
            const actual = helperSet.has("foo");

            // Assert
            expect(actual).toBeTruthy();
        });

    });

    describe("get", () => {

        it("should returns correct helper by name", () => {
            // Arrange
            const helperFoo = genericHelper("foo");
            const helperBar = genericHelper("bar");
            const helperSet = new HelperSet([helperFoo, helperBar]);

            // Act
            const actualFoo = helperSet.get("foo");
            const actualBar = helperSet.get("bar");

            // Assert
            expect(actualFoo).toBe(helperFoo);
            expect(actualBar).toBe(helperBar);
        });

        it("should throw if helper does not exist", () => {
            // Arrange
            const helperFoo = genericHelper("foo");
            const helperSet = new HelperSet([helperFoo]);

            // Act & Assert
            expect(() => {
                helperSet.get("bar");
            }).toThrow(ArgumentException);
        });
    });

    describe("setCommand", () => {

        it("should stores given command", () => {
            // Arrange
            const command = new Command("foo");
            const helperSet = new HelperSet();

            // Act
            helperSet.setCommand(command);

            // Assert
            expect(helperSet.getCommand()).toBe(command);
        });

        it("should overwrites stored command with consecutive calls", () => {
            // Arrange
            const commandFoo = new Command("foo");
            const commandBar = new Command("bar");
            const helperSet = new HelperSet();
            helperSet.setCommand(commandFoo);

            // Act
            helperSet.setCommand(commandBar);

            // Assert
            expect(helperSet.getCommand()).toBe(commandBar);
        });

    });

    describe("getCommand", () => {
        it("should retrieves stored command", () => {
            // Arrange
            const command = new Command("foo");
            const helperSet = new HelperSet();
            helperSet.setCommand(command);

            // Act
            const actual = helperSet.getCommand();

            // Assert
            expect(actual).toBe(command);
        });
    });

    describe("getHelpers", () => {

        it("should return map of helpers", () => {
            // Arrange
            const helperFoo = genericHelper("foo");
            const helperBar = genericHelper("bar");
            const helperSet = new HelperSet([helperFoo, helperBar]);

            // Act
            const actual = helperSet.getHelpers();

            // Assert
            expect(Array.from(actual.entries())).toEqual([["foo", helperFoo], ["bar", helperBar]]);
        });

    });

});
