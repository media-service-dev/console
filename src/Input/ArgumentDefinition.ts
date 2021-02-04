/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { LogicException } from "../Exception/LogicException";
import { ArgumentMode } from "./ArgumentMode";
import { ArgumentValue } from "./ArgumentValue";

export class ArgumentDefinition {

    private readonly name: string;

    private readonly mode: ArgumentMode;

    private defaultValue!: ArgumentValue;

    private readonly description: string;

    // eslint-disable-next-line max-params
    public constructor(name: string, mode: ArgumentMode | null = null, description: string = "", defaultValue: ArgumentValue | null = null) {
        this.name = name;
        this.mode = mode ?? ArgumentMode.OPTIONAL;
        this.description = description;
        this.setDefault(defaultValue);
    }

    public getName(): string {
        return this.name;
    }

    public isRequired() {
        return ArgumentMode.REQUIRED === (ArgumentMode.REQUIRED & this.mode);
    }

    public isArray() {
        return ArgumentMode.IS_ARRAY === (ArgumentMode.IS_ARRAY & this.mode);
    }

    public setDefault(defaultValue: ArgumentValue | null = null) {
        if (ArgumentMode.REQUIRED === this.mode && null !== defaultValue) {
            throw new LogicException("Cannot set a default value except for ArgumentMode.OPTIONAL mode.");
        }

        if (this.isArray()) {
            if (null === defaultValue) {
                defaultValue = [];
            } else if (!Array.isArray(defaultValue)) {
                throw new LogicException("A default value for an array argument must be an array.");
            }
        }

        this.defaultValue = defaultValue as string;
    }

    public getDefault(): ArgumentValue {
        return this.defaultValue;
    }

    public getDescription(): string {
        return this.description;
    }

}
