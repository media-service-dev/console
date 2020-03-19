/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { CommandInterface } from "../../src/Command/CommandInterface";
import { ArgumentDefinition } from "../../src/Input/ArgumentDefinition";
import { ArgumentMode } from "../../src/Input/ArgumentMode";
import { InputDefinition } from "../../src/Input/InputDefinition";
import { OptionDefinition } from "../../src/Input/OptionDefinition";
import { OptionMode } from "../../src/Input/OptionMode";
import { DescriptorApplication1 } from "./Mock/DescriptorApplication1";
import { DescriptorApplication2 } from "./Mock/DescriptorApplication2";
import { DescriptorCommand1 } from "./Mock/DescriptorCommand1";
import { DescriptorCommand2 } from "./Mock/DescriptorCommand2";

export class TestDataProvider {

    public static getArgumentDefinitions(): [ArgumentDefinition, string, object][] {
        return [
            [new ArgumentDefinition("argumentName", ArgumentMode.REQUIRED), "<info>argumentName</info>", {
                name: "argumentName",
                isRequired: true,
                isArray: false,
                description: "",
                "default": null,
            }],
            [new ArgumentDefinition("argumentName", ArgumentMode.IS_ARRAY, "argument description"), "<info>argumentName</info>  argument description", {
                name: "argumentName",
                isRequired: false,
                isArray: true,
                description: "argument description",
                "default": [],
            }],
            [new ArgumentDefinition("argumentName", ArgumentMode.OPTIONAL, "argument description", "default_value"), "<info>argumentName</info>  argument description<comment> [default: \"default_value\"]</comment>", {
                name: "argumentName",
                isRequired: false,
                isArray: false,
                description: "argument description",
                "default": "default_value",
            }],
            [new ArgumentDefinition("argumentName", ArgumentMode.REQUIRED, "multiline\nargument description"), "<info>argumentName</info>  multiline\n                argument description", {
                name: "argumentName",
                isRequired: true,
                isArray: false,
                description: "multiline argument description",
                "default": null,
            }],
            [new ArgumentDefinition("argumentName", ArgumentMode.OPTIONAL, "argument description", "<comment>style</>"), "<info>argumentName</info>  argument description<comment> [default: \"\\<comment>style\\</>\"]</comment>", {
                name: "argumentName",
                isRequired: false,
                isArray: false,
                description: "argument description",
                "default": "<comment>style</>",
            }],
            [new ArgumentDefinition("argumentName", ArgumentMode.OPTIONAL, "argument description", Infinity as any), "<info>argumentName</info>  argument description<comment> [default: INF]</comment>", {
                name: "argumentName",
                isRequired: false,
                isArray: false,
                description: "argument description",
                "default": "INF",
            }],
        ];
    }

    public static getOptionDefinitions(): [OptionDefinition, string, object][] {
        return [
            [new OptionDefinition("optionName", "o", OptionMode.VALUE_NONE), "<info>-o, --optionName</info>", {
                name: "--optionName",
                shortcut: "-o",
                acceptValue: false,
                isValueRequired: false,
                isMultiple: false,
                description: "",
                "default": false,
            }],
            [new OptionDefinition("optionName", "o", OptionMode.VALUE_OPTIONAL, "option description", "default_value"), "<info>-o, --optionName[=OPTIONNAME]</info>  option description<comment> [default: \"default_value\"]</comment>", {
                name: "--optionName",
                shortcut: "-o",
                acceptValue: true,
                isValueRequired: false,
                isMultiple: false,
                description: "option description",
                "default": "default_value",
            }],
            [new OptionDefinition("optionName", "o", OptionMode.VALUE_REQUIRED, "option description"), "<info>-o, --optionName=OPTIONNAME</info>  option description", {
                name: "--optionName",
                shortcut: "-o",
                acceptValue: true,
                isValueRequired: true,
                isMultiple: false,
                description: "option description",
                "default": null,
            }],
            [new OptionDefinition("optionName", "o", OptionMode.VALUE_IS_ARRAY | OptionMode.VALUE_OPTIONAL, "option description", []), "<info>-o, --optionName[=OPTIONNAME]</info>  option description <comment>(multiple values allowed)</comment>", {
                name: "--optionName",
                shortcut: "-o",
                acceptValue: true,
                isValueRequired: false,
                isMultiple: true,
                description: "option description",
                "default": [],
            }],
            [new OptionDefinition("optionName", "o", OptionMode.VALUE_REQUIRED, "multiline\noption description"), "<info>-o, --optionName=OPTIONNAME</info>  multiline\n                               option description", {
                name: "--optionName",
                shortcut: "-o",
                acceptValue: true,
                isValueRequired: true,
                isMultiple: false,
                description: "multiline option description",
                "default": null,
            }],
            [new OptionDefinition("optionName", ["o", "O"], OptionMode.VALUE_REQUIRED, "option with multiple shortcuts"), "<info>-o|O, --optionName=OPTIONNAME</info>  option with multiple shortcuts", {
                name: "--optionName",
                shortcut: "-o|-O",
                acceptValue: true,
                isValueRequired: true,
                isMultiple: false,
                description: "option with multiple shortcuts",
                "default": null,
            }],
            [new OptionDefinition("optionName", "o", OptionMode.VALUE_REQUIRED, "option description", "<comment>style</>"), "<info>-o, --optionName=OPTIONNAME</info>  option description<comment> [default: \"\\<comment>style\\</>\"]</comment>", {
                name: "--optionName",
                shortcut: "-o",
                acceptValue: true,
                isValueRequired: true,
                isMultiple: false,
                description: "option description",
                "default": "<comment>style</>",
            }],
            [new OptionDefinition("optionName", "o", OptionMode.VALUE_IS_ARRAY | OptionMode.VALUE_REQUIRED, "option description", ["<comment>Hello</comment>", "<info>world</info>"]), "<info>-o, --optionName=OPTIONNAME</info>  option description<comment> [default: [\"\\<comment>Hello\\</comment>\",\"\\<info>world\\</info>\"]]</comment> <comment>(multiple values allowed)</comment>", {
                name: "--optionName",
                shortcut: "-o",
                acceptValue: true,
                isValueRequired: true,
                isMultiple: true,
                description: "option description",
                "default": [
                    "<comment>Hello</comment>",
                    "<info>world</info>",
                ],
            }],
            [new OptionDefinition("optionName", "o", OptionMode.VALUE_OPTIONAL, "option description", Infinity as any), "<info>-o, --optionName[=OPTIONNAME]</info>  option description<comment> [default: INF]</comment>", {
                name: "--optionName",
                shortcut: "-o",
                acceptValue: true,
                isValueRequired: false,
                isMultiple: false,
                description: "option description",
                "default": "INF",
            }],
        ];
    }

    public static getInputDefinitions(): [InputDefinition, string, object][] {
        return [
            [new InputDefinition(), "", {
                arguments: {},
                options: {},
            }],
            [new InputDefinition([new ArgumentDefinition("argumentName", ArgumentMode.REQUIRED)]), "<comment>Arguments:</comment>\n  <info>argumentName</info>", {
                arguments: {
                    argumentName: {
                        name: "argumentName",
                        isRequired: true,
                        isArray: false,
                        description: "",
                        "default": null,
                    },
                },
                options: {},
            }],
            [new InputDefinition([new OptionDefinition("optionName", "o", OptionMode.VALUE_NONE)]), "<comment>Options:</comment>\n  <info>-o, --optionName</info>", {
                arguments: {},
                options: {
                    optionName: {
                        name: "--optionName",
                        shortcut: "-o",
                        acceptValue: false,
                        isValueRequired: false,
                        isMultiple: false,
                        description: "",
                        "default": false,
                    },
                },
            }],
            [new InputDefinition([
                new ArgumentDefinition("argumentName", ArgumentMode.REQUIRED),
                new OptionDefinition("optionName", "o", OptionMode.VALUE_NONE),
            ]), "<comment>Arguments:</comment>\n  <info>argumentName</info>      \n\n<comment>Options:</comment>\n  <info>-o, --optionName</info>", {
                arguments: {
                    argumentName: {
                        name: "argumentName",
                        isRequired: true,
                        isArray: false,
                        description: "",
                        "default": null,
                    },
                },
                options: {
                    optionName: {
                        name: "--optionName",
                        shortcut: "-o",
                        acceptValue: false,
                        isValueRequired: false,
                        isMultiple: false,
                        description: "",
                        "default": false,
                    },
                },
            }],
        ];
    }

    public static getCommands(): [CommandInterface, string, object][] {
        return [
            [new DescriptorCommand1(), "<comment>Description:</comment>\n  command 1 description\n\n<comment>Usage:</comment>\n  descriptor:command1\n  alias1\n  alias2\n\n<comment>Help:</comment>\n  command 1 help", {
                name: "descriptor:command1",
                hidden: false,
                usage: [
                    "descriptor:command1",
                    "alias1",
                    "alias2",
                ],
                description: "command 1 description",
                help: "command 1 help",
                definition: {
                    arguments: {},
                    options: {},
                },
            }],
            [new DescriptorCommand2(), "<comment>Description:</comment>\n  command 2 description\n\n<comment>Usage:</comment>\n  descriptor:command2 [options] [--] \\<argumentName>\n  descriptor:command2 -o|--optionName \\<argumentName>\n  descriptor:command2 \\<argumentName>\n\n<comment>Arguments:</comment>\n  <info>argumentName</info>      \n\n<comment>Options:</comment>\n  <info>-o, --optionName</info>  \n\n<comment>Help:</comment>\n  command 2 help",
                {
                    name: "descriptor:command2",
                    hidden: false,
                    usage: [
                        "descriptor:command2 [-o|--optionName] [--] <argumentName>",
                        "descriptor:command2 -o|--optionName <argumentName>",
                        "descriptor:command2 <argumentName>",
                    ],
                    description: "command 2 description",
                    help: "command 2 help",
                    definition: {
                        arguments: {
                            argumentName: {
                                name: "argumentName",
                                isRequired: true,
                                isArray: false,
                                description: "",
                                "default": null,
                            },
                        },
                        options: {
                            optionName: {
                                name: "--optionName",
                                shortcut: "-o",
                                acceptValue: false,
                                isValueRequired: false,
                                isMultiple: false,
                                description: "",
                                "default": false,
                            },
                        },
                    },
                }],
        ];
    }

    public static getApplications() {
        return [
            [new DescriptorApplication1(), "UNKNOWN <info>0.1.0</info>\n" +
            "\n" +
            "<comment>Usage:</comment>\n" +
            "  command [options] [arguments]\n" +
            "\n" +
            "<comment>Options:</comment>\n" +
            "  <info>    --ansi</info>            Force ANSI output\n" +
            "  <info>    --no-ansi</info>         Disable ANSI output\n" +
            "  <info>-h, --help</info>            Display this help message\n" +
            "  <info>-q, --quiet</info>           Do not output any message\n" +
            "  <info>-V, --version</info>         Display this application version\n" +
            "  <info>-n, --no-interaction</info>  Do not ask any interactive question\n" +
            "  <info>-v|vv|vvv, --verbose</info>  Increase the verbosity of messages: 1 for normal output, 2 for more verbose output and 3 for debug\n" +
            "\n" +
            "<comment>Available commands:</comment>\n" +
            "  <info>help</info>  Displays help for a command\n" +
            "  <info>list</info>  Lists commands", {
                application: {
                    name: "UNKNOWN",
                    version: "0.1.0",
                },
                commands: [
                    {

                        name: "help",
                        hidden: false,
                        usage: [
                            "help [--format FORMAT] [--raw] [--] [<commandName>]",
                        ],
                        description: "Displays help for a command",
                        help: "The <info>help</info> command displays help for a given command:\n\n  <info>node bin/console help list</info>\n\nYou can also output the help in other formats by using the <comment>--format</comment> option:\n\n  <info>node bin/console help --format=json list</info>\n\nTo display the list of available commands, please use the <info>list</info> command.",
                        definition: {
                            arguments: {
                                commandName: {
                                    name: "commandName",
                                    isRequired: false,
                                    isArray: false,
                                    description: "The command name",
                                    "default": "help",
                                },
                            },
                            options: {
                                format: {
                                    name: "--format",
                                    shortcut: "",
                                    acceptValue: true,
                                    isValueRequired: true,
                                    isMultiple: false,
                                    description: "The output format (txt or json)",
                                    "default": "txt",
                                },
                                raw: {
                                    name: "--raw",
                                    shortcut: "",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "To output raw command help",
                                    "default": false,
                                },
                                help: {
                                    name: "--help",
                                    shortcut: "-h",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Display this help message",
                                    "default": false,
                                },
                                quiet: {
                                    name: "--quiet",
                                    shortcut: "-q",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Do not output any message",
                                    "default": false,
                                },
                                verbose: {
                                    name: "--verbose",
                                    shortcut: "-v|-vv|-vvv",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Increase the verbosity of messages: 1 for normal output, 2 for more verbose output and 3 for debug",
                                    "default": false,
                                },
                                version: {
                                    name: "--version",
                                    shortcut: "-V",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Display this application version",
                                    "default": false,
                                },
                                ansi: {
                                    name: "--ansi",
                                    shortcut: "",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Force ANSI output",
                                    "default": false,
                                },
                                "no-ansi": {
                                    name: "--no-ansi",
                                    shortcut: "",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Disable ANSI output",
                                    "default": false,
                                },
                                "no-interaction": {
                                    name: "--no-interaction",
                                    shortcut: "-n",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Do not ask any interactive question",
                                    "default": false,
                                },
                            },
                        },
                    },
                    {
                        name: "list",
                        hidden: false,
                        usage: [
                            "list [--raw] [--format FORMAT] [--] [<namespace>]",
                        ],
                        description: "Lists commands",
                        help: "The <info>list</info> command lists all commands:\n\n  <info>node bin/console list</info>\n\nYou can also display the commands for a specific namespace:\n\n  <info>node bin/console list test</info>\n\nYou can also output the information in other formats by using the <comment>--format</comment> option:\n\n  <info>node bin/console list --format=json</info>\n\nIt's also possible to get raw list of commands (useful for embedding command runner):\n\n  <info>node bin/console list --raw</info>",
                        definition: {
                            arguments: {
                                namespace: {
                                    name: "namespace",
                                    isRequired: false,
                                    isArray: false,
                                    description: "The namespace name",
                                    "default": null,
                                },
                            },
                            options: {
                                ansi: {
                                    acceptValue: false,
                                    "default": false,
                                    description: "Force ANSI output",
                                    isMultiple: false,
                                    isValueRequired: false,
                                    name: "--ansi",
                                    shortcut: "",
                                },
                                raw: {
                                    name: "--raw",
                                    shortcut: "",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "To output raw command list",
                                    "default": false,
                                },
                                format: {
                                    name: "--format",
                                    shortcut: "",
                                    acceptValue: true,
                                    isValueRequired: true,
                                    isMultiple: false,
                                    description: "The output format (txt or json)",
                                    "default": "txt",
                                },
                                help: {
                                    acceptValue: false,
                                    "default": false,
                                    description: "Display this help message",
                                    isMultiple: false,
                                    isValueRequired: false,
                                    name: "--help",
                                    shortcut: "-h",
                                },
                                "no-ansi": {
                                    acceptValue: false,
                                    "default": false,
                                    description: "Disable ANSI output",
                                    isMultiple: false,
                                    isValueRequired: false,
                                    name: "--no-ansi",
                                    shortcut: "",
                                },
                                "no-interaction": {
                                    acceptValue: false,
                                    "default": false,
                                    description: "Do not ask any interactive question",
                                    isMultiple: false,
                                    isValueRequired: false,
                                    name: "--no-interaction",
                                    shortcut: "-n",
                                },
                                quiet: {
                                    acceptValue: false,
                                    "default": false,
                                    description: "Do not output any message",
                                    isMultiple: false,
                                    isValueRequired: false,
                                    name: "--quiet",
                                    shortcut: "-q",
                                },
                                verbose: {
                                    acceptValue: false,
                                    "default": false,
                                    description: "Increase the verbosity of messages: 1 for normal output, 2 for more verbose output and 3 for debug",
                                    isMultiple: false,
                                    isValueRequired: false,
                                    name: "--verbose",
                                    shortcut: "-v|-vv|-vvv",
                                },
                                version: {
                                    acceptValue: false,
                                    "default": false,
                                    description: "Display this application version",
                                    isMultiple: false,
                                    isValueRequired: false,
                                    name: "--version",
                                    shortcut: "-V",
                                },
                            },
                        },
                    },
                ],
                namespaces: [
                    {
                        id: "_global",
                        commands: [
                            "help",
                            "list",
                        ],
                    },
                ],
            }],
            [new DescriptorApplication2(), "Foo bar <info>1.0.0</info>\n" +
            "\n" +
            "<comment>Usage:</comment>\n" +
            "  command [options] [arguments]\n" +
            "\n" +
            "<comment>Options:</comment>\n" +
            "  <info>    --ansi</info>            Force ANSI output\n" +
            "  <info>    --no-ansi</info>         Disable ANSI output\n" +
            "  <info>-h, --help</info>            Display this help message\n" +
            "  <info>-q, --quiet</info>           Do not output any message\n" +
            "  <info>-V, --version</info>         Display this application version\n" +
            "  <info>-n, --no-interaction</info>  Do not ask any interactive question\n" +
            "  <info>-v|vv|vvv, --verbose</info>  Increase the verbosity of messages: 1 for normal output, 2 for more verbose output and 3 for debug\n" +
            "\n" +
            "<comment>Available commands:</comment>\n" +
            "  <info>help</info>                 Displays help for a command\n" +
            "  <info>list</info>                 Lists commands\n" +
            " <comment>descriptor</comment>\n" +
            "  <info>descriptor:command1</info>  [alias1|alias2] command 1 description\n" +
            "  <info>descriptor:command2</info>  command 2 description\n" +
            "  <info>descriptor:command4</info>  [descriptor:aliasCommand4|command4:descriptor]", {
                application: {
                    name: "Foo bar",
                    version: "1.0.0",
                },
                commands: [
                    {
                        name: "help",
                        hidden: false,
                        usage: [
                            "help [--format FORMAT] [--raw] [--] [<commandName>]",
                        ],
                        description: "Displays help for a command",
                        help: "The <info>help</info> command displays help for a given command:\n\n  <info>node bin/console help list</info>\n\nYou can also output the help in other formats by using the <comment>--format</comment> option:\n\n  <info>node bin/console help --format=json list</info>\n\nTo display the list of available commands, please use the <info>list</info> command.",
                        definition: {
                            arguments: {
                                commandName: {
                                    name: "commandName",
                                    isRequired: false,
                                    isArray: false,
                                    description: "The command name",
                                    "default": "help",
                                },
                            },
                            options: {
                                format: {
                                    name: "--format",
                                    shortcut: "",
                                    acceptValue: true,
                                    isValueRequired: true,
                                    isMultiple: false,
                                    description: "The output format (txt or json)",
                                    "default": "txt",
                                },
                                raw: {
                                    name: "--raw",
                                    shortcut: "",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "To output raw command help",
                                    "default": false,
                                },
                                ansi: {
                                    name: "--ansi",
                                    shortcut: "",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Force ANSI output",
                                    "default": false,
                                },
                                "no-ansi": {
                                    name: "--no-ansi",
                                    shortcut: "",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Disable ANSI output",
                                    "default": false,
                                },
                                help: {
                                    name: "--help",
                                    shortcut: "-h",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Display this help message",
                                    "default": false,
                                },
                                quiet: {
                                    name: "--quiet",
                                    shortcut: "-q",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Do not output any message",
                                    "default": false,
                                },
                                verbose: {
                                    name: "--verbose",
                                    shortcut: "-v|-vv|-vvv",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Increase the verbosity of messages: 1 for normal output, 2 for more verbose output and 3 for debug",
                                    "default": false,
                                },
                                version: {
                                    name: "--version",
                                    shortcut: "-V",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Display this application version",
                                    "default": false,
                                },
                                "no-interaction": {
                                    name: "--no-interaction",
                                    shortcut: "-n",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Do not ask any interactive question",
                                    "default": false,
                                },
                            },
                        },
                    },
                    {
                        name: "list",
                        hidden: false,
                        usage: [
                            "list [--raw] [--format FORMAT] [--] [<namespace>]",
                        ],
                        description: "Lists commands",
                        help: "The <info>list</info> command lists all commands:\n\n  <info>node bin/console list</info>\n\nYou can also display the commands for a specific namespace:\n\n  <info>node bin/console list test</info>\n\nYou can also output the information in other formats by using the <comment>--format</comment> option:\n\n  <info>node bin/console list --format=json</info>\n\nIt's also possible to get raw list of commands (useful for embedding command runner):\n\n  <info>node bin/console list --raw</info>",
                        definition: {
                            arguments: {
                                namespace: {
                                    name: "namespace",
                                    isRequired: false,
                                    isArray: false,
                                    description: "The namespace name",
                                    "default": null,
                                },
                            },
                            options: {
                                ansi: {
                                    acceptValue: false,
                                    "default": false,
                                    description: "Force ANSI output",
                                    isMultiple: false,
                                    isValueRequired: false,
                                    name: "--ansi",
                                    shortcut: "",
                                },
                                raw: {
                                    name: "--raw",
                                    shortcut: "",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "To output raw command list",
                                    "default": false,
                                },
                                format: {
                                    name: "--format",
                                    shortcut: "",
                                    acceptValue: true,
                                    isValueRequired: true,
                                    isMultiple: false,
                                    description: "The output format (txt or json)",
                                    "default": "txt",
                                },
                                help: {
                                    acceptValue: false,
                                    "default": false,
                                    description: "Display this help message",
                                    isMultiple: false,
                                    isValueRequired: false,
                                    name: "--help",
                                    shortcut: "-h",
                                },
                                "no-ansi": {
                                    acceptValue: false,
                                    "default": false,
                                    description: "Disable ANSI output",
                                    isMultiple: false,
                                    isValueRequired: false,
                                    name: "--no-ansi",
                                    "shortcut": "",
                                },
                                "no-interaction": {
                                    acceptValue: false,
                                    "default": false,
                                    description: "Do not ask any interactive question",
                                    isMultiple: false,
                                    isValueRequired: false,
                                    name: "--no-interaction",
                                    shortcut: "-n",
                                },
                                quiet: {
                                    acceptValue: false,
                                    "default": false,
                                    description: "Do not output any message",
                                    isMultiple: false,
                                    isValueRequired: false,
                                    name: "--quiet",
                                    shortcut: "-q",
                                },
                                verbose: {
                                    acceptValue: false,
                                    "default": false,
                                    description: "Increase the verbosity of messages: 1 for normal output, 2 for more verbose output and 3 for debug",
                                    isMultiple: false,
                                    isValueRequired: false,
                                    name: "--verbose",
                                    shortcut: "-v|-vv|-vvv",
                                },
                                version: {
                                    acceptValue: false,
                                    "default": false,
                                    description: "Display this application version",
                                    isMultiple: false,
                                    isValueRequired: false,
                                    name: "--version",
                                    shortcut: "-V",
                                },
                            },
                        },
                    },
                    {
                        name: "descriptor:command1",
                        hidden: false,
                        usage: [
                            "descriptor:command1",
                            "alias1",
                            "alias2",
                        ],
                        description: "command 1 description",
                        help: "command 1 help",
                        definition: {
                            arguments: {},
                            options: {
                                ansi: {
                                    name: "--ansi",
                                    shortcut: "",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Force ANSI output",
                                    "default": false,
                                },
                                "no-ansi": {
                                    name: "--no-ansi",
                                    shortcut: "",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Disable ANSI output",
                                    "default": false,
                                },
                                help: {
                                    name: "--help",
                                    shortcut: "-h",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Display this help message",
                                    "default": false,
                                },
                                quiet: {
                                    name: "--quiet",
                                    shortcut: "-q",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Do not output any message",
                                    "default": false,
                                },
                                verbose: {
                                    name: "--verbose",
                                    shortcut: "-v|-vv|-vvv",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Increase the verbosity of messages: 1 for normal output, 2 for more verbose output and 3 for debug",
                                    "default": false,
                                },
                                version: {
                                    name: "--version",
                                    shortcut: "-V",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Display this application version",
                                    "default": false,
                                },
                                "no-interaction": {
                                    name: "--no-interaction",
                                    shortcut: "-n",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Do not ask any interactive question",
                                    "default": false,
                                },
                            },
                        },
                    },
                    {
                        name: "descriptor:command2",
                        hidden: false,
                        usage: [
                            "descriptor:command2 [-o|--optionName] [--] <argumentName>",
                            "descriptor:command2 -o|--optionName <argumentName>",
                            "descriptor:command2 <argumentName>",
                        ],
                        description: "command 2 description",
                        help: "command 2 help",
                        definition: {
                            arguments: {
                                argumentName: {
                                    name: "argumentName",
                                    isRequired: true,
                                    isArray: false,
                                    description: "",
                                    "default": null,
                                },
                            },
                            options: {
                                optionName: {
                                    name: "--optionName",
                                    shortcut: "-o",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "",
                                    "default": false,
                                },
                                help: {
                                    name: "--help",
                                    shortcut: "-h",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Display this help message",
                                    "default": false,
                                },
                                quiet: {
                                    name: "--quiet",
                                    shortcut: "-q",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Do not output any message",
                                    "default": false,
                                },
                                verbose: {
                                    name: "--verbose",
                                    shortcut: "-v|-vv|-vvv",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Increase the verbosity of messages: 1 for normal output, 2 for more verbose output and 3 for debug",
                                    "default": false,
                                },
                                version: {
                                    name: "--version",
                                    shortcut: "-V",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Display this application version",
                                    "default": false,
                                },
                                ansi: {
                                    name: "--ansi",
                                    shortcut: "",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Force ANSI output",
                                    "default": false,
                                },
                                "no-ansi": {
                                    name: "--no-ansi",
                                    shortcut: "",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Disable ANSI output",
                                    "default": false,
                                },
                                "no-interaction": {
                                    name: "--no-interaction",
                                    shortcut: "-n",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Do not ask any interactive question",
                                    "default": false,
                                },
                            },
                        },
                    },
                    {
                        name: "descriptor:command3",
                        hidden: true,
                        usage: [
                            "descriptor:command3",
                        ],
                        description: "command 3 description",
                        help: "command 3 help",
                        definition: {
                            arguments: {},
                            options: {
                                help: {
                                    name: "--help",
                                    shortcut: "-h",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Display this help message",
                                    "default": false,
                                },
                                quiet: {
                                    name: "--quiet",
                                    shortcut: "-q",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Do not output any message",
                                    "default": false,
                                },
                                verbose: {
                                    name: "--verbose",
                                    shortcut: "-v|-vv|-vvv",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Increase the verbosity of messages: 1 for normal output, 2 for more verbose output and 3 for debug",
                                    "default": false,
                                },
                                version: {
                                    name: "--version",
                                    shortcut: "-V",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Display this application version",
                                    "default": false,
                                },
                                ansi: {
                                    name: "--ansi",
                                    shortcut: "",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Force ANSI output",
                                    "default": false,
                                },
                                "no-ansi": {
                                    name: "--no-ansi",
                                    shortcut: "",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Disable ANSI output",
                                    "default": false,
                                },
                                "no-interaction": {
                                    name: "--no-interaction",
                                    shortcut: "-n",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Do not ask any interactive question",
                                    "default": false,
                                },
                            },
                        },
                    },
                    {
                        name: "descriptor:command4",
                        hidden: false,
                        usage: [
                            "descriptor:command4",
                            "descriptor:aliasCommand4",
                            "command4:descriptor",
                        ],
                        description: null,
                        help: "",
                        definition: {
                            arguments: {},
                            options: {
                                help: {
                                    name: "--help",
                                    shortcut: "-h",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Display this help message",
                                    "default": false,
                                },
                                quiet: {
                                    name: "--quiet",
                                    shortcut: "-q",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Do not output any message",
                                    "default": false,
                                },
                                verbose: {
                                    name: "--verbose",
                                    shortcut: "-v|-vv|-vvv",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Increase the verbosity of messages: 1 for normal output, 2 for more verbose output and 3 for debug",
                                    "default": false,
                                },
                                version: {
                                    name: "--version",
                                    shortcut: "-V",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Display this application version",
                                    "default": false,
                                },
                                ansi: {
                                    name: "--ansi",
                                    shortcut: "",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Force ANSI output",
                                    "default": false,
                                },
                                "no-ansi": {
                                    name: "--no-ansi",
                                    shortcut: "",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Disable ANSI output",
                                    "default": false,
                                },
                                "no-interaction": {
                                    name: "--no-interaction",
                                    shortcut: "-n",
                                    acceptValue: false,
                                    isValueRequired: false,
                                    isMultiple: false,
                                    description: "Do not ask any interactive question",
                                    "default": false,
                                },
                            },
                        },
                    },
                ],
                namespaces: [
                    {
                        id: "_global",
                        commands: [
                            "alias1",
                            "alias2",
                            "help",
                            "list",
                        ],
                    },
                    {
                        id: "command4",
                        commands: [
                            "command4:descriptor",
                        ],
                    },
                    {
                        id: "descriptor",
                        commands: [
                            "descriptor:aliasCommand4",
                            "descriptor:command1",
                            "descriptor:command2",
                            "descriptor:command3",
                            "descriptor:command4",
                        ],
                    },
                ],
            }],
        ];
    }

}
