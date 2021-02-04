/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import * as os from "os";

import { OutputFormatterInterface } from "../Formatter/OutputFormatterInterface";
import { ConsoleOutput } from "../Output/ConsoleOutput";
import { OutputInterface } from "../Output/OutputInterface";
import { OutputMode } from "../Output/OutputMode";
import { OutputOptions } from "../Output/OutputOptions";
import { StyledOutputInterface } from "./StyledOutputInterface";

export abstract class AbstractStyledOutput implements OutputInterface, StyledOutputInterface {

    protected output: OutputInterface;

    public constructor(output: OutputInterface) {
        this.output = output;
    }

    public getOutput(): OutputInterface {
        return this.output;
    }

    public write(messages: string | string[], options: Partial<OutputOptions> = {}): void {
        this.output.write(messages, options);
    }

    public writeln(messages: string | string[], options: Partial<Pick<OutputOptions, "mode">> = {}): void {
        this.output.writeln(messages, options);
    }

    public setVerbosity(mode: OutputMode): void {
        this.output.setVerbosity(mode);
    }

    public getVerbosity(): OutputMode {
        return this.output.getVerbosity();
    }

    public isQuiet(): boolean {
        return this.output.isQuiet();
    }

    public isVerbose(): boolean {
        return this.output.isVerbose();
    }

    public isVeryVerbose(): boolean {
        return this.output.isVeryVerbose();
    }

    public isDebug(): boolean {
        return this.output.isDebug();
    }

    public setDecorated(decorated: boolean): void {
        this.output.setDecorated(decorated);
    }

    public isDecorated(): boolean {
        return this.output.isDecorated();
    }

    public setFormatter(formatter: OutputFormatterInterface): void {
        this.output.setFormatter(formatter);
    }

    public getFormatter(): OutputFormatterInterface {
        return this.output.getFormatter();
    }

    public abstract ask(question: string, defaultValue?: string | null, validator?: ((response: (string | null)) => string) | null): Promise<string>;

    public abstract askHidden(question: string, validator?: ((response: (string | null)) => string) | null): Promise<string>;

    public abstract caution(message: string): void;

    public abstract choice(question: string, choices: string[], defaultValue: string | null): Promise<string>;

    public abstract confirm(question: string, defaultValue: boolean): Promise<boolean>;

    public abstract error(message: string): void;

    public abstract listing(items: string[]): void;

    public newLine(amount: number = 1): void {
        this.output.write(os.EOL.repeat(amount));
    }

    public abstract note(message: string): void;

    public abstract section(message: string): void;

    public abstract success(message: string): void;

    public abstract text(message: string): void;

    public abstract title(message: string): void;

    public abstract warning(message: string): void;

    public abstract block(messages: string | string[], type?: string | null, style?: string | null, prefix?: string, padding?: boolean, escape?: boolean): void;

    public abstract comment(message: string): void;

    protected getErrorOutput() {
        if (this.output instanceof ConsoleOutput) {
            return this.output.getErrorOutput();
        }

        return this.output;
    }

}
