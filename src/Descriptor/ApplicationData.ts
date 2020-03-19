/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { CommandData } from "./CommandData";
import { NamespaceData } from "./NamespaceData";

export interface ApplicationData {
    commands: CommandData[];

    application: {
        name: string;
        version: string;
    };

    namespace?: string

    namespaces?: NamespaceData[];
}
