/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { OptionValue } from "../Input/OptionValue";

export interface OptionDefinitionData {

    name: string;

    shortcut: string;

    acceptValue: boolean;

    isValueRequired: boolean;

    isMultiple: boolean;

    description: string;

    default: OptionValue;

}
