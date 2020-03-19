/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { ApplicationInterface } from "../Application/ApplicationInterface";
import { HybridCollection } from "../Collection/HybridCollection";
import { HybridCollectionEntriesType } from "../Collection/HybridCollectionEntriesType";
import { ArgumentValue } from "../Input/ArgumentValue";
import { CollectionInput } from "../Input/CollectionInput";
import { OptionValue } from "../Input/OptionValue";
import { AbstractBaseTester } from "./AbstractBaseTester";
import { TesterOptions } from "./TesterOptions";

export class ApplicationTester extends AbstractBaseTester {

    private application: ApplicationInterface;

    public constructor(application: ApplicationInterface) {
        super();
        this.application = application;
    }

    public async run(input: HybridCollection<ArgumentValue | OptionValue> | HybridCollectionEntriesType<ArgumentValue | OptionValue>, options: TesterOptions = {}) {
        this.input = new CollectionInput(input);

        const isInteractive = options.interactive ?? null;

        if (null !== isInteractive) {
            this.input.setInteractive(isInteractive);
        }

        if (this.inputs) {
            this.input.setStream(this.createStream(this.inputs));
        }

        this.initOutput(options);

        this.statusCode = await this.application.run(this.input, this.output);

        return this.statusCode;
    }

}
