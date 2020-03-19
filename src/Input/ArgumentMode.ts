/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

export enum ArgumentMode {

    /**
     * The argument is mandatory. The command doesn't run if the argument isn't provided.
     */
    REQUIRED = 1,

    /**
     * The argument is optional and therefore can be omitted. This is the default behavior of arguments.
     */
    OPTIONAL = 1 << 1,

    /**
     * The argument can contain any number of values. For that reason, it must be used at the end of the argument list.
     */
    IS_ARRAY = 1 << 2,

}
