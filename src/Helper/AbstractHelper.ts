/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { OutputFormatterInterface } from "../Formatter/OutputFormatterInterface";
import { HelperInterface } from "./HelperInterface";
import { HelperSet } from "./HelperSet";

export abstract class AbstractHelper implements HelperInterface {

    protected helperSet!: HelperSet | null;

    public static lengthWithoutDecoration(formatter: OutputFormatterInterface, text: string): number {
        return this.removeDecoration(formatter, text).length;
    }

    public static removeDecoration(formatter: OutputFormatterInterface, text: string): string {
        const isDecorated = formatter.isDecorated();

        formatter.setDecorated(false);
        text = formatter.format(text);
        // eslint-disable-next-line no-control-regex
        text = text.replace(/\u001b\[[^m]*m/g, "");
        formatter.setDecorated(isDecorated);

        return text;
    }

    public getHelperSet(): HelperSet | null {
        return this.helperSet;
    }

    public abstract getName(): string;

    public setHelperSet(helperSet: HelperSet | null = null): void {
        this.helperSet = helperSet;
    }

}
