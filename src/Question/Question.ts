/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { ArgumentException } from "../Exception/ArgumentException";
import { Normalizer } from "./Normalizer";
import { Validator } from "./Validator";

/**
 * Represents a simple question.
 */
export class Question<Type> {

    protected message: string;

    protected defaultValue: Type | null = null;

    protected hidden: boolean = false;

    protected validator: Validator<Type> | null = null;

    protected normalizer: Normalizer<Type> | null = null;

    protected maxAttempts: number | null = null;

    protected prompt: string = ">";

    protected trimmable: boolean = true;

    /**
     * @param {string} question The question you have.
     * @param {Type | null} defaultValue The default value of the question, null for none.
     */
    public constructor(question: string, defaultValue: Type | null = null) {
        this.message = question;
        this.defaultValue = defaultValue;
    }

    /**
     * If the input will be trimmed
     *
     * @returns {boolean}
     */
    public isTrimmable(): boolean {
        return this.trimmable;
    }

    /**
     * Set if the input should be trimmed or not.
     *
     * @param {boolean} trimmable
     * @returns {this}
     */
    public setTrimmable(trimmable: boolean): this {
        this.trimmable = trimmable;

        return this;
    }

    /**
     * Returns the configured prompt of the current question.
     *
     * @returns {string} The prompt.
     */
    public getPrompt(): string {
        return this.prompt;
    }

    /**
     * Set the prompt for the question.
     *
     * @param {string} prompt The prompt.
     * @returns {this}
     */
    public setPrompt(prompt: string): this {
        this.prompt = prompt;

        return this;
    }

    /**
     * Returns the maximum amount of attempts to ask again this question if the validation fails.
     *
     * @returns {number|null} The amount of attempts.
     */
    public getMaxAttempts(): number | null {
        return this.maxAttempts;
    }

    /**
     * Set the maximum amount of attempts to ask again this question if the validation fails.
     *
     * @param {number} maxAttempts The amount of attempts, the number must be positive.
     * @returns {this}
     */
    public setMaxAttempts(maxAttempts: number | null): this {
        if (maxAttempts !== null) {
            if (maxAttempts <= -1) {
                throw new ArgumentException("Max attempts must be positive.");
            }
        }

        this.maxAttempts = maxAttempts;

        return this;
    }

    /**
     * Returns the question message.
     *
     * @returns {string} The message.
     */
    public getMessage() {
        return this.message;
    }

    /**
     * Returns the default value of the question, null for none.
     *
     * @returns {Type | null}
     */
    public getDefault() {
        return this.defaultValue;
    }

    /**
     * If the input should be visible to the user.
     *
     * @returns {boolean}
     */
    public isHidden() {
        return this.hidden;
    }

    /**
     * Set if the input should be visible to the user.
     *
     * @param {boolean} hidden
     * @returns {this}
     */
    public setHidden(hidden: boolean): this {
        this.hidden = hidden;

        return this;
    }

    /**
     * Returns the validator arrow function.
     *
     * @returns {Validator<Type> | null} The validator arrow function, can be null.
     */
    public getValidator(): Validator<Type> | null {
        return this.validator;
    }

    /**
     * Set the validator arrow function.
     *
     * @param {Validator<Type> | null} validator The validator arrow function, can be null.
     * @returns {this}
     */
    public setValidator(validator: Validator<Type> | null): this {
        this.validator = validator;

        return this;
    }

    /**
     * Returns the normalizer arrow function.
     *
     * @returns {Normalizer<Type> | null} The normalizer arrow function, can be null.
     */
    public getNormalizer(): Normalizer<Type> | null {
        return this.normalizer;
    }

    /**
     * Set the normalizer arrow function.
     *
     * @param {Normalizer<Type> | null} value The normalizer arrow function, can be null.
     * @returns {this}
     */
    public setNormalizer(value: Normalizer<Type> | null): this {
        this.normalizer = value;

        return this;
    }

}
