/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { ApplicationInterface } from "../Application/ApplicationInterface";
import { HelperInterface } from "../Helper/HelperInterface";
import { HelperSet } from "../Helper/HelperSet";
import { ArgumentMode } from "../Input/ArgumentMode";
import { ArgumentValue } from "../Input/ArgumentValue";
import { InputArguments } from "../Input/InputArguments";
import { InputDefinition } from "../Input/InputDefinition";
import { InputInterface } from "../Input/InputInterface";
import { InputOptions } from "../Input/InputOptions";
import { OptionMode } from "../Input/OptionMode";
import { OptionValue } from "../Input/OptionValue";
import { OutputInterface } from "../Output/OutputInterface";
import { CommandCode } from "./CommandCode";

export interface CommandInterface<Arguments extends InputArguments = {}, Options extends InputOptions = {}> {

    getUsages(): string[];

    addUsage(usage: string): this;

    isHidden(): boolean;

    setHidden(hidden: boolean): this;

    getNativeDefinition(): InputDefinition;

    getProcessedHelp(): string;

    getDescription(): string | null;

    setDescription(description: string | null): this;

    setHelp(help: string | null): this;

    getHelp(): string | null;

    getName(): string;

    setName(name: string): this;

    setCode(code: CommandCode<Arguments, Options>): this;

    run(input: InputInterface<Arguments, Options>, output: OutputInterface): Promise<number>;

    setApplication(application?: ApplicationInterface | null): void;

    getApplication(): ApplicationInterface | null;

    getDefinition(): InputDefinition;

    getAliases(): string[];

    setAliases(aliases: string[]): this;

    addOption(name: string, shortcut?: string | string[] | null, mode?: OptionMode | null, description?: string, defaultValue?: OptionValue | null): this;

    addArgument(name: string, mode?: ArgumentMode | null, description?: string, defaultValue?: ArgumentValue | null): this;

    mergeApplicationDefinition(mergeArguments?: boolean): void;

    getSynopsis(short?: boolean): string;

    getHelperSet(): HelperSet | null;

    setHelperSet(helperSet: HelperSet): void;

    getHelper<Type extends HelperInterface>(name: string): Type;

}
