/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { OutputFormatterStyleInterface } from "./OutputFormatterStyleInterface";

export interface OutputFormatterInterface {

    setDecorated(decorated: boolean): void;

    isDecorated(): boolean;

    setStyle(name: string, style: OutputFormatterStyleInterface): void;

    hasStyle(name: string): boolean;

    getStyle(name: string): OutputFormatterStyleInterface;

    format(message: string): string;

}
