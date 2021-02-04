/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import each from "jest-each";
import { OutputFormatter } from "../../src/Formatter/OutputFormatter";
import { OutputFormatterStyle } from "../../src/Formatter/OutputFormatterStyle";

describe("OutputFormatter", () => {

    it("should handle empty tag", () => {
        const formatter = new OutputFormatter(true);
        const result = formatter.format("foo<>bar");
        expect(result).toBe("foo<>bar");
    });

    it("should do lower greater char escaping", () => {
        const formatter = new OutputFormatter(true);

        expect(formatter.format("foo\\<bar")).toBe("foo<bar");
        expect(formatter.format("foo << bar")).toBe("foo << bar");
        expect(formatter.format("foo << bar \\")).toBe("foo << bar \\");
        const value = formatter.format("foo << <info>bar \\ baz</info> \\");
        expect(value).toBe("foo << \u001b[32mbar \\ baz\u001b[39m \\");
        expect(formatter.format("\\<info>some info\\</info>")).toBe("<info>some info</info>");
        expect(OutputFormatter.escapeBackslashes("<info>some info</info>")).toBe("\\<info>some info\\</info>");
    });

    it("should apply bundles styles", () => {
        const formatter = new OutputFormatter(true);

        expect(formatter.hasStyle("error")).toBeTruthy();
        expect(formatter.hasStyle("info")).toBeTruthy();
        expect(formatter.hasStyle("comment")).toBeTruthy();
        expect(formatter.hasStyle("question")).toBeTruthy();

        expect(formatter.format("<error>some error</error>")).toBe("\u001b[37;41msome error\u001b[39;49m");
        expect(formatter.format("<info>some info</info>")).toBe("\u001b[32msome info\u001b[39m");
        expect(formatter.format("<comment>some comment</comment>")).toBe("\u001b[33msome comment\u001b[39m");
        expect(formatter.format("<question>some question</question>")).toBe("\u001b[30;46msome question\u001b[39;49m");
    });

    it("should apply nested styles", () => {
        const formatter = new OutputFormatter(true);

        expect(formatter.format("<error>some <info>some info</info> error</error>")).toBe("\u001b[37;41msome \u001b[39;49m\u001b[32msome info\u001b[39m\u001b[37;41m error\u001b[39;49m");
    });

    it("should apply adjacent styles", () => {
        const formatter = new OutputFormatter(true);

        expect(formatter.format("<error>some error</error><info>some info</info>")).toBe("\u001b[37;41msome error\u001b[39;49m\u001b[32msome info\u001b[39m");
    });

    it("should not match greedy", () => {
        const formatter = new OutputFormatter(true);

        expect(formatter.format("(<info>>=2.0,<2.3</info>)")).toBe("(\u001b[32m>=2.0,<2.3\u001b[39m)");
    });

    it("should escape styles", () => {
        const formatter = new OutputFormatter(true);

        expect(formatter.format("(<info>" + OutputFormatter.escapeBackslashes("z>=2.0,<\\<<a2.3\\") + "</info>)")).toBe("(\u001b[32mz>=2.0,<<<a2.3\\\u001b[39m)");
        expect(formatter.format("<info>" + OutputFormatter.escapeBackslashes("<error>some error</error>") + "</info>")).toBe("\u001b[32m<error>some error</error>\u001b[39m");
    });

    it("should apply deep nested styles", () => {
        const formatter = new OutputFormatter(true);

        expect(formatter.format("<error>error<info>info<comment>comment</info>error</error>")).toBe("\u001b[37;41merror\u001b[39;49m\u001b[32minfo\u001b[39m\u001b[33mcomment\u001b[39m\u001b[37;41merror\u001b[39;49m");
    });

    it("should apply added style", () => {
        const formatter = new OutputFormatter(true);

        const style = new OutputFormatterStyle("blue", "white");
        formatter.setStyle("test", style);

        expect(formatter.getStyle("test")).toBe(style);
        expect(formatter.getStyle("info")).not.toBe(style);

        const secondStyle = new OutputFormatterStyle("blue", "white");
        formatter.setStyle("b", secondStyle);

        const result = formatter.format("<test>some <b>custom</b> msg</test>");
        expect(result).toBe("\u001b[34;47msome \u001b[39;49m\u001b[34;47mcustom\u001b[39;49m\u001b[34;47m msg\u001b[39;49m");
    });

    it("should apply redefined style", () => {
        const formatter = new OutputFormatter(true);

        const style = new OutputFormatterStyle("blue", "white");
        formatter.setStyle("info", style);

        expect(formatter.format("<info>some custom msg</info>")).toBe("\u001b[34;47msome custom msg\u001b[39;49m");
    });

    it("should apply inline styles", () => {
        const formatter = new OutputFormatter(true);

        expect(formatter.format("<fg=blue;bg=red>some text</>")).toBe("\u001b[34;41msome text\u001b[39;49m");
        expect(formatter.format("<fg=blue;bg=red>some text</fg=blue;bg=red>")).toBe("\u001b[34;41msome text\u001b[39;49m");
    });

    each([
        ["<unknown=_unknown_>"],
        ["<unknown=_unknown_;a=1;b>"],
        ["<fg=green;>", "\u001b[32m[test]\u001b[39m", "[test]"],
        ["<fg=green;bg=blue;>", "\u001b[32;44ma\u001b[39;49m", "a"],
        ["<fg=green;options=bold>", "\u001b[32;1mb\u001b[39;22m", "b"],
        ["<fg=green;options=reverse;>", "\u001b[32;7m<a>\u001b[39;27m", "<a>"],
        ["<fg=green;options=bold,underscore>", "\u001b[32;1;4mz\u001b[39;22;24m", "z"],
        ["<fg=green;options=bold,underscore,reverse;>", "\u001b[32;1;4;7md\u001b[39;22;24;27m", "d"],
    ])
        .it("should apply inline style options", (tag: string, expected: string | null = null, input: string | null = null) => {
            expected = expected ?? null;
            input = input ?? null;
            const formatter = new OutputFormatter(true);

            const styleString = tag.slice(1, -1);
            const result = (formatter as any).createStyleFromString(styleString);
            if (null === expected) {
                expect(result).toBeNull();
                expected = tag + input + "</" + styleString + ">";
                expect(formatter.format(expected)).toBe(expected);
            } else {
                expect(result).toBeInstanceOf(OutputFormatterStyle);
                expect(formatter.format(tag + input + "</>")).toBe(expected);
                expect(formatter.format(tag + input + "</" + styleString + ">")).toBe(expected);
            }
        });

    it("should handle non style tag", () => {
        const formatter = new OutputFormatter(true);

        const expected = "\u001b[32msome \u001b[39m\u001b[32m<tag>\u001b[39m\u001b[32m \u001b[39m\u001b[32m<setting=value>\u001b[39m\u001b[32m styled \u001b[39m\u001b[32m<p>\u001b[39m\u001b[32msingle-char tag\u001b[39m\u001b[32m</p>\u001b[39m";

        expect(formatter.format("<info>some <tag> <setting=value> styled <p>single-char tag</p></info>")).toBe(expected);
    });

    it("should work with long string", () => {
        const formatter = new OutputFormatter(true);

        const long = "\\".repeat(14000);

        expect(formatter.format("<error>some error</error>" + long)).toBe("\u001b[37;41msome error\u001b[39;49m" + long);
    });

    each([
        ["<error>some error</error>", "some error", "\u001b[37;41msome error\u001b[39;49m"],
        ["<info>some info</info>", "some info", "\u001b[32msome info\u001b[39m"],
        ["<comment>some comment</comment>", "some comment", "\u001b[33msome comment\u001b[39m"],
        ["<question>some question</question>", "some question", "\u001b[30;46msome question\u001b[39;49m"],
        [
            "<fg=red>some text with inline style</>",
            "some text with inline style",
            "\u001b[31msome text with inline style\u001b[39m",
        ],
    ])
        .it("should not decorated formatter", (input: string, expectedNonDecoratedOutput: string, expectedDecoratedOutput: string) => {
            expect(new OutputFormatter(true).format(input)).toBe(expectedDecoratedOutput);
            expect(new OutputFormatter(false).format(input)).toBe(expectedNonDecoratedOutput);
        });

    it("should work with line breaks in text", () => {
        const formatter = new OutputFormatter(true);

        expect(formatter.format(`<info>
some text</info>`)).toBe(`\u001b[32m
some text\u001b[39m`);

        expect(formatter.format(`<info>some text
</info>`)).toBe(`\u001b[32msome text
\u001b[39m`);

        expect(formatter.format(`<info>
some text
</info>`)).toBe(`\u001b[32m
some text
\u001b[39m`);

        expect(formatter.format(`<info>
some text
more text
</info>`)).toBe(`\u001b[32m
some text
more text
\u001b[39m`);
    });

    it("should format and wrap", () => {
        let formatter = new OutputFormatter(true);

        expect(formatter.formatAndWrap("foo<error>bar</error> baz", 2)).toBe("fo\no\u001b[37;41mb\u001b[39;49m\n\u001b[37;41mar\u001b[39;49m\nba\nz");
        expect(formatter.formatAndWrap("pre <error>foo bar baz</error> post", 2)).toBe("pr\ne \u001b[37;41m\u001b[39;49m\n\u001b[37;41mfo\u001b[39;49m\n\u001b[37;41mo \u001b[39;49m\n\u001b[37;41mba\u001b[39;49m\n\u001b[37;41mr \u001b[39;49m\n\u001b[37;41mba\u001b[39;49m\n\u001b[37;41mz\u001b[39;49m \npo\nst");
        expect(formatter.formatAndWrap("pre <error>foo bar baz</error> post", 3)).toBe("pre\u001b[37;41m\u001b[39;49m\n\u001b[37;41mfoo\u001b[39;49m\n\u001b[37;41mbar\u001b[39;49m\n\u001b[37;41mbaz\u001b[39;49m\npos\nt");
        expect(formatter.formatAndWrap("pre <error>foo bar baz</error> post", 4)).toBe("pre \u001b[37;41m\u001b[39;49m\n\u001b[37;41mfoo \u001b[39;49m\n\u001b[37;41mbar \u001b[39;49m\n\u001b[37;41mbaz\u001b[39;49m \npost");
        expect(formatter.formatAndWrap("pre <error>foo bar baz</error> post", 5)).toBe("pre \u001b[37;41mf\u001b[39;49m\n\u001b[37;41moo ba\u001b[39;49m\n\u001b[37;41mr baz\u001b[39;49m\npost");
        expect(formatter.formatAndWrap("Lorem <error>ipsum</error> dolor <info>sit</info> amet", 4)).toBe("Lore\nm \u001b[37;41mip\u001b[39;49m\n\u001b[37;41msum\u001b[39;49m \ndolo\nr \u001b[32msi\u001b[39m\n\u001b[32mt\u001b[39m am\net");
        expect(formatter.formatAndWrap("Lorem <error>ipsum</error> dolor <info>sit</info> amet", 8)).toBe("Lorem \u001b[37;41mip\u001b[39;49m\n\u001b[37;41msum\u001b[39;49m dolo\nr \u001b[32msit\u001b[39m am\net");
        expect(formatter.formatAndWrap("Lorem <error>ipsum</error> dolor <info>sit</info>, <error>amet</error> et <info>laudantium</info> architecto", 18)).toBe("Lorem \u001b[37;41mipsum\u001b[39;49m dolor \u001b[32m\u001b[39m\n\u001b[32msit\u001b[39m, \u001b[37;41mamet\u001b[39;49m et \u001b[32mlauda\u001b[39m\n\u001b[32mntium\u001b[39m architecto");

        formatter = new OutputFormatter();

        expect(formatter.formatAndWrap("foo<error>bar</error> baz", 2)).toBe("fo\nob\nar\nba\nz");
        expect(formatter.formatAndWrap("pre <error>foo bar baz</error> post", 2)).toBe("pr\ne \nfo\no \nba\nr \nba\nz \npo\nst");
        expect(formatter.formatAndWrap("pre <error>foo bar baz</error> post", 3)).toBe("pre\nfoo\nbar\nbaz\npos\nt");
        expect(formatter.formatAndWrap("pre <error>foo bar baz</error> post", 4)).toBe("pre \nfoo \nbar \nbaz \npost");
        expect(formatter.formatAndWrap("pre <error>foo bar baz</error> post", 5)).toBe("pre f\noo ba\nr baz\npost");

    });

});
