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
import { ArgumentValue } from "./ArgumentValue";
import { InputArguments } from "./InputArguments";
import { InputDefinition } from "./InputDefinition";
import { InputOptions } from "./InputOptions";
import { OptionValue } from "./OptionValue";

export interface InputInterface<Arguments extends InputArguments = {}, Options extends InputOptions = {}> {

    hasOption<OptionKeys extends keyof Options>(key: OptionKeys | HybridCollectionKeyType): boolean;

    getOption<OptionKeys extends keyof Options>(key: OptionKeys): Options[OptionKeys];

    getOption<OptionKeys extends keyof Options>(key: HybridCollectionKeyType): OptionValue;

    getOption<OptionKeys extends keyof Options>(key: OptionKeys | HybridCollectionKeyType): Options[OptionKeys] | OptionValue;

    setOption<OptionKeys extends keyof Options>(key: OptionKeys, value: Options[OptionKeys]): this;

    setOption<OptionKeys extends keyof Options>(key: HybridCollectionKeyType, value: OptionValue): this;

    setOption<OptionKeys extends keyof Options>(key: OptionKeys | HybridCollectionKeyType, value: Options[OptionKeys] | OptionValue): this;

    setOptions<OptionKeys extends keyof Options>(options: HybridCollectionEntriesType<Options[OptionKeys] | OptionValue>): this;

    getOptions<OptionKeys extends keyof Options>(): HybridCollection<Options[OptionKeys] | OptionValue>;

    hasArgument<ArgumentKeys extends keyof Arguments>(key: ArgumentKeys | HybridCollectionKeyType): boolean;

    getArgument<ArgumentKeys extends keyof Arguments>(key: ArgumentKeys): Arguments[ArgumentKeys];

    getArgument<ArgumentKeys extends keyof Arguments>(key: HybridCollectionKeyType): ArgumentValue;

    getArgument<ArgumentKeys extends keyof Arguments>(key: ArgumentKeys | HybridCollectionKeyType): Arguments[ArgumentKeys] | ArgumentValue;

    setArgument<ArgumentKeys extends keyof Arguments>(key: ArgumentKeys, value: Arguments[ArgumentKeys]): this;

    setArgument<ArgumentKeys extends keyof Arguments>(key: HybridCollectionKeyType, value: ArgumentValue): this;

    setArgument<ArgumentKeys extends keyof Arguments>(key: ArgumentKeys | HybridCollectionKeyType, value: Arguments[ArgumentKeys] | ArgumentValue): this;

    setArguments<ArgumentKeys extends keyof Arguments>(args: HybridCollectionEntriesType<Arguments[ArgumentKeys] | ArgumentValue>): this;

    getArguments<ArgumentKeys extends keyof Arguments>(): HybridCollection<Arguments[ArgumentKeys] | ArgumentValue>;

    bind(definition: InputDefinition): void;

    validate(): void;

    hasParameterOption(values: string[] | string, onlyParams?: boolean): boolean;

    getParameterOption(values: string[] | string, defaultValue?: OptionValue, onlyParams?: boolean): OptionValue;

    getFirstArgument(): string | null;

    setInteractive(interactive: boolean): void;

    isInteractive(): boolean;

}
