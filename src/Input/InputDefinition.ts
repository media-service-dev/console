/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { HybridCollection } from "../Collection/HybridCollection";
import { HybridCollectionKeyType } from "../Collection/HybridCollectionKeyType";
import { ArgumentException } from "../Exception/ArgumentException";
import { LogicException } from "../Exception/LogicException";
import { ArgumentDefinition } from "./ArgumentDefinition";
import { ArgumentValue } from "./ArgumentValue";
import { OptionDefinition } from "./OptionDefinition";
import { OptionValue } from "./OptionValue";

export class InputDefinition {

    protected arguments: HybridCollection<ArgumentDefinition>;

    protected options: HybridCollection<OptionDefinition>;

    protected shortcuts: HybridCollection<string>;

    protected hasAnArrayArgument: boolean = false;

    protected hasOptional: boolean = false;

    protected requiredCount: number = 0;

    public constructor(definitions: (ArgumentDefinition | OptionDefinition)[] = []) {
        this.arguments = new HybridCollection<ArgumentDefinition>();
        this.options = new HybridCollection<OptionDefinition>();
        this.shortcuts = new HybridCollection<string>();
        this.setDefinition(definitions);
    }

    public setDefinition(definitions: (ArgumentDefinition | OptionDefinition)[] = []): void {
        const args: ArgumentDefinition[] = [];
        const options: OptionDefinition[] = [];

        for (const definition of definitions) {
            if (definition instanceof OptionDefinition) {
                options.push(definition);
            } else {
                args.push(definition);
            }
        }

        this.setArguments(args);
        this.setOptions(options);
    }

    public addArgument(argument: ArgumentDefinition): void {
        if (this.arguments.has(argument.getName())) {
            throw new LogicException(`An argument with name "${argument.getName()}" already exists.`);
        }

        if (this.hasAnArrayArgument) {
            throw new LogicException("Cannot add an argument after an array argument.");
        }

        if (argument.isRequired() && this.hasOptional) {
            throw new LogicException("Cannot add a required argument after an optional one.");
        }

        if (argument.isArray()) {
            this.hasAnArrayArgument = true;
        }

        if (argument.isRequired()) {
            ++this.requiredCount;
        } else {
            this.hasOptional = true;
        }

        this.arguments.set(argument.getName(), argument);
    }

    public getArgument(name: HybridCollectionKeyType): ArgumentDefinition {
        if (!this.hasArgument(name)) {
            throw new ArgumentException(`The "${name}" argument does not exist.`);
        }

        if (typeof name === "number") {
            const values = Array.from(this.arguments.values());

            return values[name];
        }

        return this.arguments.get(name) as ArgumentDefinition;
    }

    public getOptionDefaults(): HybridCollection<OptionValue> {
        const options = new HybridCollection<OptionValue>();

        for (const option of this.options.values()) {
            options.set(option.getName(), option.getDefault());
        }

        return options;
    }

    public getArgumentDefaults(): HybridCollection<ArgumentValue> {
        const args = new HybridCollection<ArgumentValue>();

        for (const argument of this.arguments.values()) {
            args.set(argument.getName(), argument.getDefault());
        }

        return args;
    }

    public hasArgument(name: HybridCollectionKeyType): boolean {
        if (typeof name === "number") {
            const values = Array.from(this.arguments.values());

            return typeof values[name] !== "undefined";
        }

        return this.arguments.has(name);
    }

    public addOption(option: OptionDefinition): void {
        if (this.options.has(option.getName()) && !option.equals(this.options.get(option.getName()) as OptionDefinition)) {
            throw new LogicException(`An option named "${option.getName()}" already exists.`);
        }

        const optionsShortcut = option.getShortcut();

        if (optionsShortcut) {
            const shortcuts = optionsShortcut.split("|");
            const shortcutKeys = Array.from(this.shortcuts.keys());

            for (const shortcut of shortcuts) {
                if (-1 !== shortcutKeys.indexOf(shortcut)) {
                    throw new LogicException(`An option with shortcut "${shortcut}" already exists.`);
                }
            }
        }

        this.options.set(option.getName(), option);
        if (optionsShortcut) {
            const shortcuts = optionsShortcut.split("|");

            for (const shortcut of shortcuts) {
                this.shortcuts.set(shortcut, option.getName());
            }
        }
    }

    public getArguments(): HybridCollection<ArgumentDefinition> {
        return this.arguments;
    }

    public hasOption(name: HybridCollectionKeyType): boolean {
        return this.options.has(name);
    }

    public getOption(name: HybridCollectionKeyType): OptionDefinition {
        if (!this.hasOption(name)) {
            throw new ArgumentException(`The "--${name}" option does not exist.`);
        }

        return this.options.get(name) as OptionDefinition;
    }

    public hasShortcut(shortcut: string): boolean {
        return this.shortcuts.has(shortcut);
    }

    public getOptionForShortcut(shortcut: string): OptionDefinition {
        return this.getOption(this.shortcutToName(shortcut));
    }

    public shortcutToName(shortcut: string): string {
        if (!this.shortcuts.has(shortcut)) {
            throw new ArgumentException(`The "-${shortcut}" option does not exist.`);
        }

        return this.shortcuts.get(shortcut) as string;
    }

    public setArguments(args: ArgumentDefinition[] = []): void {
        this.arguments = new HybridCollection<ArgumentDefinition>();
        this.requiredCount = 0;
        this.hasOptional = false;
        this.hasAnArrayArgument = false;
        this.addArguments(args);
    }

    public addArguments(args: ArgumentDefinition[] = []): void {
        for (const argument of args) {
            this.addArgument(argument);
        }
    }

    public setOptions(options: OptionDefinition[]): void {
        this.options = new HybridCollection<OptionDefinition>();
        this.shortcuts = new HybridCollection<string>();
        this.addOptions(options);
    }

    public addOptions(options: OptionDefinition[] = []): void {
        for (const option of options) {
            this.addOption(option);
        }
    }

    public getOptions() {
        return this.options;
    }

    public getArgumentRequiredCount() {
        return this.requiredCount;
    }

    public getArgumentCount() {
        return this.arguments.size;
    }

    public getSynopsis(short: boolean = false): string {
        const elements: string[] = [];

        if (short && this.getOptions().size) {
            elements.push("[options]");
        } else if (!short) {
            for (const option of this.getOptions().values()) {
                let value = "";

                if (option.acceptValue()) {
                    value = [
                        option.isValueOptional()
                            ? "["
                            : "",
                        option.getName().toUpperCase(),
                        option.isValueOptional()
                            ? "]"
                            : "",
                    ].join("");
                }

                const shortcut = option.getShortcut()
                    ? `-${option.getShortcut()}|`
                    : "";

                elements.push(`[${shortcut}--${option.getName()}${value ? " " + value : ""}]`);
            }
        }

        if (elements.length && this.getArguments().size) {
            elements.push("[--]");
        }
        let tail = "";

        for (const argument of this.getArguments().values()) {
            let element = `<${argument.getName()}>`;

            if (argument.isArray()) {
                element += "...";
            }

            if (!argument.isRequired()) {
                element = "[" + element;
                tail += "]";
            }
            elements.push(element);
        }

        return elements.join(" ") + tail;

    }

}
