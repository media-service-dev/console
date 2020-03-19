/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { ApplicationInterface } from "../../src/Application/ApplicationInterface";

/**
 * Replaces the dynamic placeholders of the command help text with a static version.
 * The placeholder %command.full_name% includes the script path that is not predictable
 * and can not be tested against.
 *
 * @param application
 */
export function ensureStaticCommandHelp(application: ApplicationInterface) {
    for (const command of application.all().values()) {
        command.setHelp((command.getHelp() ?? "").replace(/%command.full_name%/g, "bin/console %command.name%"));
    }
}
