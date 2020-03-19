/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { ColorMapping } from "./ColorMapping";
import { OptionMapping } from "./OptionMapping";

export interface OutputFormatterStyleInterface {

    setForeground(color?: keyof ColorMapping | null): void;

    setBackground(color?: keyof ColorMapping | null): void;

    setOption(option: keyof OptionMapping): void;

    unsetOption(option: keyof OptionMapping): void;

    setOptions(options: (keyof OptionMapping)[]): void;

    apply(text: string): string;

}
