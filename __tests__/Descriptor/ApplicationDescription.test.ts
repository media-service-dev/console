/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import each from "jest-each";

import { Command } from "../../src/Command/Command";
import { ApplicationDescription } from "../../src/Descriptor/ApplicationDescription";
import { TestApplication } from "./Mock/TestApplication";

describe("ApplicationDescription", () => {

    each([
        [["_global"], ["foobar"]],
        [["a", "b"], ["b:foo", "a:foo", "b:bar"]],
        [["_global", "b", "z", "22", "33"], ["z:foo", "1", "33:foo", "b:foo", "22:foo:bar"]],
    ]).it("should return namespaces", (expected, names) => {
        // Arrange
        const application = new TestApplication();

        for (const name of names) {
            application.add(new Command(name));
        }

        const description = new ApplicationDescription(application);

        // Act
        const actual = description.getNamespaces();

        // Assert
        expect(Array.from(actual.keys())).toEqual(expected);
    });

});
