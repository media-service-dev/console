/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { RuntimeException } from "../Exception/RuntimeException";
import { OutputFormatterStyle } from "./OutputFormatterStyle";
import { OutputFormatterStyleInterface } from "./OutputFormatterStyleInterface";

export class OutputFormatterStyleStack {

    private styles!: OutputFormatterStyleInterface[];

    private emptyStyle: OutputFormatterStyleInterface;

    public constructor(emptyStyle: OutputFormatterStyleInterface | null = null) {
        this.emptyStyle = emptyStyle ?? new OutputFormatterStyle();
        this.reset();
    }

    public reset() {
        this.styles = [];
    }

    public push(style: OutputFormatterStyleInterface) {
        this.styles.push(style);
    }

    public pop() {
        if (0 === this.styles.length) {
            return this.emptyStyle;
        }

        return this.styles.pop() ?? null;
    }

    public popUntil(style: OutputFormatterStyleInterface) {
        if (0 === this.styles.length) {
            return this.emptyStyle;
        }

        const items = Array.from([...this.styles].entries()).reverse();

        for (const [index, item] of items) {
            if (item.apply("") === style.apply("")) {
                this.styles = this.styles.slice(0, index as number);

                return item;
            }
        }

        throw new RuntimeException("Incorrectly nested style tag found.");
    }

    public peek() {
        if (0 === this.styles.length) {
            return this.emptyStyle;
        }

        return this.styles[this.styles.length - 1];
    }

    public setEmptyStyle(emptyStyle: OutputFormatterStyleInterface) {
        this.emptyStyle = emptyStyle;

        return this;
    }

    public getEmptyStyle() {
        return this.emptyStyle;
    }

}
