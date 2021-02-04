/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { HybridCollectionEntriesType } from "./HybridCollectionEntriesType";
import { HybridCollectionKeyType } from "./HybridCollectionKeyType";

export class HybridCollection<ValueType> extends Map<HybridCollectionKeyType, ValueType> {

    protected index: number = 0;

    public constructor(entries: HybridCollectionEntriesType<ValueType> = []) {
        super();
        for (const entry of entries) {
            if (Array.isArray(entry)) {
                this.set(entry[0], entry[1]);
            } else {
                this.add(entry as ValueType);
            }
        }
    }

    /**
     * Add values to the collection
     *
     * @param {ValueType} values
     */
    public add(...values: ValueType[]) {
        for (const value of values) {
            this.set(this.index++, value);
        }
    }

    /**
     * @inheritDoc
     */
    public clear(): void {
        super.clear();
        this.index = 0;
    }

    /**
     * Merge a collection into this collection
     *
     * @param {HybridCollection<ValueType>} otherCollection
     * @returns {HybridCollection<ValueType>}
     */
    public merge(otherCollection: HybridCollection<ValueType>) {
        const collection = this.resetKeys();

        for (const [key, value] of otherCollection.entries()) {
            if (typeof key === "number") {
                collection.add(value);
            } else {
                collection.set(key, value);
            }
        }

        return collection;
    }

    public find(value: unknown): HybridCollectionKeyType | null {
        for (const [key, item] of this.entries()) {
            if (value === item) {
                return key;
            }
        }

        return null;
    }

    private resetKeys(): HybridCollection<ValueType> {
        const collection = new HybridCollection<ValueType>();

        for (const [key, value] of this.entries()) {
            if (typeof key === "number") {
                collection.add(value);
            } else {
                collection.set(key, value);
            }
        }

        return collection;
    }

}
