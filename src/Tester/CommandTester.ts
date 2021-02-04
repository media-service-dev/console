/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { HybridCollection } from "../Collection/HybridCollection";
import { HybridCollectionEntriesType } from "../Collection/HybridCollectionEntriesType";
import { CommandInterface } from "../Command/CommandInterface";
import { ArgumentValue } from "../Input/ArgumentValue";
import { CollectionInput } from "../Input/CollectionInput";
import { OptionValue } from "../Input/OptionValue";
import { AbstractBaseTester } from "./AbstractBaseTester";
import { TesterOptions } from "./TesterOptions";

export class CommandTester extends AbstractBaseTester {

    public constructor(command: CommandInterface<any, any>) {
        super();
        this.command = command;
    }

    public async execute(input: HybridCollection<ArgumentValue | OptionValue> | HybridCollectionEntriesType<ArgumentValue | OptionValue>, options: TesterOptions = {}) {
        let parameters = (input instanceof HybridCollection) ? input : new HybridCollection(input);
        const application = this.command.getApplication();

        if (!parameters.has("command") && (null !== application) && application.getDefinition().hasArgument("command")) {
            parameters = parameters.merge(new HybridCollection([["command", this.command.getName()]]));
        }

        this.input = new CollectionInput(input);
        this.input.setStream(this.createStream(this.inputs));

        const isInteractive = options.interactive ?? null;
        const isDecorated = options.decorated ?? null;

        if (null !== isInteractive) {
            this.input.setInteractive(isInteractive);
        }

        if (null === isDecorated) {
            options.decorated = false;
        }

        this.initOutput(options);

        this.statusCode = await this.command.run(this.input, this.output);

        return this.statusCode;
    }

}
