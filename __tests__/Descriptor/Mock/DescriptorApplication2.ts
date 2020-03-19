/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { Application } from "../../../src/Application/Application";
import { DescriptorCommand1 } from "./DescriptorCommand1";
import { DescriptorCommand2 } from "./DescriptorCommand2";
import { DescriptorCommand3 } from "./DescriptorCommand3";
import { DescriptorCommand4 } from "./DescriptorCommand4";

export class DescriptorApplication2 extends Application {

    public constructor() {
        super("Foo bar", "1.0.0");
        this.add(new DescriptorCommand1());
        this.add(new DescriptorCommand2());
        this.add(new DescriptorCommand3());
        this.add(new DescriptorCommand4());
    }

}
