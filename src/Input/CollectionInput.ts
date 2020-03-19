/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { HybridCollection } from "../Collection/HybridCollection";
import { HybridCollectionEntriesType } from "../Collection/HybridCollectionEntriesType";
import { HybridCollectionKeyType } from "../Collection/HybridCollectionKeyType";
import { RuntimeException } from "../Exception/RuntimeException";
import { NumberUtilities } from "../Utilities/NumberUtilities";
import { ShellUtilities } from "../Utilities/ShellUtilities";
import { AbstractInput } from "./AbstractInput";
import { ArgumentValue } from "./ArgumentValue";
import { InputArguments } from "./InputArguments";
import { InputDefinition } from "./InputDefinition";
import { InputOptions } from "./InputOptions";
import { OptionValue } from "./OptionValue";

export class CollectionInput<Arguments extends InputArguments = {}, Options extends InputOptions = {}> extends AbstractInput<Arguments, Options> {

    private parameters: HybridCollection<ArgumentValue | OptionValue>;

    public constructor(parameters: HybridCollection<ArgumentValue | OptionValue> | HybridCollectionEntriesType<ArgumentValue | OptionValue>, definition: InputDefinition | null = null) {
        super();
        if (parameters instanceof HybridCollection) {
            this.parameters = parameters;
        } else {
            this.parameters = new HybridCollection<ArgumentValue | OptionValue>(parameters);
        }
        this.boot(definition);
    }

    public getFirstArgument(): string | null {
        for (const [key, value] of this.parameters.entries()) {
            if (key && "-" === key.toString().charAt(0)) {
                continue;
            }

            if (typeof value !== "string") {
                return null;
            }

            return value;
        }

        return null;
    }

    public hasParameterOption(values: string | string[], onlyParams: boolean = false): boolean {
        if (!Array.isArray(values)) {
            values = [values];
        }

        // eslint-disable-next-line prefer-const
        for (let [key, value] of this.parameters.entries()) {
            if (!NumberUtilities.isIntStrict(key)) {
                value = key;
            }

            if (onlyParams && "--" === value) {
                return false;
            }

            if (value && values.indexOf(value.toString()) !== -1) {
                return true;
            }
        }

        return false;
    }

    public getParameterOption(values: string | string[], defaultValue: OptionValue = false, onlyParams: boolean = false): OptionValue {
        if (!Array.isArray(values)) {
            values = [values];
        }

        for (const [key, value] of this.parameters.entries()) {
            if (onlyParams && ("--" === key || (NumberUtilities.isIntStrict(key) && "--" === value))) {
                return defaultValue;
            }

            if (NumberUtilities.isIntStrict(key)) {
                if (value && values.indexOf(value.toString()) !== -1) {
                    return true;
                }
            } else if (values.indexOf(key) !== -1) {
                return value;
            }
        }

        return defaultValue;
    }

    public toString(): string {
        const params: string[] = [];

        for (const [key, value] of this.parameters.entries()) {
            if (key && "-" === key.toString().charAt(0)) {
                if (Array.isArray(value)) {
                    for (const val of value) {
                        params.push(key + ("" !== val
                            ? "=" + ShellUtilities.escapeToken(val)
                            : ""));

                    }
                } else {
                    params.push(key + ("" !== value
                        ? "=" + ShellUtilities.escapeToken((value ?? "").toString())
                        : ""));
                }
            } else {
                params.push(Array.isArray(value)
                    ? value.map(ShellUtilities.escapeToken).join(" ")
                    : ShellUtilities.escapeToken((value ?? "").toString()));
            }
        }

        return params.join(" ");
    }

    protected parse(): void {
        for (const [key, value] of this.parameters.entries()) {
            if ("--" === key) {
                return;
            }

            const stringKey = key.toString();

            if (stringKey.indexOf("--") === 0) {
                this.addLongOption(stringKey.slice(2), value as OptionValue);
            } else if (stringKey.indexOf("-") === 0) {
                this.addShortOption(stringKey.slice(1), value as OptionValue);
            } else {
                this.addArgument(key, value as ArgumentValue);
            }
        }
    }

    private addLongOption(name: HybridCollectionKeyType, value: OptionValue) {
        if (!this.definition.hasOption(name)) {
            throw new RuntimeException(`The "--${name}" option does not exist.`);
        }

        const options = this.definition.getOption(name);
        if (null === value) {
            if (options.isValueRequired()) {
                throw new RuntimeException(`The "--${name}" option requires a value.`);
            }
            if (!options.isValueOptional()) {
                value = true;
            }
        }

        this.options.set(name, value);
    }

    private addShortOption(name: HybridCollectionKeyType, value: OptionValue) {
        if (!this.definition.hasShortcut(name.toString())) {
            throw new RuntimeException(`The "-${name}" option does not exist.`);
        }

        this.addLongOption(this.definition.getOptionForShortcut(name.toString()).getName(), value);
    }

    private addArgument(name: HybridCollectionKeyType, value: ArgumentValue) {
        if (!this.definition.hasArgument(name)) {
            throw new RuntimeException(`The "${name}" argument does not exist.`);
        }

        this.arguments.set(name, value);
    }

}
