/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import * as util from "util";

import { ArgumentException } from "../Exception/ArgumentException";
import { LogicException } from "../Exception/LogicException";
import { Question } from "./Question";
import { Validator } from "./Validator";

/**
 * Represents a choice question.
 */
export class ChoiceQuestion extends Question<string | string[]> {

    protected choices: Map<string, string>;

    protected multiselect: boolean = false;

    protected errorMessage: string = "Value \"%s\" is invalid";

    protected simple: boolean = false;

    /**
     * @param {string} question The question you have.
     * @param {Choices} choices The choices you can select.
     * @param defaultChoice
     */
    public constructor(question: string, choices: string[] | [string, string][] | Map<string, string>, defaultChoice: string | string[] | null = null) {
        super(question);
        this.defaultValue = defaultChoice;
        if (choices instanceof Map) {
            this.choices = choices;
            this.simple = this.isSimpleMap();
        } else if (this.isSimpleChoices(choices)) {
            this.choices = new Map<string, string>(choices.map(item => [item, item]));
            this.simple = true;
        } else {
            this.choices = new Map<string, string>(choices);
        }
        if (!this.choices.size) {
            throw new LogicException("Choice question must have at least 1 choice available.");
        }
        this.setValidator(this.getDefaultValidator());
    }

    /**
     * If you can select multiple values.
     *
     * @returns {boolean}
     */
    public isMultiselect() {
        return this.multiselect;
    }

    /**
     * Set if you can select multiple values.
     *
     * @param {boolean} multiselect
     * @returns {this}
     */
    public setMultiselect(multiselect: boolean): this {
        this.multiselect = multiselect;

        return this;
    }

    /**
     * Set the error message.
     * @param message
     */
    public setErrorMessage(message: string): this {
        this.errorMessage = message;

        return this;
    }

    public getChoices(): Map<string, string> {
        return this.choices;
    }

    public isSimple() {
        return this.simple;
    }

    protected isSimpleChoices(choices: unknown[]): choices is string[] {
        return Array.isArray(choices) && choices.every((item: unknown) => typeof item === "string");
    }

    protected isSimpleMap() {
        for (const [key, value] of this.choices) {
            if (key !== value) {
                return false;
            }
        }

        return true;
    }

    private getDefaultValidator(): Validator<string | string[]> {
        return (selected: string | string[] | null) => {
            if (null === selected) {
                throw new ArgumentException(util.format(this.errorMessage, "null"));
            }

            const isMultiselect = this.isMultiselect();
            const isTrimmable = this.isTrimmable();
            const isSimple = this.simple;
            const choices = this.getChoices();
            const flippedChoices = new Map(Array.from(choices.entries()).map(([key, value]) => [value, key]));

            const validateSelection = (value: string) => {
                if (!value.match(/^[^,]+(?:,[^,]+)*$/)) {
                    throw new ArgumentException(util.format(this.errorMessage, value));
                }

                return value.split(",");
            };

            let selectedChoices: string[];

            if (isMultiselect) {
                selectedChoices = validateSelection(selected as string);
            } else {
                selectedChoices = Array.isArray(selected) ? selected : [selected];
            }

            if (isTrimmable) {
                selectedChoices = selectedChoices.map((item: string) => {
                    return item.trim();
                });
            }

            const multiselectChoices: string[] = [];

            for (const item of selectedChoices) {
                const results = [];

                for (const [choiceKey, choice] of choices.entries()) {
                    if (choice === item) {
                        results.push(choiceKey);
                    }
                }

                if (results.length > 1) {
                    throw new ArgumentException(util.format("The provided answer is ambiguous. Value should be one of %s.", results.join(" or ")));
                }

                if (isSimple) {
                    if (choices.has(item)) {
                        multiselectChoices.push(item);
                        continue;
                    }
                } else {
                    if (choices.has(item)) {
                        multiselectChoices.push(item);
                        continue;
                    }

                    const key = flippedChoices.get(item);

                    if (key && choices.has(key)) {
                        multiselectChoices.push(key);
                        continue;
                    }
                }

                throw new ArgumentException(util.format(this.errorMessage, item));
            }

            if (isMultiselect) {
                return multiselectChoices;
            }

            const [first] = multiselectChoices;

            return first;
        };
    }

}
