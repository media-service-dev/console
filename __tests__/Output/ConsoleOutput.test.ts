/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { OutputFormatter } from "../../src/Formatter/OutputFormatter";
import { ConsoleOutput } from "../../src/Output/ConsoleOutput";
import { OutputMode } from "../../src/Output/OutputMode";

describe("ConsoleOutput", () => {

    it("should accept constructor", () => {
        // Act
        const output = new ConsoleOutput(OutputMode.VERBOSITY_QUIET, true);

        // Assert
        expect(output.getVerbosity()).toBe(OutputMode.VERBOSITY_QUIET);
        expect(output.getFormatter()).toBe(output.getErrorOutput().getFormatter());
    });

    it("should set formatter", () => {
        // Arrange
        const output = new ConsoleOutput();
        const formatter = new OutputFormatter();

        // Act
        output.setFormatter(formatter);

        // Assert
        expect(output.getFormatter()).toBe(formatter);
    });

    it("should set verbosity", () => {
        // Arrange
        const output = new ConsoleOutput();

        // Act
        output.setVerbosity(OutputMode.VERBOSITY_VERBOSE);

        // Assert
        expect(output.getVerbosity()).toBe(OutputMode.VERBOSITY_VERBOSE);
    });

});
