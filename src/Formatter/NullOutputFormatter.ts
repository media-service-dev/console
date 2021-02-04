/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { NullOutputFormatterStyle } from "./NullOutputFormatterStyle";
import { OutputFormatterInterface } from "./OutputFormatterInterface";
import { OutputFormatterStyleInterface } from "./OutputFormatterStyleInterface";

export class NullOutputFormatter implements OutputFormatterInterface {

    private style: OutputFormatterStyleInterface | null = null;

    public format(message: string): string {
        return message;
    }

    public getStyle(): OutputFormatterStyleInterface {
        if (this.style) {
            return this.style;
        }

        this.style = new NullOutputFormatterStyle();

        return this.style;
    }

    public hasStyle(): boolean {
        return false;
    }

    public isDecorated(): boolean {
        return false;
    }

    public setDecorated(): void {
        // do nothing
    }

    public setStyle(): void {
        // do nothing
    }

}
