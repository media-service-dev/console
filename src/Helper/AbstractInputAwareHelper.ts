/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { InputInterface } from "../Input/InputInterface";
import { AbstractHelper } from "./AbstractHelper";
import { InputAwareInterface } from "./InputAwareInterface";

export abstract class AbstractInputAwareHelper extends AbstractHelper implements InputAwareInterface {

    protected input: InputInterface;

    public setInput(input: InputInterface): void {
        this.input = input;
    }

}
