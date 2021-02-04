/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { ArgumentException } from "../Exception/ArgumentException";

/**
 * Expression utilities
 */
export class ExpressionUtilities {

    public static matchAll(text: string, expression: RegExp) {
        const matches: RegExpExecArray[] = [];

        if (!expression.global) {
            throw new ArgumentException("Missing regular expression flag \"global\".");
        }

        let currentMatch: RegExpExecArray | null = expression.exec(text);

        while (null !== currentMatch) {
            if (currentMatch.index === expression.lastIndex) {
                expression.lastIndex++;
            }
            matches.push(currentMatch);
            currentMatch = expression.exec(text);
        }

        return matches;
    }

}
