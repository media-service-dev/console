/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { CommandInterface } from "../Command/CommandInterface";
import { ArgumentException } from "../Exception/ArgumentException";
import { HelperInterface } from "./HelperInterface";

export class HelperSet {

    private helpers: Map<string, HelperInterface> = new Map<string, HelperInterface>();

    private command!: CommandInterface | null;

    public constructor(helpers: HelperInterface[] | null = null) {
        if (null !== helpers) {
            for (const helper of helpers) {
                this.set(helper);
            }
        }
    }

    public set(helper: HelperInterface) {
        this.helpers.set(helper.getName(), helper);
        helper.setHelperSet(this);
    }

    public has(name: string) {
        return this.helpers.has(name);
    }

    public get<Type extends HelperInterface>(name: string) {
        if (!this.has(name)) {
            throw new ArgumentException(`The helper "${name}" is not defined`);
        }

        return this.helpers.get(name) as Type;
    }

    public setCommand(command: CommandInterface | null = null) {
        this.command = command;
    }

    public getCommand() {
        return this.command;
    }

    public getHelpers() {
        return this.helpers;
    }

}
