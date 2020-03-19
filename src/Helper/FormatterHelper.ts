/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { OutputFormatter } from "../Formatter/OutputFormatter";
import { AbstractHelper } from "./AbstractHelper";

export class FormatterHelper extends AbstractHelper {

    public formatSection(section: string, message: string, style: string = "info") {
        return `<${style}>[${section}]</${style}> ${message}`;
    }

    public formatBlock(messages: string | string[], style: string, large: boolean = false) {
        if (!Array.isArray(messages)) {
            messages = [messages];
        }

        let length = 0;
        const lines: string[] = [];

        for (let message of messages) {
            message = OutputFormatter.escapeBackslashes(message);
            lines.push(large
                ? `  ${message}  `
                : ` ${message} `);
            length = Math.max(message.length + (large
                ? 4
                : 2), length);
        }

        messages = large
            ? [" ".repeat(length)]
            : [];
        for (const line of lines) {
            messages.push(`${line}${" ".repeat(length - line.length)}`);
        }

        if (large) {
            messages.push(" ".repeat(length));
        }

        messages = messages.map(message => `<${style}>${message}</${style}>`);

        return messages.join("\n");
    }

    public truncate(message: string, length: number, suffix: string = "...") {
        const computedLength = length - suffix.length;

        if (computedLength > message.length) {
            return message;
        }

        return message.slice(0, length) + suffix;
    }

    public getName(): string {
        return "formatter";
    }

}
