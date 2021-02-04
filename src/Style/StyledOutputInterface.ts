/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { Validator } from "../Question/Validator";

export interface StyledOutputInterface {

    block(messages: string | string[], type?: string | null, style?: string | null, prefix?: string, padding?: boolean, escape?: boolean): void;

    title(message: string): void;

    section(message: string): void;

    listing(items: string[]): void;

    text(messages: string | string[]): void;

    success(message: string): void;

    comment(message: string): void;

    error(message: string): void;

    warning(message: string): void;

    note(message: string): void;

    caution(message: string): void;

    newLine(amount?: number): void;

    ask(question: string, defaultValue?: string | null, validator?: Validator<string> | null): Promise<string>;

    askHidden(question: string, validator?: Validator<string> | null): Promise<string>;

    confirm(question: string, defaultValue: boolean): Promise<boolean>;

    choice(question: string, choices: string[], defaultValue: string | null): Promise<string>;

}
