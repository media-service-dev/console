/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import * as semver from "semver";
import { CommandInterface } from "../Command/CommandInterface";
import { HelperSet } from "../Helper/HelperSet";
import { InputArguments } from "../Input/InputArguments";
import { InputDefinition } from "../Input/InputDefinition";
import { InputInterface } from "../Input/InputInterface";
import { InputOptions } from "../Input/InputOptions";
import { OutputInterface } from "../Output/OutputInterface";

export interface ApplicationInterface {

    getName(): string;

    setName(name: string): void;

    getVersion(): semver.SemVer;

    setVersion(version: string): void;

    run(input?: InputInterface | null, output?: OutputInterface | null): Promise<number>

    find(name: string): CommandInterface;

    has(name: string): boolean;

    get(name: string): CommandInterface;

    add<Arguments extends InputArguments = {}, Options extends InputOptions = {}>(command: CommandInterface<Arguments, Options>): CommandInterface<Arguments, Options>;

    setAutoExit(autoExit: boolean): this;

    setDefaultCommand(name: string, isSingleCommand?: boolean): this;

    getDefinition(): InputDefinition;

    isSingleCommand(): boolean;

    findNamespace(namespace: string): string;

    getNamespaces(): string[];

    register<Arguments extends InputArguments = {}, Options extends InputOptions = {}>(name: string): CommandInterface<Arguments, Options>;

    all(namespace?: string | null): Map<string, CommandInterface>;

    extractNamespace(name: string, limit?: number | null): string;

    getHelp(): string;

    areExceptionsCaught(): boolean;

    setCatchExceptions(catchExceptions: boolean): void;

    setHelperSet(helperSet: HelperSet): void;

    getHelperSet(): HelperSet;

    addCommands(commands: CommandInterface[]): this;

}
