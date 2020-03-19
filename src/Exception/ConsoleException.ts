/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

export class ConsoleException extends Error {

    public exitCode: number;

    public constructor(message: string, exitCode: number = 1) {
        super(message);
        this.exitCode = exitCode;
    }

}
