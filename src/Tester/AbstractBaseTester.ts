/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import * as os from "os";

import { CommandInterface } from "../Command/CommandInterface";
import { LogicException } from "../Exception/LogicException";
import { RuntimeException } from "../Exception/RuntimeException";
import { CollectionInput } from "../Input/CollectionInput";
import { ConsoleOutput } from "../Output/ConsoleOutput";
import { OutputMode } from "../Output/OutputMode";
import { StreamOutput } from "../Output/StreamOutput";
import { TesterDuplexStream } from "./TesterDuplexStream";
import { TesterOutputOptions } from "./TesterOutputOptions";

export abstract class AbstractBaseTester {

    protected command!: CommandInterface;

    protected input!: CollectionInput;

    protected statusCode!: number;

    protected output!: StreamOutput;

    protected inputs: string[] = [];

    protected captureStreamsIndependently: boolean = false;

    public getDisplay(normalize: boolean = false) {
        if (null === this.output) {
            throw new RuntimeException("Output not initialized, did you execute the command before requesting the display?");
        }

        const stream: TesterDuplexStream = this.output.getStream() as unknown as TesterDuplexStream;
        let display = stream.getContents();

        if (normalize) {
            display = display.replace(new RegExp(os.EOL, "g"), "\n");
        }

        return display;
    }

    public getErrorOutput(normalize: boolean = false) {
        if (!(this.output instanceof ConsoleOutput) || !this.captureStreamsIndependently) {
            throw new LogicException("The error output is not available when the tester is run without \"capture_stderr_separately\" option set.");
        }

        const stderr = this.output.getErrorOutput() as StreamOutput;
        const stream: TesterDuplexStream = stderr.getStream() as unknown as TesterDuplexStream;
        let display = stream.getContents();

        if (normalize) {
            display = display.replace(new RegExp(os.EOL, "g"), "\n");
        }

        return display;
    }

    public getInput() {
        return this.input;
    }

    public getOutput() {
        return this.output;
    }

    public getStatusCode() {
        return this.statusCode;
    }

    public setInputs(inputs: string[]) {
        this.inputs = inputs;

        return this;
    }

    public initOutput(options: TesterOutputOptions) {
        this.captureStreamsIndependently = options.captureStderrSeparately ?? false;
        const isDecorated = options.decorated ?? null;
        const verbosity = options.verbosity ?? null;

        if (!this.captureStreamsIndependently) {
            this.output = new StreamOutput(new TesterDuplexStream());
            if (isDecorated !== null) {
                this.output.setDecorated(isDecorated);
            }
            if (verbosity !== null) {
                this.output.setVerbosity(verbosity);
            }
        } else {
            this.output = new ConsoleOutput(
                verbosity !== null ? verbosity : OutputMode.VERBOSITY_NORMAL,
                isDecorated !== null ? isDecorated : null,
            );

            const errorOutput = new StreamOutput(new TesterDuplexStream());

            errorOutput.setFormatter(this.output.getFormatter());
            errorOutput.setVerbosity(this.output.getVerbosity());
            errorOutput.setDecorated(this.output.isDecorated());

            (this.output as any).stderr = errorOutput;
            (this.output as any).stream = new TesterDuplexStream();
        }
    }

    public createStream(inputs: string[]) {
        const stream = new TesterDuplexStream();

        for (const input of inputs) {
            stream.write(input + os.EOL);
        }

        return stream;
    }

}
