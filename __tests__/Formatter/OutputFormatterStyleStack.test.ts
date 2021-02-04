/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { RuntimeException } from "../../src/Exception/RuntimeException";
import { OutputFormatterStyle } from "../../src/Formatter/OutputFormatterStyle";
import { OutputFormatterStyleStack } from "../../src/Formatter/OutputFormatterStyleStack";

describe("OutputFormatterStyle", () => {

    it("should push", () => {
        const styleOne = new OutputFormatterStyle("white", "black");
        const styleTwo = new OutputFormatterStyle("yellow", "blue");
        const styleThree = new OutputFormatterStyle("green", "red");

        const stack = new OutputFormatterStyleStack();
        stack.push(styleOne);
        stack.push(styleTwo);
        expect(stack.peek()).toBe(styleTwo);
        stack.push(styleThree);
        expect(stack.peek()).toBe(styleThree);
    });

    it("should pop", () => {
        const styleOne = new OutputFormatterStyle("white", "black");
        const styleTwo = new OutputFormatterStyle("yellow", "blue");

        const stack = new OutputFormatterStyleStack();
        stack.push(styleOne);
        stack.push(styleTwo);

        expect(stack.pop()).toBe(styleTwo);
        expect(stack.pop()).toBe(styleOne);
    });

    it("should pop empty", () => {
        const stack = new OutputFormatterStyleStack();
        const style = stack.getEmptyStyle();

        expect(stack.pop()).toBe(style);
    });

    it("should pop until given style", () => {
        const styleOne = new OutputFormatterStyle("white", "black");
        const styleTwo = new OutputFormatterStyle("yellow", "blue");
        const styleThree = new OutputFormatterStyle("green", "red");
        const stack = new OutputFormatterStyleStack();

        stack.push(styleOne);
        stack.push(styleTwo);
        stack.push(styleThree);

        expect(stack.popUntil(styleTwo)).toBe(styleTwo);
        expect(stack.pop()).toBe(styleOne);
    });

    it("should pop latest on stack", () => {
        const styleOne = new OutputFormatterStyle("white", "black");
        const styleTwo = new OutputFormatterStyle("yellow", "blue");
        const styleThree = new OutputFormatterStyle("green", "red");
        const stack = new OutputFormatterStyleStack();

        stack.push(styleOne);
        stack.push(styleTwo);
        stack.push(styleThree);

        expect(stack.pop()).toBe(styleThree);
        expect(stack.pop()).toBe(styleTwo);
        expect(stack.pop()).toBe(styleOne);
        expect(stack.pop()).toBe(stack.getEmptyStyle());
    });

    it("should throw when trying to pop a style that is not on the stack", () => {
        expect(() => {
            const stack = new OutputFormatterStyleStack();
            stack.push(new OutputFormatterStyle("green", "red"));
            stack.popUntil(new OutputFormatterStyle("yellow", "black"));
        }).toThrow(RuntimeException);
    });
});
