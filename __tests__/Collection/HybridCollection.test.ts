/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { HybridCollection } from "../../src/Collection/HybridCollection";

describe("HybridCollection tests", () => {

    it("should take constructor args", () => {
        const collection = new HybridCollection<string>(["foo", ["foo", "bar"], "bar", "baz"]);

        const keys = Array.from(collection.keys());
        const values = Array.from(collection.values());
        const entries = Array.from(collection.entries());

        expect(keys).toEqual([0, "foo", 1, 2]);
        expect(values).toEqual(["foo", "bar", "bar", "baz"]);
        expect(entries).toEqual([[0, "foo"], ["foo", "bar"], [1, "bar"], [2, "baz"]]);
    });

    it("should correctly delete", () => {
        const collection = new HybridCollection<string>(["foo", ["foo", "bar"], "bar", "baz"]);
        collection.delete(1);
        const entries = Array.from(collection.entries());
        expect(entries).toEqual([[0, "foo"], ["foo", "bar"], [2, "baz"]]);
    });

    it("should correctly reset", () => {
        const collection = new HybridCollection<string>(["foo", ["foo", "bar"], "bar", "baz"]);
        collection.delete(1);
        const resetedCollection = (collection as any).resetKeys();
        const entries = Array.from(resetedCollection.entries());
        expect(entries).toEqual([[0, "foo"], ["foo", "bar"], [1, "baz"]]);
    });

    it("should correctly merge", () => {
        const collection = new HybridCollection<string>(["foo", ["foo", "bar"], ["bar", "foo"], "baz"]);

        const merged = collection.merge(
            new HybridCollection<string>(
                [
                    "lorem",
                    ["foo", "newBar"],
                    "ipsum",
                ],
            ),
        );

        const entries = Array.from(merged.entries());
        expect(entries).toEqual([
            [0, "foo"],
            ["foo", "newBar"],
            ["bar", "foo"],
            [1, "baz"],
            [2, "lorem"],
            [3, "ipsum"],
        ]);
    });

});
