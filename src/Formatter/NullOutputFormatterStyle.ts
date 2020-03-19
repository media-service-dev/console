/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { OutputFormatterStyleInterface } from "./OutputFormatterStyleInterface";

export class NullOutputFormatterStyle implements OutputFormatterStyleInterface {

    public apply(text: string): string {
        return text;
    }

    public setBackground(): void {
        // do nothing
    }

    public setForeground(): void {
        // do nothing
    }

    public setOption(): void {
        // do nothing
    }

    public setOptions(): void {
        // do nothing
    }

    public unsetOption(): void {
        // do nothing
    }

}
