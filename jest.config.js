/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testRegex: "(/__tests__/.*)\\.test\\.ts$",
    collectCoverageFrom: [
        "./src/**/*.ts",
    ],
    onlyChanged: false,
};
