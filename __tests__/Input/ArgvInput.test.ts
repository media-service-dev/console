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
import { ArgumentMode } from "../../src/Input/ArgumentMode";
import { ArgvInput } from "../../src/Input/ArgvInput";
import { InputDefinition } from "../../src/Input/InputDefinition";
import { OptionDefinition } from "../../src/Input/OptionDefinition";
import { OptionMode } from "../../src/Input/OptionMode";
import { ShellUtilities } from "../../src/Utilities/ShellUtilities";

describe("ArgvInput tests", () => {

    it("should correct work with constructor", () => {
        process.argv = ["node", "file.js", "foo"];
        const input = new ArgvInput();
        expect((input as any).tokens).toEqual(["foo"]);
    });

    it("should correct parse arguments", () => {
        const input = new ArgvInput(["node", "file.js", "foo"]);

        // parsed required arguments
        input.bind(new InputDefinition([new ArgumentDefinition("name")]));
        let args = Array.from(input.getArguments().entries());
        expect(args).toEqual([["name", "foo"]]);

        // parse is Stateless
        input.bind(new InputDefinition([new ArgumentDefinition("name")]));
        args = Array.from(input.getArguments().entries());
        expect(args).toEqual([["name", "foo"]]);

    });

    each([
        [ // #0
            ["node", "file.js", "--foo"],
            [new OptionDefinition("foo")],
            [["foo", true]],
        ],
        [ // #1
            ["node", "file.js", "--foo=bar"],
            [new OptionDefinition("foo", "f", OptionMode.VALUE_REQUIRED)],
            [["foo", "bar"]],
        ],
        [ // #2
            ["node", "file.js", "--foo", "bar"],
            [new OptionDefinition("foo", "f", OptionMode.VALUE_REQUIRED)],
            [["foo", "bar"]],
        ],
        [ // #3
            ["node", "file.js", "--foo="],
            [new OptionDefinition("foo", "f", OptionMode.VALUE_OPTIONAL)],
            [["foo", ""]],
        ],
        [ // #4
            ["node", "file.js", "--foo=", "bar"],
            [
                new OptionDefinition("foo", "f", OptionMode.VALUE_OPTIONAL),
                new ArgumentDefinition("name", ArgumentMode.REQUIRED),
            ],
            [["foo", ""]],
        ],
        [ // #5
            ["node", "file.js", "bar", "--foo"],
            [
                new OptionDefinition("foo", "f", OptionMode.VALUE_OPTIONAL),
                new ArgumentDefinition("name", ArgumentMode.REQUIRED),
            ],
            [["foo", null]],
        ],
        [ // #6
            ["node", "file.js", "--foo", "", "bar"],
            [
                new OptionDefinition("foo", "f", OptionMode.VALUE_OPTIONAL),
                new ArgumentDefinition("name", ArgumentMode.REQUIRED),
            ],
            [["foo", ""]],
        ],
        [ // #7
            ["node", "file.js", "--foo"],
            [new OptionDefinition("foo", "f", OptionMode.VALUE_OPTIONAL)],
            [["foo", null]],
        ],
        [ // #8
            ["node", "file.js", "-f"],
            [new OptionDefinition("foo", "f")],
            [["foo", true]],
        ],
        [ // #9
            ["node", "file.js", "-fbar"],
            [new OptionDefinition("foo", "f", OptionMode.VALUE_REQUIRED)],
            [["foo", "bar"]],
        ],
        [ // #10
            ["node", "file.js", "-f", "bar"],
            [new OptionDefinition("foo", "f", OptionMode.VALUE_REQUIRED)],
            [["foo", "bar"]],
        ],
        [ // #11
            ["node", "file.js", "-f", ""],
            [new OptionDefinition("foo", "f", OptionMode.VALUE_OPTIONAL)],
            [["foo", ""]],
        ],
        [ // #12
            ["node", "file.js", "-f", "", "foo"],
            [new ArgumentDefinition("name"), new OptionDefinition("foo", "f", OptionMode.VALUE_OPTIONAL)],
            [["foo", ""]],
        ],
        [ // #12
            ["node", "file.js", "-f", "", "-b"],
            [new OptionDefinition("foo", "f", OptionMode.VALUE_OPTIONAL), new OptionDefinition("bar", "b")],
            [["foo", ""], ["bar", true]],
        ],
        [ // #13
            ["node", "file.js", "-f", "-b", "foo"],
            [
                new ArgumentDefinition("name"),
                new OptionDefinition("foo", "f", OptionMode.VALUE_OPTIONAL),
                new OptionDefinition("bar", "b"),
            ],
            [["foo", null], ["bar", true]],
        ],
        [ // #14
            ["node", "file.js", "-fb"],
            [new OptionDefinition("foo", "f"), new OptionDefinition("bar", "b")],
            [["foo", true], ["bar", true]],
        ],
        [ // #15
            ["node", "file.js", "-fb", "bar"],
            [new OptionDefinition("foo", "f"), new OptionDefinition("bar", "b", OptionMode.VALUE_REQUIRED)],
            [["foo", true], ["bar", "bar"]],
        ],
        [ // #16
            ["node", "file.js", "-fb", "bar"],
            [new OptionDefinition("foo", "f"), new OptionDefinition("bar", "b", OptionMode.VALUE_OPTIONAL)],
            [["foo", true], ["bar", "bar"]],
        ],
        [ // #17
            ["node", "file.js", "-fbbar"],
            [new OptionDefinition("foo", "f"), new OptionDefinition("bar", "b", OptionMode.VALUE_OPTIONAL)],
            [["foo", true], ["bar", "bar"]],
        ],
        [ // #18
            ["node", "file.js", "-fbbar"],
            [
                new OptionDefinition("foo", "f", OptionMode.VALUE_OPTIONAL),
                new OptionDefinition("bar", "b", OptionMode.VALUE_OPTIONAL),
            ],
            [["foo", "bbar"], ["bar", null]],
        ],
    ])
        .it("should parses options - data set #%#", (argv, definitions, expected) => {
            const input = new ArgvInput(argv);
            input.bind(new InputDefinition(definitions));

            const options = Array.from(input.getOptions().entries());
            expect(options).toEqual(expected);
        });

    each([
        [ // #0
            ["node", "file.js", "--foo"],
            [new OptionDefinition("foo", "f", OptionMode.VALUE_REQUIRED)],
            "The \"--foo\" option requires a value.",
        ],
        [ // #1
            ["node", "file.js", "-f"],
            [new OptionDefinition("foo", "f", OptionMode.VALUE_REQUIRED)],
            "The \"--foo\" option requires a value.",
        ],
        [ // #2
            ["node", "file.js", "-ffoo"],
            [new OptionDefinition("foo", "f", OptionMode.VALUE_NONE)],
            "The \"-o\" option does not exist.",
        ],
        [ // #3
            ["node", "file.js", "--foo=bar"],
            [new OptionDefinition("foo", "f", OptionMode.VALUE_NONE)],
            "The \"--foo\" option does not accept a value.",
        ],
        [ // #4
            ["node", "file.js", "foo", "bar"],
            [],
            "No arguments expected, got \"foo\".",
        ],
        [ // #5
            ["node", "file.js", "foo", "bar"],
            [new ArgumentDefinition("number")],
            "Too many arguments, expected arguments \"number\".",
        ],
        [ // #6
            ["node", "file.js", "foo", "bar", "zzz"],
            [new ArgumentDefinition("number"), new ArgumentDefinition("county")],
            "Too many arguments, expected arguments \"number\" \"county\".",
        ],
        [ // #7
            ["node", "file.js", "--foo"],
            [],
            "The \"--foo\" option does not exist.",
        ],
        [ // #8
            ["node", "file.js", "-f"],
            [],
            "The \"-f\" option does not exist.",
        ],
        [ // #9
            ["node", "file.js", "-1"],
            [new ArgumentDefinition("number")],
            "The \"-1\" option does not exist.",
        ],
        [ // #10
            ["node", "file.js", "-fЩ"],
            [new OptionDefinition("foo", "f", OptionMode.VALUE_NONE)],
            "The \"-Щ\" option does not exist.",
        ],

    ])
        .it("should fail parse input - data set #%#", (argv, definitions, message) => {
            expect(() => {
                const input = new ArgvInput(argv);
                input.bind(new InputDefinition(definitions));
            }).toThrowError(message);
        });

    it("should parse array argument", () => {
        const input = new ArgvInput(["node", "file.js", "foo", "bar", "baz", "bat"]);
        input.bind(new InputDefinition([new ArgumentDefinition("name", ArgumentMode.IS_ARRAY)]));

        const args = Array.from(input.getArguments().entries());
        expect(args).toEqual([["name", ["foo", "bar", "baz", "bat"]]]);
    });

    it("should parse array option", () => {
        let input = new ArgvInput(["node", "file.js", "--name=foo", "--name=bar", "--name=baz"]);
        input.bind(new InputDefinition([new OptionDefinition("name", null, OptionMode.VALUE_OPTIONAL | OptionMode.VALUE_IS_ARRAY)]));
        expect(Array.from(input.getOptions().entries())).toEqual([["name", ["foo", "bar", "baz"]]]);

        input = new ArgvInput(["node", "file.js", "--name", "foo", "--name", "bar", "--name", "baz"]);
        input.bind(new InputDefinition([new OptionDefinition("name", null, OptionMode.VALUE_OPTIONAL | OptionMode.VALUE_IS_ARRAY)]));
        expect(Array.from(input.getOptions().entries())).toEqual([["name", ["foo", "bar", "baz"]]]);

        input = new ArgvInput(["node", "file.js", "--name=foo", "--name=bar", "--name="]);
        input.bind(new InputDefinition([new OptionDefinition("name", null, OptionMode.VALUE_OPTIONAL | OptionMode.VALUE_IS_ARRAY)]));
        expect(Array.from(input.getOptions().entries())).toEqual([["name", ["foo", "bar", ""]]]);

        input = new ArgvInput(["node", "file.js", "--name", "foo", "--name", "bar", "--name", "--anotherOption"]);
        input.bind(new InputDefinition([
            new OptionDefinition("name", null, OptionMode.VALUE_OPTIONAL | OptionMode.VALUE_IS_ARRAY),
            new OptionDefinition("anotherOption", null, OptionMode.VALUE_NONE),
        ]));
        expect(Array.from(input.getOptions().entries())).toEqual([
            ["name", ["foo", "bar", null]],
            ["anotherOption", true],
        ]);
    });

    it("should parse negative number after double dash", () => {
        let input = new ArgvInput(["node", "file.js", "--", "-1"]);
        input.bind(new InputDefinition([new ArgumentDefinition("number")]));
        expect(Array.from(input.getArguments().entries())).toEqual([["number", "-1"]]);

        input = new ArgvInput(["node", "file.js", "-f", "bar", "--", "-1"]);
        input.bind(new InputDefinition([
            new ArgumentDefinition("number"),
            new OptionDefinition("foo", "f", OptionMode.VALUE_OPTIONAL),
        ]));
        expect(Array.from(input.getOptions().entries())).toEqual([["foo", "bar"]]);
        expect(Array.from(input.getArguments().entries())).toEqual([["number", "-1"]]);
    });

    it("should parse empty string argument", () => {
        const input = new ArgvInput(["node", "file.js", "-f", "bar", ""]);
        input.bind(new InputDefinition([
            new ArgumentDefinition("empty"),
            new OptionDefinition("foo", "f", OptionMode.VALUE_OPTIONAL),
        ]));
        expect(Array.from(input.getArguments().entries())).toEqual([["empty", ""]]);
    });

    it("should get first argument", () => {
        let input = new ArgvInput(["node", "file.js", "-fbbar"]);
        expect(input.getFirstArgument()).toBeNull();

        input = new ArgvInput(["node", "file.js", "-fbbar", "foo"]);
        expect(input.getFirstArgument()).toEqual("foo");

        input = new ArgvInput(["node", "file.js", "--foo", "fooval", "bar"]);
        input.bind(new InputDefinition([
            new OptionDefinition("foo", "f", OptionMode.VALUE_OPTIONAL),
            new ArgumentDefinition("arg"),
        ]));
        expect(input.getFirstArgument()).toEqual("bar");

        input = new ArgvInput(["node", "file.js", "-bf", "fooval", "argval"]);
        input.bind(new InputDefinition([
            new OptionDefinition("bar", "b", OptionMode.VALUE_NONE),
            new OptionDefinition("foo", "f", OptionMode.VALUE_OPTIONAL),
            new ArgumentDefinition("arg"),
        ]));
        expect(input.getFirstArgument()).toEqual("argval");
    });

    it("should has parameter option", () => {
        let input = new ArgvInput(["node", "file.js", "-f", "foo"]);
        expect(input.hasParameterOption("-f")).toBeTruthy();

        input = new ArgvInput(["node", "file.js", "-etest"]);
        expect(input.hasParameterOption("-e")).toBeTruthy();
        expect(input.hasParameterOption("-s")).toBeFalsy();

        input = new ArgvInput(["node", "file.js", "--foo", "foo"]);
        expect(input.hasParameterOption("--foo")).toBeTruthy();

        input = new ArgvInput(["node", "file.js", "foo"]);
        expect(input.hasParameterOption("--foo")).toBeFalsy();

        input = new ArgvInput(["node", "file.js", "--foo=bar"]);
        expect(input.hasParameterOption("--foo")).toBeTruthy();
    });

    it("should has parameter option, only options", () => {
        let input = new ArgvInput(["node", "file.js", "-f", "foo"]);
        expect(input.hasParameterOption("-f", true)).toBeTruthy();

        input = new ArgvInput(["node", "file.js", "--foo", "--", "foo"]);
        expect(input.hasParameterOption("--foo", true)).toBeTruthy();

        input = new ArgvInput(["node", "file.js", "--foo=bar", "foo"]);
        expect(input.hasParameterOption("--foo", true)).toBeTruthy();

        input = new ArgvInput(["node", "file.js", "--", "--foo"]);
        expect(input.hasParameterOption("--foo", true)).toBeFalsy();
    });

    it("should work on edge cases and limitations", () => {
        let input = new ArgvInput(["node", "file.js", "-fh"]);

        // hasParameterOption does not know if the previous short option, -f,
        // takes a value or not. If -f takes a value, then -fh does NOT include
        // -h; Otherwise it does. Since we do not know which short options take
        // values, hasParameterOption does not support this use-case.
        expect(input.hasParameterOption("-h")).toBeFalsy();

        // hasParameterOption does detect that `-fh` contains `-f`, since
        // `-f` is the first short option in the set.
        expect(input.hasParameterOption("-f")).toBeTruthy();

        // The test below happens to pass, although it might make more sense
        // to disallow it, and require the use of
        // input.hasParameterOption("-f") && input.hasParameterOption("-h")
        // instead.
        expect(input.hasParameterOption("-fh")).toBeTruthy();

        // In theory, if -fh is supported, then -hf should also work.
        // However, this is not supported.
        expect(input.hasParameterOption("-hf")).toBeFalsy();

        input = new ArgvInput(["node", "file.js", "-f", "-h"]);
        // If hasParameterOption('-fh') is supported for 'node file.js -fh', then
        // one might also expect that it should also be supported for
        // 'node file.js -f -h'. However, this is not supported.
        expect(input.hasParameterOption("-fh")).toBeFalsy();
    });

    it("should not warn on invalid parameter option", () => {
        const input = new ArgvInput(["node", "file.js", "-edev"]);

        expect(input.hasParameterOption(["-e", ""])).toBeTruthy();
        // No warning thrown
        expect(input.hasParameterOption(["-m", ""])).toBeFalsy();

        expect(input.getParameterOption(["-e", ""])).toBe("dev");
        // No warning thrown
        expect(input.getParameterOption(["-m", ""])).toBeFalsy();
    });

    it("should convert corrent to string", () => {
        let input = new ArgvInput(["node", "file.js", "-f", "foo"]);
        expect(input.toString()).toBe("-f foo");

        input = new ArgvInput(["node", "file.js", "-f", "--bar=foo", "a b c d", "A\nB'C"]);
        expect(input.toString()).toBe("-f --bar=foo " + ShellUtilities.escapeShellArgument("a b c d") + " " + ShellUtilities.escapeShellArgument("A\nB'C"));
    });

    each([
        [["node", "bin/console", "foo:bar"], "-e", "default", false, "default"],
        [["node", "bin/console", "foo:bar", "-e", "dev"], "-e", "default", false, "dev"],
        [["node", "bin/console", "foo:bar", "--env=dev"], "--env", "default", false, "dev"],
        [["node", "bin/console", "foo:bar", "-e", "dev"], ["-e", "--env"], "default", false, "dev"],
        [["node", "bin/console", "foo:bar", "--env=dev"], ["-e", "--env"], "default", false, "dev"],
        [["node", "bin/console", "foo:bar", "--env=dev", "--en=1"], ["--en"], "default", false, "1"],
        [["node", "bin/console", "foo:bar", "--env=dev", "", "--en=1"], ["--en"], "default", false, "1"],
        [["node", "bin/console", "foo:bar", "--env", "val"], "--env", "default", false, "val"],
        [["node", "bin/console", "foo:bar", "--env", "val", "--dummy"], "--env", "default", false, "val"],
        [["node", "bin/console", "foo:bar", "--", "--env=dev"], "--env", "default", false, "dev"],
        [["node", "bin/console", "foo:bar", "--", "--env=dev"], "--env", "default", true, "default"],
    ])
        // eslint-disable-next-line max-params
        .it("should get parameter option quel sign", (argv, key, defaultValue, onlyParams, expected) => {
            const input = new ArgvInput(argv);
            expect(input.getParameterOption(key, defaultValue, onlyParams)).toBe(expected);
        });

    it("should parse single dash as argument", () => {
        const input = new ArgvInput(["node", "file.js", "-"]);
        input.bind(new InputDefinition([new ArgumentDefinition("file")]));
        expect(Array.from(input.getArguments())).toEqual([["file", "-"]]);
    });

    it("should parse option with value optional given empty and required argument", () => {
        let input = new ArgvInput(["node", "file.js", "--foo=", "bar"]);
        input.bind(new InputDefinition([
            new OptionDefinition("foo", "f", OptionMode.VALUE_OPTIONAL),
            new ArgumentDefinition("name", ArgumentMode.REQUIRED),
        ]));
        expect(Array.from(input.getOptions())).toEqual([["foo", ""]]);
        expect(Array.from(input.getArguments())).toEqual([["name", "bar"]]);

        input = new ArgvInput(["node", "file.js", "--foo=0", "bar"]);
        input.bind(new InputDefinition([
            new OptionDefinition("foo", "f", OptionMode.VALUE_OPTIONAL),
            new ArgumentDefinition("name", ArgumentMode.REQUIRED),
        ]));
        expect(Array.from(input.getOptions())).toEqual([["foo", "0"]]);
        expect(Array.from(input.getArguments())).toEqual([["name", "bar"]]);
    });

    it("should parse option with value optional given empty and optional argument", () => {
        let input = new ArgvInput(["node", "file.js", "--foo=", "bar"]);
        input.bind(new InputDefinition([
            new OptionDefinition("foo", "f", OptionMode.VALUE_OPTIONAL),
            new ArgumentDefinition("name", ArgumentMode.OPTIONAL),
        ]));
        expect(Array.from(input.getOptions())).toEqual([["foo", ""]]);
        expect(Array.from(input.getArguments())).toEqual([["name", "bar"]]);

        input = new ArgvInput(["node", "file.js", "--foo=0", "bar"]);
        input.bind(new InputDefinition([
            new OptionDefinition("foo", "f", OptionMode.VALUE_OPTIONAL),
            new ArgumentDefinition("name", ArgumentMode.OPTIONAL),
        ]));
        expect(Array.from(input.getOptions())).toEqual([["foo", "0"]]);
        expect(Array.from(input.getArguments())).toEqual([["name", "bar"]]);
    });

});
