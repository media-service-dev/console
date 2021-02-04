/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { ArgumentException } from "../Exception/ArgumentException";
import { ColorMapping } from "./ColorMapping";
import { OptionMapping } from "./OptionMapping";
import { OutputFormatterStyleInterface } from "./OutputFormatterStyleInterface";
import { Style } from "./Style";

/**
 * @see https://en.wikipedia.org/wiki/ANSI_escape_code#SGR_parameters
 * @type {{defaultForegroundColor: number; defaultBackgroundColor: number}}
 */
const selectGraphicRendition = {
    defaultForegroundColor: 39,
    defaultBackgroundColor: 49,
};

export class OutputFormatterStyle implements OutputFormatterStyleInterface {

    private static availableForegroundColors: ColorMapping = {
        "black": { "set": 30, "unset": selectGraphicRendition.defaultForegroundColor },
        "red": { "set": 31, "unset": selectGraphicRendition.defaultForegroundColor },
        "green": { "set": 32, "unset": selectGraphicRendition.defaultForegroundColor },
        "yellow": { "set": 33, "unset": selectGraphicRendition.defaultForegroundColor },
        "blue": { "set": 34, "unset": selectGraphicRendition.defaultForegroundColor },
        "magenta": { "set": 35, "unset": selectGraphicRendition.defaultForegroundColor },
        "cyan": { "set": 36, "unset": selectGraphicRendition.defaultForegroundColor },
        "white": { "set": 37, "unset": selectGraphicRendition.defaultForegroundColor },
        "default": { "set": 39, "unset": selectGraphicRendition.defaultForegroundColor },
    };

    private static availableBackgroundColors: ColorMapping = {
        "black": { "set": 40, "unset": selectGraphicRendition.defaultBackgroundColor },
        "red": { "set": 41, "unset": selectGraphicRendition.defaultBackgroundColor },
        "green": { "set": 42, "unset": selectGraphicRendition.defaultBackgroundColor },
        "yellow": { "set": 43, "unset": selectGraphicRendition.defaultBackgroundColor },
        "blue": { "set": 44, "unset": selectGraphicRendition.defaultBackgroundColor },
        "magenta": { "set": 45, "unset": selectGraphicRendition.defaultBackgroundColor },
        "cyan": { "set": 46, "unset": selectGraphicRendition.defaultBackgroundColor },
        "white": { "set": 47, "unset": selectGraphicRendition.defaultBackgroundColor },
        "default": { "set": 49, "unset": selectGraphicRendition.defaultBackgroundColor },
    };

    private static availableOptions: OptionMapping = {
        "bold": { "set": 1, "unset": 22 },
        "underscore": { "set": 4, "unset": 24 },
        "blink": { "set": 5, "unset": 25 },
        "reverse": { "set": 7, "unset": 27 },
        "conceal": { "set": 8, "unset": 28 },
    };

    private foreground: Style | null = null;

    private background: Style | null = null;

    private options: Style[] = [];

    public constructor(foreground: keyof ColorMapping | null = null, background: keyof ColorMapping | null = null, options: (keyof OptionMapping)[] = []) {
        if (null !== foreground) {
            this.setForeground(foreground);
        }

        if (null !== background) {
            this.setBackground(background);
        }

        if (options.length) {
            this.setOptions(options);
        }
    }

    public apply(text: string): string {
        const setCodes = [];
        const unsetCodes = [];

        if (null !== this.foreground) {
            setCodes.push(this.foreground.set);
            unsetCodes.push(this.foreground.unset);
        }

        if (null !== this.background) {
            setCodes.push(this.background.set);
            unsetCodes.push(this.background.unset);
        }

        for (const option of this.options) {
            setCodes.push(option.set);
            unsetCodes.push(option.unset);
        }

        if (0 === setCodes.length) {
            return text;
        }

        return `\u001b[${setCodes.join(";")}m${text}\u001b[${unsetCodes.join(";")}m`;
    }

    public setBackground(color: keyof ColorMapping | null = null): void {
        if (null === color) {
            this.background = null;
            return;
        }

        if (!(color in OutputFormatterStyle.availableBackgroundColors)) {
            throw new ArgumentException(`Invalid background color specified: "${color}". Expected one of (${Object.keys(OutputFormatterStyle.availableBackgroundColors).join(", ")})`);
        }

        this.background = OutputFormatterStyle.availableBackgroundColors[color];
    }

    public setForeground(color: keyof ColorMapping | null = null): void {
        if (null === color) {
            this.foreground = null;
            return;
        }

        if (!(color in OutputFormatterStyle.availableForegroundColors)) {
            throw new ArgumentException(`Invalid foreground color specified: "${color}". Expected one of (${Object.keys(OutputFormatterStyle.availableForegroundColors).join(", ")})`);
        }

        this.foreground = OutputFormatterStyle.availableForegroundColors[color];
    }

    public setOption(option: keyof OptionMapping): void {
        if (!(option in OutputFormatterStyle.availableOptions)) {
            throw new ArgumentException(`Invalid option specified: "${option}". Expected one of (${Object.keys(OutputFormatterStyle.availableOptions).join(", ")})`);
        }

        if (this.options.indexOf(OutputFormatterStyle.availableOptions[option]) === -1) {
            this.options.push(OutputFormatterStyle.availableOptions[option]);
        }
    }

    public setOptions(options: (keyof OptionMapping)[]): void {
        this.options = [];

        for (const option of options) {
            this.setOption(option);
        }
    }

    public unsetOption(option: keyof OptionMapping): void {
        if (!(option in OutputFormatterStyle.availableOptions)) {
            throw new ArgumentException(`Invalid option specified: "${option}". Expected one of (${Object.keys(OutputFormatterStyle.availableOptions).join(", ")})`);
        }

        const index = this.options.indexOf(OutputFormatterStyle.availableOptions[option]);
        if (index !== -1) {
            this.options.splice(index, 1);
        }
    }

}
