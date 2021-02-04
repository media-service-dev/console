/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { AbstractHelper } from "../../../src/Helper/AbstractHelper";

export function genericHelper(name: string) {
    class MockedHelper extends AbstractHelper {

        public getName(): string {
            return name;
        }

    }

    return new MockedHelper();

}
