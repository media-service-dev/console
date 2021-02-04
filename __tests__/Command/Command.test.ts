/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import each from "jest-each";
import * as os from "os";

import { Application } from "../../src/Application/Application";
import { Command } from "../../src/Command/Command";
import { ArgumentException } from "../../src/Exception/ArgumentException";
import { LogicException } from "../../src/Exception/LogicException";
import { RuntimeException } from "../../src/Exception/RuntimeException";
import { FormatterHelper } from "../../src/Helper/FormatterHelper";
import { ArgumentDefinition } from "../../src/Input/ArgumentDefinition";
import { CollectionInput } from "../../src/Input/CollectionInput";
import { InputDefinition } from "../../src/Input/InputDefinition";
import { OptionDefinition } from "../../src/Input/OptionDefinition";
import { NullOutput } from "../../src/Output/NullOutput";
import { CommandTester } from "../../src/Tester/CommandTester";
import { TestCommand } from "./Mock/TestCommand";

describe("Command", () => {

    describe("constructor", () => {

        it("should takes the command name as its first argument ", () => {
            // Act
            const actual = new Command("foo:bar");

            // Assert
            expect(actual.getName()).toBe("foo:bar");
        });

        it("should throw if the name is empty", () => {
            // Arrange
            const command = new Command();
            const application = new Application();

            // Act
            const actual = () => {
                application.add(command);
            };

            // Assert
            expect(actual).toThrow(LogicException);
        });

    });

    describe("setApplication", () => {

        it("should sets the current application", () => {
            // Arrange
            const application = new Application();
            const command = new TestCommand();

            // Act
            command.setApplication(application);

            // Assert
            expect(command.getApplication()).toBe(application);
            expect(command.getHelperSet()).toBe(application.getHelperSet());
        });

        it("should handle application set null", () => {
            // Arrange
            const command = new TestCommand();

            // Act
            command.setApplication(null);

            // Assert
            expect(command.getHelperSet()).toBeNull();
        });

    });

    describe("setDefinition and getDefinition", () => {

        it("should have a fluent interface", () => {
            // Arrange
            const command = new TestCommand();

            // Act
            const actual = command.setDefinition(new InputDefinition());

            // Assert
            expect(actual).toBe(command);
        });

        it("should set the definition", () => {
            // Arrange
            const command = new TestCommand();
            const definition = new InputDefinition();

            // Act
            command.setDefinition(definition);
            const actual = command.getDefinition();

            // Assert
            expect(actual).toBe(definition);
        });

        it("should take and array of ArgumentDefinition and OptionDefinition", () => {
            // Arrange
            const command = new TestCommand();

            // Act
            command.setDefinition([new ArgumentDefinition("foo"), new OptionDefinition("bar")]);
            const definition = command.getDefinition();

            // Assert
            expect(definition.hasArgument("foo")).toBeTruthy();
            expect(definition.hasOption("bar")).toBeTruthy();
        });

    });

    describe("addArgument", () => {

        it("should implements a fluent interface", () => {
            // Arrange
            const command = new TestCommand();

            // Act
            const actual = command.addArgument("foo");

            // Assert
            expect(actual).toBe(command);
        });

        it("should add the argument", () => {
            // Arrange
            const command = new TestCommand();

            // Act
            command.addArgument("foo");

            // Assert
            const definition = command.getDefinition();

            expect(definition.hasArgument("foo")).toBeTruthy();
        });

    });

    describe("addOption", () => {

        it("should implements a fluent interface", () => {
            // Arrange
            const command = new TestCommand();

            // Act
            const actual = command.addOption("bar");

            // Assert
            expect(actual).toBe(command);
        });

        it("should add the option", () => {
            // Arrange
            const command = new TestCommand();

            // Act
            command.addOption("bar");

            // Assert
            const definition = command.getDefinition();

            expect(definition.hasOption("bar")).toBeTruthy();
        });

    });

    describe("setHidden", () => {

        it("should set hidden", () => {
            // Arrange
            const command = new TestCommand();

            // Act
            command.setHidden(true);

            // Assert
            expect(command.isHidden()).toBeTruthy();
        });

    });

    describe("setName and getName", () => {

        it("should returns the command name", () => {
            // Arrange
            const command = new TestCommand();

            // Act
            const actual = command.getName();

            // Assert
            expect(actual).toBe("namespace:name");
        });

        it("should set name", () => {
            // Arrange
            const command = new TestCommand();

            // Act
            command.setName("foo");

            // Assert
            expect(command.getName()).toBe("foo");
        });

        it("should implement a fluent interface", () => {
            // Arrange
            const command = new TestCommand();

            // Act
            const actual = command.setName("foobar:bar");

            // Assert
            expect(actual).toBe(command);
            expect(command.getName()).toBe("foobar:bar");
        });

        each([
            [""],
            ["foo:"],
        ])
            .it("should throw on invalid command name", (name: string) => {
                // Arrange
                const command = new TestCommand();

                // Act
                const actual = () => {
                    command.setName(name);
                };

                // Assert
                expect(actual).toThrow(ArgumentException);
            });

    });

    describe("setDescription and getDescription", () => {

        it("should returns the description", () => {
            // Arrange
            const command = new TestCommand();

            // Act
            const actual = command.getDescription();

            // Assert
            expect(actual).toBe("description");
        });

        it("should implements a fluent interface", () => {
            // Arrange
            const command = new TestCommand();

            // Act
            const actual = command.setDescription("foo");

            // Assert
            expect(actual).toBe(command);
        });

        it("should set the description", () => {
            // Arrange
            const command = new TestCommand();

            // Act
            command.setDescription("foo");

            // Assert
            expect(command.getDescription()).toBe("foo");
        });

    });

    describe("setHelp and getHelp", () => {

        it("should returns the help", () => {
            // Arrange
            const command = new TestCommand();

            // Act
            const actual = command.getHelp();

            // Assert
            expect(actual).toBe("help");
        });

        it("should implements a fluent interface", () => {
            // Arrange
            const command = new TestCommand();

            // Act
            const actual = command.setHelp("foo");

            // Assert
            expect(actual).toBe(command);
        });

        it("should set the help", () => {
            // Arrange
            const command = new TestCommand();

            // Act
            command.setHelp("foo");

            // Assert
            expect(command.getHelp()).toBe("foo");
        });

    });

    describe("getProcessedHelp", () => {

        it("should replaces %command.name% correctly", () => {
            // Arrange
            const command = new TestCommand();

            // Act
            command.setHelp("The %command.name% command does... Example: node %command.full_name%.");

            // Assert
            const actual = command.getProcessedHelp();

            expect(actual).toContain("The namespace:name command does");
        });

        it("should replaces %command.name%", () => {
            // Arrange
            const command = new TestCommand();

            // Act
            command.setHelp("Example: node %command.full_name%.");

            // Assert
            const actual = command.getProcessedHelp();

            expect(actual).not.toContain("%command.full_name%");
        });

        it("should fallback to description", () => {
            // Arrange
            const command = new TestCommand();

            command.setHelp("");

            // Act
            const actual = command.getProcessedHelp();

            // Assert
            expect(actual).toBe("description");
        });

        it("should replaces %command.name% correctly in single command applications", () => {
            // Arrange
            const command = new TestCommand();
            const application = new Application();

            command.setHelp("The %command.name% command does... Example: php %command.full_name%.");
            application.add(command);
            application.setDefaultCommand("namespace:name", true);

            // Act
            const actual = command.getProcessedHelp();

            // Assert
            expect(actual).toContain("The namespace:name command does...");
        });

        it("should replaces %command.full_name% in single command applications", () => {
            // Arrange
            const command = new TestCommand();
            const application = new Application();

            command.setHelp("The %command.name% command does... Example: php %command.full_name%.");
            application.add(command);
            application.setDefaultCommand("namespace:name", true);

            // Act
            const actual = command.getProcessedHelp();

            // Assert
            expect(actual).not.toContain("%command.full_name%");
        });

    });

    describe("setAliases and getAliases", () => {

        it("should return the aliases", () => {
            // Arrange
            const command = new TestCommand();

            // Act
            const actual = command.getAliases();

            // Assert
            expect(actual).toEqual(["name"]);
        });

        it("should set the aliases", () => {
            // Arrange
            const command = new TestCommand();

            // Act
            command.setAliases(["name1"]);

            // Assert
            expect(command.getAliases()).toEqual(["name1"]);
        });

        it("should implements a fluent interface", () => {
            // Arrange
            const command = new TestCommand();

            // Act
            const actual = command.setAliases(["name1"]);

            // Assert
            expect(actual).toBe(command);
        });

    });

    describe("getSynopsis", () => {

        it("should returns the synopsis", () => {
            // Arrange
            const command = new TestCommand();

            command.addOption("foo");
            command.addArgument("bar");

            // Act
            const actual = command.getSynopsis();

            // Assert
            expect(actual).toBe("namespace:name [--foo] [--] [<bar>]");
        });

    });

    describe("addUsages and getUsages", () => {

        it("should add usages", () => {
            // Arrange
            const command = new TestCommand();

            // Act
            command.addUsage("foo1");
            command.addUsage("foo2");

            // Assert
            const actual = command.getUsages();

            expect(actual).toContain("namespace:name foo1");
            expect(actual).toContain("namespace:name foo2");
        });

        it("should get usages", () => {
            // Arrange
            const command = new TestCommand();

            command.addUsage("foo1");
            command.addUsage("foo2");

            // Act
            const actual = command.getUsages();

            // Assert
            expect(actual).toContain("namespace:name foo1");
            expect(actual).toContain("namespace:name foo2");
        });

    });

    describe("getHelper", () => {

        it("should returns the correct helper", () => {
            // Arrange
            const application = new Application();
            const command = new TestCommand();

            command.setApplication(application);
            const formatterHelper = new FormatterHelper();

            // Act
            const actual = command.getHelper("formatter");

            // Assert
            expect(actual.getName()).toBe(formatterHelper.getName());
        });

        it("should throw if helper set if null", () => {
            // Arrange
            const command = new TestCommand();

            // Act
            const actual = () => {
                command.getHelper("formatter");
            };

            // Assert
            expect(actual).toThrow(LogicException);
        });
    });

    describe("merge application definition", () => {

        it("should merge application definition", () => {
            // Arrange
            const application = new Application();
            const command = new TestCommand();
            const definition = new InputDefinition([new ArgumentDefinition("bar"), new OptionDefinition("foo")]);

            application.getDefinition().addArgument(new ArgumentDefinition("foo"));

            application.getDefinition().addOption(new OptionDefinition("bar"));

            command.setApplication(application);
            command.setDefinition(definition);

            // Act
            command.mergeApplicationDefinition();

            // Assert
            const actual = command.getDefinition();

            expect(actual.hasArgument("foo")).toBeTruthy();
            expect(actual.hasArgument("bar")).toBeTruthy();
            expect(actual.hasOption("foo")).toBeTruthy();
            expect(actual.hasOption("bar")).toBeTruthy();

            // Act 2
            command.mergeApplicationDefinition();

            // Assert
            expect(command.getDefinition().getArgumentCount()).toBe(3);
        });

        it("should merge without and with args", () => {
            // Arrange
            const application = new Application();
            const command = new TestCommand();
            const definition = new InputDefinition();

            application.getDefinition().addArguments([new ArgumentDefinition("foo")]);
            application.getDefinition().addOptions([new OptionDefinition("bar")]);
            command.setApplication(application);
            command.setDefinition(definition);

            // Act
            command.mergeApplicationDefinition(false);

            // Assert
            expect(command.getDefinition().hasOption("bar")).toBeTruthy();
            expect(command.getDefinition().hasArgument("foo")).toBeFalsy();

            // Act 2
            command.mergeApplicationDefinition(true);

            // Assert
            expect(command.getDefinition().hasArgument("foo")).toBeTruthy();

            // Act 3
            command.mergeApplicationDefinition();

            // Assert
            expect(command.getDefinition().getArgumentCount()).toBe(2);
        });
    });

    describe("interactive", () => {
        it("should call interact if the command is interactive", async () => {
            // Arrange
            const command = new TestCommand();
            const tester = new CommandTester(command);

            // Act
            await tester.execute([], { interactive: true });

            // Assert
            const actual = tester.getDisplay();

            expect(actual).toBe("interact called" + os.EOL + "execute called" + os.EOL);
        });

        it("should not call interact if the is not interactive", async () => {
            // Arrange
            const command = new TestCommand();
            const tester = new CommandTester(command);

            // Act
            await tester.execute([], { interactive: false });

            // Assert
            const actual = tester.getDisplay();

            expect(actual).toBe("execute called" + os.EOL);
        });
    });

    describe("execute", () => {
        it("should needs to be overridden", async () => {
            // Arrange
            const command = new Command("foo");

            // Act
            const actual = async () => {
                await command.run(new CollectionInput([]), new NullOutput());
            };

            // Assert
            await expect(actual()).rejects.toThrow(LogicException);
        });

        it("should throw on invalid option", async () => {
            // Arrange
            const command = new TestCommand();
            const tester = new CommandTester(command);

            // Act
            const actual = async () => {
                await tester.execute([["--bar", true]], {});
            };

            // Assert
            await expect(actual()).rejects.toThrow(RuntimeException);
        });

        it("should run with application", async () => {
            // Arrange
            const command = new TestCommand();
            const application = new Application();

            command.setApplication(application);

            // Act
            const actual = await command.run(new CollectionInput([]), new NullOutput());

            // const actual = async () => {
            //     return await command.run(new CollectionInput([]), new NullOutput())
            // };
            //
            // Assert
            expect(actual).toBe(0);
        });

        it("should returns always integer", async () => {
            // Arrange
            const command = new TestCommand();

            // Act
            const actual = async () => {
                return command.run(new CollectionInput([]), new NullOutput());
            };

            // Assert
            await expect(actual()).resolves.toBe(0);
        });
    });

});
