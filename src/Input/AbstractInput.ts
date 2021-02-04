/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import * as Stream from "stream";

import { HybridCollection } from "../Collection/HybridCollection";
import { HybridCollectionEntriesType } from "../Collection/HybridCollectionEntriesType";
import { HybridCollectionKeyType } from "../Collection/HybridCollectionKeyType";
import { ArgumentException } from "../Exception/ArgumentException";
import { RuntimeException } from "../Exception/RuntimeException";
import { ArgumentValue } from "./ArgumentValue";
import { InputArguments } from "./InputArguments";
import { InputDefinition } from "./InputDefinition";
import { InputInterface } from "./InputInterface";
import { InputOptions } from "./InputOptions";
import { OptionValue } from "./OptionValue";
import { StreamableInputInterface } from "./StreamableInputInterface";

export abstract class AbstractInput<Arguments extends InputArguments = {}, Options extends InputOptions = {}> implements InputInterface<Arguments, Options>, StreamableInputInterface {

    protected options: HybridCollection<OptionValue>;

    protected arguments: HybridCollection<ArgumentValue>;

    protected definition!: InputDefinition;

    protected interactive: boolean = true;

    private stream!: Stream.Readable;

    public constructor() {
        this.options = new HybridCollection();
        this.arguments = new HybridCollection();
    }

    public boot(definition: InputDefinition | null = null) {
        if (null === definition) {
            this.definition = new InputDefinition();
        } else {
            this.bind(definition);
            this.validate();
        }
    }

    public bind(definition: InputDefinition) {
        this.options = new HybridCollection();
        this.arguments = new HybridCollection();
        this.definition = definition;

        this.parse();
    }

    public getArgument<ArgumentKeys extends keyof Arguments>(key: ArgumentKeys): Arguments[ArgumentKeys];

    public getArgument(key: HybridCollectionKeyType): ArgumentValue;

    public getArgument<ArgumentKeys extends keyof Arguments>(key: HybridCollectionKeyType | ArgumentKeys): Arguments[ArgumentKeys] | ArgumentValue;

    public getArgument(key: HybridCollectionKeyType): any {
        if (!this.definition.hasArgument(key)) {
            throw new ArgumentException(`The "${key}" argument does not exist.`);
        }

        if (this.arguments.has(key)) {
            return this.arguments.get(key);
        }

        return this.definition.getArgument(key).getDefault();
    }

    public getOption<OptionKeys extends keyof Options>(key: OptionKeys): Options[OptionKeys];

    public getOption(key: HybridCollectionKeyType): OptionValue;

    public getOption<OptionKeys extends keyof Options>(key: HybridCollectionKeyType | OptionKeys): Options[OptionKeys] | OptionValue;

    public getOption(key: HybridCollectionKeyType): any {
        if (!this.definition.hasOption(key)) {
            throw new ArgumentException(`The "${key}" option does not exist.`);
        }

        if (this.options.has(key)) {
            return this.options.get(key);
        }

        return this.definition.getOption(key).getDefault();
    }

    public setArgument<ArgumentKeys extends keyof Arguments>(key: ArgumentKeys, value: Arguments[ArgumentKeys]): this;

    public setArgument(key: HybridCollectionKeyType, value: ArgumentValue): this;

    public setArgument<ArgumentKeys extends keyof Arguments>(key: HybridCollectionKeyType | ArgumentKeys, value: Arguments[ArgumentKeys] | ArgumentValue): this;

    public setArgument(key: HybridCollectionKeyType, value: ArgumentValue): this {
        if (!this.definition.hasArgument(key)) {
            throw new ArgumentException(`The "${key}" argument does not exist.`);
        }
        this.arguments.set(key, value);

        return this;
    }

    public setOption<OptionKeys extends keyof Options>(key: OptionKeys, value: Options[OptionKeys]): this;

    public setOption(key: HybridCollectionKeyType, value: OptionValue): this;

    public setOption<OptionKeys extends keyof Options>(key: HybridCollectionKeyType | OptionKeys, value: Options[OptionKeys] | OptionValue): this;

    public setOption(key: HybridCollectionKeyType, value: OptionValue): this {
        if (!this.definition.hasOption(key)) {
            throw new ArgumentException(`The "${key}" option does not exist.`);
        }

        this.options.set(key, value);

        return this;
    }

    public hasArgument<ArgumentKeys extends keyof Arguments>(key: HybridCollectionKeyType | ArgumentKeys): boolean {
        return this.definition.hasArgument(key as HybridCollectionKeyType);
    }

    public hasOption<OptionKeys extends keyof Options>(key: HybridCollectionKeyType | OptionKeys): boolean {
        return this.definition.hasOption(key as HybridCollectionKeyType);
    }

    public setArguments<ArgumentKeys extends keyof Arguments>(args: HybridCollectionEntriesType<Arguments[ArgumentKeys] | ArgumentValue>): this {
        this.arguments = new HybridCollection<ArgumentValue>(args);

        return this;
    }

    public setOptions<OptionKeys extends keyof Options>(options: HybridCollectionEntriesType<Options[OptionKeys] | ArgumentValue>): this {
        this.options = new HybridCollection<OptionValue>(options);

        return this;
    }

    public getArguments<ArgumentKeys extends keyof Arguments>(): HybridCollection<Arguments[ArgumentKeys] | ArgumentValue> {
        return this.definition.getArgumentDefaults().merge(this.arguments);
    }

    public getOptions<OptionKeys extends keyof Options>(): HybridCollection<Options[OptionKeys] | OptionValue> {
        return this.definition.getOptionDefaults().merge(this.options);
    }

    public validate() {
        const { definition } = this;
        const givenArguments = this.arguments;

        const missingArguments: string[] = Array.from(definition.getArguments().keys())
            .map(item => item.toString())
            .filter(name => {
                const argument = definition.getArgument(name);

                return !givenArguments.has(name) && argument.isRequired();
            });

        if (missingArguments.length > 0) {
            throw new RuntimeException(`Not enough arguments (missing: "${missingArguments.join(", ")}")`);
        }
    }

    public abstract hasParameterOption(values: string[] | string, onlyParams?: boolean): boolean;

    public abstract getParameterOption(values: string[] | string, defaultValue?: OptionValue, onlyParams?: boolean): OptionValue;

    public abstract getFirstArgument(): string | null;

    public setInteractive(interactive: boolean): void {
        this.interactive = interactive;
    }

    public isInteractive(): boolean {
        return this.interactive;
    }

    public getStream(): Stream.Readable {
        return this.stream;
    }

    public setStream(stream: Stream.Readable): void {
        this.stream = stream;
    }

    protected abstract parse(): void;

}
