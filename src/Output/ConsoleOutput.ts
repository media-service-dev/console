/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { OutputFormatterInterface } from "../Formatter/OutputFormatterInterface";
import { ConsoleOutputInterface } from "./ConsoleOutputInterface";
import { ConsoleSectionOutput } from "./ConsoleSectionOutput";
import { OutputInterface } from "./OutputInterface";
import { OutputMode } from "./OutputMode";
import { StreamOutput } from "./StreamOutput";

export class ConsoleOutput extends StreamOutput implements ConsoleOutputInterface {

    private stderr: OutputInterface;

    private consoleSectionOutputs: { sections: ConsoleSectionOutput[] } = { sections: [] };

    public constructor(verbosity: OutputMode = OutputMode.VERBOSITY_NORMAL, decorated: boolean | null = null, formatter: OutputFormatterInterface | null = null) {
        super(process.stdout, verbosity, decorated, formatter);

        const actualDecorated = this.isDecorated();

        this.stderr = new StreamOutput(process.stderr, verbosity, decorated, this.getFormatter());

        if (null === decorated) {
            this.setDecorated(actualDecorated && this.stderr.isDecorated());
        }
    }

    /**
     * @inheritDoc
     */
    public section() {
        return new ConsoleSectionOutput(this.consoleSectionOutputs, this.getStream(), this.getVerbosity(), this.isDecorated(), this.getFormatter());
    }

    /**
     * @inheritDoc
     */
    public setDecorated(decorated: boolean): void {
        super.setDecorated(decorated);
        if (this.stderr) {
            this.stderr.setDecorated(decorated);
        }
    }

    /**
     * @inheritDoc
     */
    public setFormatter(formatter: OutputFormatterInterface): void {
        super.setFormatter(formatter);
        this.stderr.setFormatter(formatter);
    }

    /**
     * @inheritDoc
     */
    public setVerbosity(mode: OutputMode): void {
        super.setVerbosity(mode);
        this.stderr.setVerbosity(mode);
    }

    /**
     * @inheritDoc
     */
    public getErrorOutput(): OutputInterface {
        return this.stderr;
    }

    /**
     * @inheritDoc
     */
    public setErrorOutput(error: OutputInterface): void {
        this.stderr = error;
    }

}
