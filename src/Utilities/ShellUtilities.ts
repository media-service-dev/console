/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

/**
 * Utility functions to work with a shell
 */
export class ShellUtilities {

    /**
     * Escapes shell argument, basically wraps it in apostrophe and any unescaped usage of apostrophes.
     *
     * @example
     * ```typescript
     * const result: string = ShellUtilities.escapeShellArgument("Foo bar!");
     * // result will be "'Foo bar!'"
     * ```
     *
     * @param {string} argument
     * @returns {string}
     */
    public static escapeShellArgument(argument: string) {
        let result = "";

        result = argument.replace(/[^\\]'/g, (match) => {
            return `${match.slice(0, 1)}\\'`;
        });

        return `'${result}'`;
    }

    /**
     * Wrapper around the [[escapeShellArgument]].
     * It only escapes the token if the token contains other chars than `[a-zA-Z0-9_-]`.
     *
     * @example
     * ```typescript
     * const result: string = ShellUtilities.escapeToken("Foo bar!");
     * // result will be "'Foo bar!'"
     * ```
     *
     * @example
     * ```typescript
     * const result: string = ShellUtilities.escapeToken("--foo");
     * // result will be "--foo"
     * ```
     *
     * @param {string} token
     * @returns {string}
     */
    public static escapeToken(token: string) {
        if (token.match(/^[\w-]+$/)) {
            return token;
        }
        return this.escapeShellArgument(token);

    }

}
