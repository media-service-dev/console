/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { ArgumentException } from "../../src/Exception/ArgumentException";
import { OutputFormatterStyle } from "../../src/Formatter/OutputFormatterStyle";

describe("OutputFormatterStyle", () => {

    it("should construct", () => {
        let style = new OutputFormatterStyle("green", "black", ["bold", "underscore"]);

        expect(style.apply("foo")).toBe("\u001b[32;40;1;4mfoo\u001b[39;49;22;24m");

        style = new OutputFormatterStyle("red", null, ["blink"]);
        expect(style.apply("foo")).toBe("\u001b[31;5mfoo\u001b[39;25m");

        style = new OutputFormatterStyle(null, "white");
        expect(style.apply("foo")).toBe("\u001b[47mfoo\u001b[49m");
    });

    it("should apply foreground", () => {
        const style = new OutputFormatterStyle();

        style.setForeground("black");
        expect(style.apply("foo")).toBe("\u001b[30mfoo\u001b[39m");
        style.setForeground("blue");
        expect(style.apply("foo")).toBe("\u001b[34mfoo\u001b[39m");
        style.setForeground("default");
        expect(style.apply("foo")).toBe("\u001b[39mfoo\u001b[39m");

        expect(() => {
            style.setForeground("undefined-color" as any);
        }).toThrowError(ArgumentException);
    });

    it("should apply background", () => {
        const style = new OutputFormatterStyle();

        style.setBackground("black");
        expect(style.apply("foo")).toBe("\u001b[40mfoo\u001b[49m");
        style.setBackground("yellow");
        expect(style.apply("foo")).toBe("\u001b[43mfoo\u001b[49m");
        style.setBackground("default");
        expect(style.apply("foo")).toBe("\u001b[49mfoo\u001b[49m");

        expect(() => {
            style.setBackground("undefined-color" as any);
        }).toThrowError(ArgumentException);
    });

    it("should apply options", () => {
        const style = new OutputFormatterStyle();

        style.setOptions(["reverse", "conceal"]);
        expect(style.apply("foo")).toBe("\u001b[7;8mfoo\u001b[27;28m");

        style.setOption("bold");
        expect(style.apply("foo")).toBe("\u001b[7;8;1mfoo\u001b[27;28;22m");

        style.unsetOption("reverse");
        expect(style.apply("foo")).toBe("\u001b[8;1mfoo\u001b[28;22m");

        style.setOption("bold");
        expect(style.apply("foo")).toBe("\u001b[8;1mfoo\u001b[28;22m");

        style.setOptions(["bold"]);
        expect(style.apply("foo")).toBe("\u001b[1mfoo\u001b[22m");

        expect(() => {
            style.setOption("foo" as any);
        }).toThrowError(ArgumentException);

        expect(() => {
            style.unsetOption("foo" as any);
        }).toThrowError(ArgumentException);
    });

});
