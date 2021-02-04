/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { Normalizer } from "./Normalizer";
import { Question } from "./Question";

/**
 * Represents a confirmation question.
 */
export class ConfirmationQuestion extends Question<boolean> {

    protected expression: RegExp;

    /**
     * @param {string} question The question you have.
     * @param {boolean} defaultValue The question default value
     * @param {RegExp} expression The expression to check the input.
     */
    public constructor(question: string, defaultValue: boolean = false, expression: RegExp = /^y/i) {
        super(question, defaultValue);
        this.expression = expression;
        this.setNormalizer(this.getDefaultNormalizer());
    }

    private getDefaultNormalizer(): Normalizer<boolean> {
        const defaultValue = this.getDefault() ?? false;
        const { expression } = this;

        return (answer: unknown) => {
            if (typeof answer === "boolean") {
                return answer;
            } else if (typeof answer === "string") {
                const match = answer.match(expression);

                if (!defaultValue) {
                    return !!(answer && match);
                }

                return !!("" === answer || match);
            }

            return false;
        };
    }

}
