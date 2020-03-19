/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { ArgumentException } from "../Exception/ArgumentException";
import { LogicException } from "../Exception/LogicException";
import { OptionMode } from "./OptionMode";
import { OptionValue } from "./OptionValue";

export class OptionDefinition {

    private readonly name: string;

    private readonly shortcut: string | null;

    private readonly mode: OptionMode;

    private defaultValue: OptionValue;

    private readonly description: string;

    // eslint-disable-next-line max-params
    public constructor(name: string, shortcut: string | string[] | null = null, mode: OptionMode | null = null, description: string = "", defaultValue: OptionValue | null = null) {
        if (name.indexOf("--") === 0) {
            name = name.slice(2);
        }

        if (name.length === 0) {
            throw new ArgumentException("An option name cannot be empty.");
        }

        if (shortcut) {
            if (Array.isArray(shortcut)) {
                shortcut = shortcut.join("|");
            }

            const shortcuts = shortcut.split("|")
                .map(item => {
                    if (item.indexOf("-") === 0) {
                        return item.slice(1);
                    }
                    return item;
                })
                .filter(item => item.length);

            shortcut = shortcuts.join("|");

            if (shortcut.length === 0) {
                throw new ArgumentException("An option shortcut cannot be empty.");
            }
        }

        if (null === mode) {
            mode = OptionMode.VALUE_NONE;
        } else if (mode > 15 || mode < 1) {
            throw new ArgumentException(`Option mode "${mode}" is not valid.`);
        }

        this.name = name;
        this.shortcut = shortcut;
        this.mode = mode;
        this.description = description;

        if (this.isArray() && !this.acceptValue()) {
            throw new ArgumentException("Impossible to have an option mode VALUE_IS_ARRAY if the option does not accept a value.");
        }

        this.setDefault(defaultValue);
    }

    public getName(): string {
        return this.name;
    }

    public getShortcut(): string | null {
        return this.shortcut;
    }

    public isValueRequired() {
        return OptionMode.VALUE_REQUIRED === (OptionMode.VALUE_REQUIRED & this.mode);
    }

    public isValueOptional() {
        return OptionMode.VALUE_OPTIONAL === (OptionMode.VALUE_OPTIONAL & this.mode);
    }

    public isArray(): boolean {
        return OptionMode.VALUE_IS_ARRAY === (OptionMode.VALUE_IS_ARRAY & this.mode);
    }

    public acceptValue(): boolean {
        return this.isValueRequired() || this.isValueOptional();
    }

    public setDefault(defaultValue: OptionValue | null = null) {
        if (OptionMode.VALUE_NONE === (OptionMode.VALUE_NONE & this.mode) && null !== defaultValue) {
            throw new LogicException("Cannot set a default value when using OptionMode.VALUE_NONE mode.");
        }

        if (this.isArray()) {
            if (null === defaultValue) {
                defaultValue = [];
            } else if (!Array.isArray(defaultValue)) {
                throw new LogicException("A default value for an array option must be an array.");
            }
        }

        this.defaultValue = this.acceptValue()
            ? defaultValue
            : false;
    }

    public getDefault(): OptionValue {
        return this.defaultValue;
    }

    public getDescription(): string {
        return this.description;
    }

    public equals(optionDefinition: OptionDefinition) {
        return optionDefinition.getName() === this.getName()
            && optionDefinition.getShortcut() === this.getShortcut()
            && optionDefinition.getDefault() === this.getDefault()
            && optionDefinition.isArray() === this.isArray()
            && optionDefinition.isValueRequired() === this.isValueRequired()
            && optionDefinition.isValueOptional() === this.isValueOptional();
    }

}
