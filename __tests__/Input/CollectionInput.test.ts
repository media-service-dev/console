/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import each from "jest-each";

import { ArgumentDefinition } from "../../src/Input/ArgumentDefinition";
import { CollectionInput } from "../../src/Input/CollectionInput";
import { InputDefinition } from "../../src/Input/InputDefinition";
import { OptionDefinition } from "../../src/Input/OptionDefinition";
import { OptionMode } from "../../src/Input/OptionMode";
import { ShellUtilities } from "../../src/Utilities/ShellUtilities";

describe("CollectionInput tests", () => {

    it("should correct parse the first argument", () => {
        let input = new CollectionInput([]);

        expect(input.getFirstArgument()).toBeNull();
        input = new CollectionInput([["name", "Foo"]]);
        expect(input.getFirstArgument()).toBe("Foo");
        input = new CollectionInput([["--foo", "Bar"], ["name", "Bar"]]);
        expect(input.getFirstArgument()).toBe("Bar");
    });

    it("should detect correct if has parameter option", () => {
        let input = new CollectionInput([["name", "Foo"], ["--foo", "bar"]]);

        expect(input.hasParameterOption("--foo")).toBeTruthy();
        expect(input.hasParameterOption("--bar")).toBeFalsy();

        input = new CollectionInput(["--foo"]);
        expect(input.hasParameterOption("--foo")).toBeTruthy();

        input = new CollectionInput(["--foo", "--", "--bar"]);
        expect(input.hasParameterOption("--bar")).toBeTruthy();
        expect(input.hasParameterOption("--bar", true)).toBeFalsy();
    });

    it("should return corrent parameter option", () => {
        let input = new CollectionInput([["name", "Foo"], ["--foo", "bar"]]);

        expect(input.getParameterOption("--foo")).toBe("bar");
        expect(input.getParameterOption("--bar", "default")).toBe("default");

        input = new CollectionInput(["Foo", ["--foo", "bar"]]);
        expect(input.getParameterOption("--foo")).toBe("bar");

        input = new CollectionInput(["--foo", "--", ["--bar", "baz"]]);
        expect(input.getParameterOption("--bar")).toBe("baz");
        expect(input.getParameterOption("--bar", "default", true)).toBe("default");
    });

    it("should parse arguments", () => {
        const input = new CollectionInput([["name", "Foo"]], new InputDefinition([new ArgumentDefinition("name")]));

        const args = Array.from(input.getArguments().entries());

        expect(args).toEqual([["name", "Foo"]]);
    });

    each([
        [
            [["--foo", "bar"]],
            [new OptionDefinition("foo")],
            [["foo", "bar"]],
        ],
        [
            [["--foo", "bar"]],
            [new OptionDefinition("foo", "f", OptionMode.VALUE_OPTIONAL, "", "default")],
            [["foo", "bar"]],
        ],
        [
            [],
            [new OptionDefinition("foo", "f", OptionMode.VALUE_OPTIONAL, "", "default")],
            [["foo", "default"]],
        ],
        [
            [["--foo", null]],
            [new OptionDefinition("foo", "f", OptionMode.VALUE_OPTIONAL, "", "default")],
            [["foo", null]],
        ],
        [
            [["-f", "bar"]],
            [new OptionDefinition("foo", "f")],
            [["foo", "bar"]],
        ],
        [
            [["--", null], ["-f", "bar"]],
            [new OptionDefinition("foo", "f", OptionMode.VALUE_OPTIONAL, "", "default")],
            [["foo", "default"]],
        ],
        [
            [["--", null]],
            [],
            [],
        ],
    ]).it("should parse options - test set #%#", (inputOptions, definitions, expectedOptions) => {
        const input = new CollectionInput(inputOptions, new InputDefinition(definitions));

        const options = Array.from(input.getOptions().entries());

        expect(options).toEqual(expectedOptions);
    });

    each([
        [
            [["foo", "foo"]],
            [new ArgumentDefinition("name")],
            "The \"foo\" argument does not exist.",
        ],
        [
            [["--foo", null]],
            [new OptionDefinition("foo", "f", OptionMode.VALUE_REQUIRED)],
            "The \"--foo\" option requires a value.",
        ],
        [
            [["--foo", "foo"]],
            [],
            "The \"--foo\" option does not exist.",
        ],
        [
            [["-o", "foo"]],
            [],
            "The \"-o\" option does not exist.",
        ],
    ])
        .it("should throw in invalid input - test set #%#", (inputOptions, definitions, message) => {
            expect(() => {
                new CollectionInput(inputOptions, new InputDefinition(definitions));
            }).toThrowError(message);
        });

    it("should correctly convert to string", () => {
        let input = new CollectionInput([
            "-f",
            ["-b", "bar"],
            ["--foo", "b a z"],
            "--lala",
            ["test", "Foo"],
            ["test2", "A\nB'C"],
        ]);

        expect(input.toString()).toBe("-f -b=bar --foo=" + ShellUtilities.escapeShellArgument("b a z") + " --lala Foo " + ShellUtilities.escapeShellArgument("A\nB'C"));

        input = new CollectionInput([
            ["-b", ["bval_1", "bval_2"]],
            ["--f", ["fval_1", "fval_2"]],
        ]);
        expect(input.toString()).toBe("-b=bval_1 -b=bval_2 --f=fval_1 --f=fval_2");

        input = new CollectionInput([
            ["array_arg", ["val_1", "val_2"]],
        ]);
        expect(input.toString()).toBe("val_1 val_2");
    });

});
