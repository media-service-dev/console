/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

export enum OutputMode {

    OUTPUT_NORMAL = 1,

    OUTPUT_RAW = 1 << 1,

    OUTPUT_PLAIN = 1 << 2,

    VERBOSITY_QUIET = 1 << 4,

    VERBOSITY_NORMAL = 1 << 5,

    VERBOSITY_VERBOSE = 1 << 6,

    VERBOSITY_VERY_VERBOSE = 1 << 7,

    VERBOSITY_DEBUG = 1 << 8,

}
