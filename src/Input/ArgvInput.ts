/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { RuntimeException } from "../Exception/RuntimeException";
import { NumberUtilities } from "../Utilities/NumberUtilities";
import { ShellUtilities } from "../Utilities/ShellUtilities";
import { AbstractInput } from "./AbstractInput";
import { ArgumentValue } from "./ArgumentValue";
import { InputArguments } from "./InputArguments";
import { InputDefinition } from "./InputDefinition";
import { InputOptions } from "./InputOptions";
import { OptionValue } from "./OptionValue";

export class ArgvInput<Arguments extends InputArguments = {}, Options extends InputOptions = {}> extends AbstractInput<Arguments, Options> {

    protected tokens: string[];

    protected parsed!: string[];

    public constructor(parameters: string[] | null = null, definition: InputDefinition | null = null) {
        super();

        if (null === parameters) {
            parameters = process.argv;
        }

        this.tokens = parameters.slice(2);

        this.boot(definition);
    }

    public hasParameterOption(values: string[] | string, onlyParams: boolean = false): boolean {
        if (!Array.isArray(values)) {
            values = [values];
        }

        for (const token of this.tokens) {
            if (onlyParams && "--" === token) {
                return false;
            }

            for (const value of values) {
                // Options with values:
                //   For long options, test for '--option=' at beginning
                //   For short options, test for '-o' at beginning
                const leading = 0 === value.indexOf("--")
                    ? value + "="
                    : value;

                if (token === value || "" !== leading && 0 === token.indexOf(leading)) {
                    return true;
                }
            }
        }

        return false;
    }

    public getFirstArgument(): string | null {
        let isOption: boolean = false;

        for (let i = 0; i < this.tokens.length; ++i) {
            const token = this.tokens[i];

            if (token && "-" === token.charAt(0)) {
                const next = NumberUtilities.parseIntStrict(i) + 1;

                if (-1 !== token.indexOf("=") || typeof this.tokens[next] === "undefined") {
                    continue;
                }
                // If it's a long option, consider that everything after "--" is the option name.
                // Otherwise, use the last char (if it's a short option set, only the last one can take a value with space separator)
                let name = "-" === token.charAt(1)
                    ? token.slice(2)
                    : token.slice(token.length - 1, token.length);

                if (!this.options.has(name) && !this.definition.hasShortcut(name)) {
                    // noop
                } else if ((this.options.has(name) || this.options.has(name = this.definition.shortcutToName(name))) && this.tokens[next] === this.options.get(name)) {
                    isOption = true;
                }
                continue;
            }
            if (isOption) {
                isOption = false;
                continue;
            }

            return token;
        }

        return null;
    }

    public getParameterOption(values: string[] | string, defaultValue: OptionValue = false, onlyParams: boolean = false): OptionValue {
        if (!Array.isArray(values)) {
            values = [values];
        }

        const tokens = [...this.tokens];

        while (0 < tokens.length) {
            const token = tokens.shift() as string;

            if (onlyParams && "--" === token) {
                return defaultValue;
            }
            for (const value of values) {
                if (token === value) {
                    return tokens.shift() as string;
                }
                // Options with values:
                //   For long options, test for '--option=' at beginning
                //   For short options, test for '-o' at beginning
                const leading = 0 === value.indexOf("--")
                    ? value + "="
                    : value;

                if (token === value || "" !== leading && 0 === token.indexOf(leading)) {
                    return token.slice(leading.length);
                }
            }
        }

        return defaultValue;
    }

    public toString(): string {
        const tokens = this.tokens.map((token) => {
            const match = token.match(/^(-[^=]+=)(.+)/);

            if (match) {
                return match[1] + ShellUtilities.escapeToken(match[2]);
            }

            if (token && "-" !== token.charAt(0)) {
                return ShellUtilities.escapeToken(token);
            }

            return token;
        });

        return tokens.join(" ");
    }

    protected parse() {
        let parseOptions = true;

        this.parsed = [...this.tokens];
        let token: string | null = this.parsed.shift() ?? null;

        while (null !== token) {
            if (parseOptions && "" === token) {
                this.parseArgument(token);
            } else if (parseOptions && "--" === token) {
                parseOptions = false;
            } else if (parseOptions && 0 === token.indexOf("--")) {
                this.parseLongOption(token);
            } else if (parseOptions && "-" === token[0] && "-" !== token) {
                this.parseShortOption(token);
            } else {
                this.parseArgument(token);
            }

            token = this.parsed.shift() ?? null;
        }
    }

    private parseArgument(token: string) {
        const length = this.arguments.size;
        const lastIndex = length - 1;

        if (this.definition.hasArgument(length)) { // if input is expecting another argument, add it
            const argument = this.definition.getArgument(length);

            if (argument.isArray()) {
                this.arguments.set(argument.getName(), [token]);
            } else {
                this.arguments.set(argument.getName(), token);
            }
        } else if (this.definition.hasArgument(lastIndex) && this.definition.getArgument(lastIndex).isArray()) { // if last argument isArray(), append token to last argument
            const argument = this.definition.getArgument(lastIndex);
            const value = this.arguments.get(argument.getName()) as ArgumentValue;

            if (Array.isArray(value)) {
                value.push(token);
            }
            this.arguments.set(argument.getName(), value);
        } else { // unexpected argument
            const args = this.definition.getArguments();

            if (args.size) {
                const keys = Array.from(args.keys()).filter(item => item !== "command");

                throw new RuntimeException(`Too many arguments, expected arguments "${keys.join("\" \"")}".`);
            }

            throw new RuntimeException(`No arguments expected, got "${token}".`);
        }
    }

    private parseLongOption(token: string) {
        const name = token.slice(2);

        const position = name.indexOf("=");

        if (-1 !== position) {
            const value = name.slice(position + 1);

            if (0 === value.length) {
                this.parsed.unshift(value);
            }
            this.addLongOption(name.slice(0, position), value);
        } else {
            this.addLongOption(name, null);
        }
    }

    private addLongOption(name: string, value: OptionValue | null) {
        if (!this.definition.hasOption(name)) {
            throw new RuntimeException(`The "--${name}" option does not exist.`);
        }

        const option = this.definition.getOption(name);

        if (null !== value && !option.acceptValue()) {
            throw new RuntimeException(`The "--${name}" option does not accept a value.`);
        }

        if ((value === "" || value === null) && option.acceptValue() && this.parsed.length) {
            // if option accepts an optional or mandatory argument
            // let's see if there is one provided
            const next = this.parsed.shift();

            if (typeof next === "string") {
                if (next.indexOf("-") !== 0 || (next === "" || next === null)) {
                    value = next;
                } else {
                    this.parsed.unshift(next);
                }
            }
        }

        if (null === value) {
            if (option.isValueRequired()) {
                throw new RuntimeException(`The "--${name}" option requires a value.`);
            }

            if (!option.isArray() && !option.isValueOptional()) {
                value = true;
            }
        }

        if (option.isArray()) {
            let item = this.options.get(name);

            if (!item) {
                item = [];
            }
            if (Array.isArray(item)) {
                item.push(value as string);
            }
            this.options.set(name, item);
        } else {
            this.options.set(name, value as OptionValue);
        }
    }

    private parseShortOption(token: string) {
        const name = token.slice(1);

        if (name.length > 1) {
            if (this.definition.hasShortcut(name.charAt(0)) && this.definition.getOptionForShortcut(name.charAt(0)).acceptValue()) {
                // an option with a value (with no space)
                this.addShortOption(name.charAt(0), name.slice(1));
            } else {
                this.parseShortOptionSet(name);
            }
        } else {
            this.addShortOption(name, null);
        }
    }

    private addShortOption(shortcut: string, value: OptionValue | null = null) {
        if (!this.definition.hasShortcut(shortcut)) {
            throw new RuntimeException(`The "-${shortcut}" option does not exist.`);
        }

        this.addLongOption(this.definition.getOptionForShortcut(shortcut).getName(), value);
    }

    private parseShortOptionSet(name: string) {
        const { length } = name;

        for (let i = 0; i < length; ++i) {
            if (!this.definition.hasShortcut(name[i])) {
                throw new RuntimeException(`The "-${name[i]}" option does not exist.`);
            }

            const option = this.definition.getOptionForShortcut(name[i]);

            if (option.acceptValue()) {
                this.addLongOption(option.getName(), i === length - 1
                    ? null
                    : name.slice(i + 1));
                break;
            } else {
                this.addLongOption(option.getName(), null);
            }
        }
    }

}
