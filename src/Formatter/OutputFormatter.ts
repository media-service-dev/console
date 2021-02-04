/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { ArgumentException } from "../Exception/ArgumentException";
import { ExpressionUtilities } from "../Utilities/ExpressionUtilities";
import { TextUtilities } from "../Utilities/TextUtilities";
import { ColorMapping } from "./ColorMapping";
import { OptionMapping } from "./OptionMapping";
import { OutputFormatterStyle } from "./OutputFormatterStyle";
import { OutputFormatterStyleInterface } from "./OutputFormatterStyleInterface";
import { OutputFormatterStyleStack } from "./OutputFormatterStyleStack";
import { WrappableOutputFormatterInterface } from "./WrappableOutputFormatterInterface";

export class OutputFormatter implements WrappableOutputFormatterInterface {

    private decorated: boolean;

    private styles: Map<string, OutputFormatterStyleInterface> = new Map<string, OutputFormatterStyleInterface>();

    private styleStack: OutputFormatterStyleStack;

    public constructor(decorated: boolean = false, styles: Map<string, OutputFormatterStyleInterface> | null = null) {
        this.decorated = decorated;

        this.setStyle("error", new OutputFormatterStyle("white", "red"));
        this.setStyle("info", new OutputFormatterStyle("green"));
        this.setStyle("comment", new OutputFormatterStyle("yellow"));
        this.setStyle("question", new OutputFormatterStyle("black", "cyan"));

        if (null !== styles) {
            for (const [name, style] of styles.entries()) {
                this.setStyle(name, style);
            }
        }

        this.styleStack = new OutputFormatterStyleStack();
    }

    public static escapeBackslashes(text: string): string {
        text = text.replace(/([^\\]?)</g, "$1\\<");

        return this.escapeTrailingBackslash(text);
    }

    public static escapeTrailingBackslash(text: string): string {
        if ("\\" === text.substr(-1)) {
            const { length } = text;

            text = TextUtilities.trimRight(text, "\\\\");
            text = text.replace(/\0/g, "");
            text += "\0".repeat(length - text.length);
        }

        return text;
    }

    private static isCharacterEscaped(message: string, position: number) {
        return 0 !== position && "\\" === message.charAt(position - 1);
    }

    public format(message: string): string {
        return this.formatAndWrap(message, 0);
    }

    public formatAndWrap(message: string, width: number): string {
        let offset: number = 0;
        let output: string = "";
        const tagExpression = "[a-z][^<>]*";
        const currentLineLength = { length: 0 };
        const styleTagExpression = new RegExp(`<((${tagExpression})|/(${tagExpression})?)>`, "gi");
        const matches = ExpressionUtilities.matchAll(message, styleTagExpression);

        for (const match of matches) {
            const position: number = match.index ?? -1;
            const [text, startTag, firstEnd, secondEnd] = match;
            const open = startTag.charAt(0) !== "/";
            const tag = firstEnd ?? secondEnd;

            if (OutputFormatter.isCharacterEscaped(message, position)) {
                continue;
            }

            output += this.applyCurrentStyle(message.substr(offset, position - offset), output, width, currentLineLength);
            offset = position + text.length;

            if (!open && !tag) {
                this.styleStack.pop();
                continue;
            }

            const style = this.createStyleFromString(tag);

            if (null === style) {
                output += this.applyCurrentStyle(text, output, width, currentLineLength);
            } else if (open) {
                this.styleStack.push(style);
            } else {
                this.styleStack.popUntil(style);
            }

        }

        output += this.applyCurrentStyle(message.substr(offset), output, width, currentLineLength);

        if (-1 !== output.indexOf("\0")) {
            return output
                .replace(/\\</g, "<")
                .replace(/\0/g, "\\");
        }

        return output.replace(/\\</g, "<");
    }

    public getStyle(name: string): OutputFormatterStyleInterface {
        if (!this.hasStyle(name)) {
            throw new ArgumentException(`Undefined style: "${name}"`);
        }

        return this.styles.get(name.toLowerCase()) as OutputFormatterStyleInterface;
    }

    public hasStyle(name: string): boolean {
        return this.styles.has(name.toLowerCase());
    }

    public isDecorated(): boolean {
        return this.decorated;
    }

    public setDecorated(decorated: boolean): void {
        this.decorated = decorated;
    }

    public setStyle(name: string, style: OutputFormatterStyleInterface): void {
        this.styles.set(name.toLowerCase(), style);
    }

    private createStyleFromString(text: string): OutputFormatterStyleInterface | null {
        if (this.styles.has(text)) {
            return this.styles.get(text) ?? null;
        }

        const matches = Array.from(ExpressionUtilities.matchAll(text, /([^=]+)=([^;]+)(;|$)/g));

        if (!matches.length) {
            return null;
        }

        const style = new OutputFormatterStyle();

        for (const match of matches) {
            const type = match[1].toLowerCase();
            const value = match[2].toLowerCase() as keyof ColorMapping;

            if ("fg" === type) {
                style.setForeground(value);
            } else if ("bg" === type) {
                style.setBackground(value);
            } else if ("options" === type) {
                const options = ExpressionUtilities.matchAll(value, /([^,;]+)/g);

                for (const option of options) {
                    option.shift();
                    for (const item of option) {
                        style.setOption(item as keyof OptionMapping);
                    }
                }
            } else {
                return null;
            }
        }

        return style;
    }

    // eslint-disable-next-line max-params
    private applyCurrentStyle(text: string, current: string, width: number, currentLineLength: { length: number }) {
        if ("" === text) {
            return "";
        }

        if (!width) {
            if (this.isDecorated()) {
                return this.styleStack.peek().apply(text);
            }

            return text;
        }

        if (!currentLineLength.length && "" !== current) {
            text = text.trimLeft();
        }

        let prefix = "";

        if (currentLineLength.length) {
            const i = width - currentLineLength.length;

            prefix = text.substr(0, i) + "\n";
            text = text.substr(i);
        }

        const matches = ExpressionUtilities.matchAll(text, new RegExp("(\\n)$", "g"));

        text = prefix + text.replace(new RegExp(`([^\\n]{${width}}) *`, "g"), "$1\n");
        const items = Array.from(matches);

        text = TextUtilities.trimRight(text, "\n") + ((items[0] ?? [])[1] ?? "");

        if (!currentLineLength.length && "" !== current && "\n" !== current.substr(-1)) {
            text = "\n" + text;
        }

        let lines = text.split("\n");

        for (const line of lines) {
            currentLineLength.length += line.length;
            if (width <= currentLineLength.length) {
                currentLineLength.length = 0;
            }
        }

        if (this.isDecorated()) {
            lines = lines.map(item => this.styleStack.peek().apply(item));
        }

        return lines.join("\n");
    }

}
