/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

export class Terminal {

    private static width: number;

    private static height: number;

    private static defaultHeight: number = 50;

    private static defaultWidth: number = 80;

    private static initDimensions() {
        Terminal.width = process.stdout.columns;
        Terminal.height = process.stdout.rows;
    }

    /**
     * Used to determine the width of the current terminal
     *
     * @returns {number}
     */
    public getWidth(): number {
        const width = process.env.COLUMNS ?? null;
        if (null !== width) {
            return parseInt(width.trim(), 10);
        }

        if (null === Terminal.width) {
            Terminal.initDimensions();
        }

        return Terminal.width ?? Terminal.defaultWidth;
    }

    /**
     * Used to determine the width of the current terminal
     *
     * @returns {number}
     */
    public getHeight(): number {
        const height = process.env.ROWS ?? null;
        if (null !== height) {
            return parseInt(height.trim(), 10);
        }

        if (null === Terminal.height) {
            Terminal.initDimensions();
        }

        return Terminal.height ?? Terminal.defaultHeight;
    }

}
