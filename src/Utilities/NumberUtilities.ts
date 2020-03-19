/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

/**
 * Utility functions to work with numbers
 */
export class NumberUtilities {

    /**
     * Strictly checks if the value in a string is a number.
     *
     * @example
     * ```typescript
     * const isANumber: boolean = NumberUtilities.isIntStrict("100");
     * // Output will be true
     * ```
     *
     * @example
     * ```typescript
     * const isANumber: boolean = NumberUtilities.isIntStrict("A100");
     * // Output will be false
     * ```
     *
     * @param {string | number} value
     * @returns {value is number}
     */
    public static isIntStrict(value: string | number): value is number {
        const parsed = this.parseIntStrict(value);

        return !isNaN(parsed);
    }

    /**
     * Strictly parses the number in a string.
     * If the value is not a number the function will return `NaN`.
     *
     * @example
     * ```typescript
     * const value: number = NumberUtilities.parseIntStrict("100");
     * // output will be 100
     * ```
     *
     * @example
     * ```typescript
     * const value: number = NumberUtilities.parseIntStrict("A100");
     * // output will be NaN
     * ```
     *
     * @param {string | number} value
     * @returns {number}
     */
    public static parseIntStrict(value: string | number): number {
        if (typeof value === "number") {
            return value;
        }

        if (/^[-+]?(\d+|Infinity)$/.test(value)) {
            return Number(value);
        }
        return NaN;

    }

}
