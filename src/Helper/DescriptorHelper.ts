/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { ApplicationInterface } from "../Application/ApplicationInterface";
import { CommandInterface } from "../Command/CommandInterface";
import { DescriptorInterface } from "../Descriptor/DescriptorInterface";
import { JsonDescriptor } from "../Descriptor/JsonDescriptor";
import { TextDescriptor } from "../Descriptor/TextDescriptor";
import { RuntimeException } from "../Exception/RuntimeException";
import { ArgumentDefinition } from "../Input/ArgumentDefinition";
import { InputDefinition } from "../Input/InputDefinition";
import { OptionDefinition } from "../Input/OptionDefinition";
import { OutputInterface } from "../Output/OutputInterface";
import { AbstractHelper } from "./AbstractHelper";
import { BaseDescriptorOptions } from "./BaseDescriptorOptions";

export class DescriptorHelper extends AbstractHelper {

    protected descriptors: Map<string, DescriptorInterface<BaseDescriptorOptions>>;

    public constructor() {
        super();

        this.descriptors = new Map<string, DescriptorInterface<BaseDescriptorOptions>>();

        this
            .register("txt", new TextDescriptor())
            .register("json", new JsonDescriptor());
    }

    public describe(output: OutputInterface, object: ArgumentDefinition | OptionDefinition | InputDefinition | CommandInterface | ApplicationInterface, options?: BaseDescriptorOptions) {
        options = {
            rawText: false,
            format: "txt",
            ...options,
        };

        if (!this.descriptors.has(options.format)) {
            throw new RuntimeException(`Unsupported format "${options.format}".`);
        }

        const descriptor = this.descriptors.get(options.format);
        if (descriptor) {
            descriptor.describe(output, object, options);
        }

    }

    public getName(): string {
        return "descriptor";
    }

    public register(format: string, descriptor: DescriptorInterface<BaseDescriptorOptions>) {
        this.descriptors.set(format, descriptor);

        return this;
    }

}
