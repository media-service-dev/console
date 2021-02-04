/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

/**
 * Utility functions to work with strings
 */
export class TextUtilities {

    /**
     * Trim chars from the left of a string.
     *
     * @example
     * ```typescript
     * const result: string = TextUtilities.trimLeft("foo bar", "foo");
     * // result will be " bar";
     * ```
     *
     * @param {string} text
     * @param {string | null} chars
     * @returns {string}
     */
    public static trimLeft(text: string, chars: string = "\\s") {
        const expression = new RegExp("^[" + chars + "]+");

        return text.replace(expression, "");
    }

    /**
     * Trim chars from the right of a string.
     *
     * @example
     * ```typescript
     * const result: string = TextUtilities.trimRight("foo bar", "bar");
     * // result will be "foo ";
     * ```
     *
     * @param {string} text
     * @param {string | null} chars
     * @returns {string}
     */
    public static trimRight(text: string, chars: string = "\\s") {
        const expression = new RegExp("[" + chars + "]+$");

        return text.replace(expression, "");
    }

    /**
     * Trim chars from both sides of a string.
     *
     * @example
     * ```typescript
     * const result: string = TextUtilities.trim("foo bar", "rf");
     * // result will be "oo ba";
     * ```
     *
     * @param {string} text
     * @param {string | null} chars
     * @returns {string}
     */
    public static trim(text: string, chars: string = "\\s") {
        const expression = new RegExp("(^[" + chars + "]+|[" + chars + "]+$)", "g");

        return text.replace(expression, "");
    }

    /**
     * Strips out tags from a string.
     *
     * @example
     * ```typescript
     * const result: string = TextUtilities.stripTags("Foo <comment>Bar</comment>");
     * // result will be "Foo Bar";
     * ```
     *
     * @param {string} text
     * @returns {string}
     */
    public static stripTags(text: string) {
        return text.replace(/<\/?[^>]+(>|$)/g, "");
    }

    // eslint-disable-next-line max-params
    public static wrap(text: string, length: number = 75, newLineChar: string = "\n", cut: boolean = false) {
        let index;
        let cutIndex;
        let line;

        text += "";
        if (length < 1) {
            return text;
        }

        const linesBreakExpression = /\r\n|\n|\r/;
        const firstWhitespaceExpression = /^\S*/;
        const lastCharsExpression = /\S*(\s)?$/;

        const lines = text.split(linesBreakExpression);
        const lineLength = lines.length;
        let match;

        // for each line of text
        for (index = 0; index < lineLength; lines[index++] += line) {
            line = lines[index];
            lines[index] = "";

            while (line.length > length) {
                // get slice of length one char above limit
                const slice = line.slice(0, length + 1);

                // remove leading whitespace from rest of line to parse
                let ltrim = 0;

                // remove trailing whitespace from new line content
                let rtrim = 0;

                match = slice.match(lastCharsExpression);

                if (match) {
                    // if the slice ends with whitespace
                    if (match[1]) {
                        // then perfect moment to cut the line
                        cutIndex = length;
                        ltrim = 1;
                    } else {
                        // otherwise cut at previous whitespace
                        cutIndex = slice.length - match[0].length;

                        if (cutIndex) {
                            rtrim = 1;
                        }

                        // but if there is no previous whitespace
                        // and cut is forced
                        // cut just at the defined limit
                        if (!cutIndex && cut && length) {
                            cutIndex = length;
                        }

                        // if cut wasn't forced
                        // cut at next possible whitespace after the limit
                        if (!cutIndex) {
                            const [charsUntilNextWhitespace] = (line.slice(length).match(firstWhitespaceExpression) || [""]);

                            cutIndex = slice.length + charsUntilNextWhitespace.length;
                        }
                    }

                    lines[index] += line.slice(0, cutIndex - rtrim);
                    line = line.slice(cutIndex + ltrim);
                    lines[index] += line.length ? newLineChar : "";
                }
            }
        }

        return lines.join("\n");
    }

}
