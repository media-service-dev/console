/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { AbstractHelper } from "./AbstractHelper";
import { Format } from "./Format";

export class DebugFormatterHelper extends AbstractHelper {

    protected colors: string[] = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white", "default"];

    protected started: Map<string, Format> = new Map<string, Format>();

    protected count: number = -1;

    public start(id: string, message: string, prefix: string = "RUN") {
        if (!this.started.has(id)) {
            this.started.set(id, { border: ++this.count % this.colors.length });
        }

        return `${this.getBorder(id)}<bg=blue;fg=white> ${prefix} </> <fg=blue>${message}</>\n`;
    }

    // eslint-disable-next-line max-params
    public progress(id: string, buffer: string, error: boolean = false, prefix: string = "OUT", errorPrefix: string = "ERR") {
        let message = "";

        if (!this.started.has(id)) {
            this.started.set(id, { border: ++this.count % this.colors.length });
        }

        const item = this.started.get(id) as Format;

        if (error) {
            if (typeof item.output !== "undefined") {
                message += "\n";
                delete item.output;
            }
            if (typeof item.error === "undefined") {
                message += `${this.getBorder(id)}<bg=red;fg=white> ${errorPrefix} </> `;
                item.error = true;
            }

            message += buffer.replace(/\n/g, `\n${this.getBorder(id)}<bg=red;fg=white> ${errorPrefix} </> `);
        } else {
            if (typeof item.error !== "undefined") {
                message += "\n";
                delete item.error;
            }

            if (typeof item.output === "undefined") {
                message += `${this.getBorder(id)}<bg=green;fg=white> ${prefix} </> `;
                item.output = true;
            }

            message += buffer.replace(/\n/g, `\n${this.getBorder(id)}<bg=green;fg=white> ${prefix} </> `);
        }

        this.started.set(id, item);

        return message;
    }

    // eslint-disable-next-line max-params
    public stop(id: string, message: string, successful: boolean, prefix: string = "RES") {
        if (!this.started.has(id)) {
            this.started.set(id, { border: ++this.count % this.colors.length });
        }

        const item = this.started.get(id) as Format;

        const trailingEOL = ((typeof item.output !== "undefined") || (typeof item.error !== "undefined"))
            ? "\n"
            : "";

        if (successful) {
            message = `${trailingEOL + this.getBorder(id)}<bg=green;fg=white> ${prefix} </> <fg=green>${message}</>\n`;
        } else {
            message = `${trailingEOL + this.getBorder(id)}<bg=green;fg=white> ${prefix} </> <fg=red>${message}</>\n`;
        }

        this.started.delete(id);

        return message;
    }

    public getName(): string {
        return "debug_formatter";
    }

    private getBorder(id: string) {
        if (!this.started.has(id)) {
            this.started.set(id, { border: ++this.count % this.colors.length });
        }
        const item = this.started.get(id) as Format;

        return `<bg=${this.colors[item.border]}> </>`;
    }

}
