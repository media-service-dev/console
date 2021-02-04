/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { ArgumentValue } from "../Input/ArgumentValue";

export interface ArgumentDefinitionData {
    name: string;

    isRequired: boolean;

    isArray: boolean;

    description: string;

    default: ArgumentValue;
}
