/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

export enum OptionMode {

    /**
     * Do not accept input for this option (e.g. --foo). This is the default behavior of options.
     */
    VALUE_NONE = 1,

    /**
     * This value is required (e.g. --iterations=5 or -i5), the option itself is still optional.
     */
    VALUE_REQUIRED = 1 << 1,

    /**
     * This option may or may not have a value (e.g. --yell or --yell=loud).
     */
    VALUE_OPTIONAL = 1 << 2,

    /**
     * This option accepts multiple values (e.g. --foo=lorem --foo=ipsum).
     */
    VALUE_IS_ARRAY = 1 << 3,
}
