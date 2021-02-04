/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { InputDefinitionData } from "./InputDefinitionData";

export interface CommandData {
    name: string;

    usage: string[];

    description: string | null;

    help: string | null;

    definition: InputDefinitionData;

    hidden: boolean;
}
