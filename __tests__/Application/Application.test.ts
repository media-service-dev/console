/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import * as os from "os";
import { Application } from "../../src/Application/Application";
import { HelpCommand } from "../../src/Command/HelpCommand";
import { ArgumentException } from "../../src/Exception/ArgumentException";
import { LogicException } from "../../src/Exception/LogicException";
import { RuntimeException } from "../../src/Exception/RuntimeException";
import { ArgvInput } from "../../src/Input/ArgvInput";
import { InputInterface } from "../../src/Input/InputInterface";
import { ConsoleOutput } from "../../src/Output/ConsoleOutput";
import { OutputInterface } from "../../src/Output/OutputInterface";
import { OutputMode } from "../../src/Output/OutputMode";
import { ApplicationTester } from "../../src/Tester/ApplicationTester";
import { ensureStaticCommandHelp } from "../Utils/EnsureStaticCommandHelp";
import { BarBazCommand } from "./Mock/BarBazCommand";
import { Foo1Command } from "./Mock/Foo1Command";
import { Foo2Command } from "./Mock/Foo2Command";
import { Foo3Command } from "./Mock/Foo3Command";
import { Foo4Command } from "./Mock/Foo4Command";
import { Foo5Command } from "./Mock/Foo5Command";
import { FooCommand } from "./Mock/FooCommand";
import { FooSubnamespaced1Command } from "./Mock/FooSubnamespaced1Command";
import { FooSubnamespaced2Command } from "./Mock/FooSubnamespaced2Command";
import { TestAmbiguousCommandRegistering } from "./Mock/TestAmbiguousCommandRegistering";
import { TestAmbiguousCommandRegistering2 } from "./Mock/TestAmbiguousCommandRegistering2";

describe("Application", () => {

    describe("constructor", () => {

        it("should takes the application name as its first argument", () => {
            // Act
            const actual = new Application("foo");

            // Assert
            expect(actual.getName()).toBe("foo");
        });

        it("should takes the application version as its second argument", () => {
            // Act
            const actual = new Application("foo", "1.0.0-DEV");

            // Assert
            expect(actual.getVersion().format()).toBe("1.0.0-DEV");
        });

        it("should registered the help and list commands", () => {
            // Arrange
            const application = new Application();

            // Act
            const actual = application.all();

            // Assert
            expect(Array.from(actual.keys())).toEqual(["help", "list"]);
        });

    });

    describe("setName and getName", () => {

        it("should returns the name of the application", () => {
            // Arrange
            const application = new Application("bar");

            // Act
            const actual = application.getName();

            // Assert
            expect(actual).toBe("bar");
        });

        it("should sets the name of the application", () => {
            // Arrange
            const application = new Application("bar");

            // Act
            application.setName("foo");

            // Assert
            expect(application.getName()).toBe("foo");
        });

    });

    describe("getVersion, setVersion and getLongVersion", () => {

        it("should returns the application version", () => {
            // Arrange
            const application = new Application("foo", "1.2.0-DEV");

            // Act
            const actual = application.getVersion();

            // Assert
            expect(actual.format()).toBe("1.2.0-DEV");
        });

        it("should sets the application version", () => {
            // Arrange
            const application = new Application("foo", "1.2.0-DEV");

            // Act
            application.setVersion("2.1.0-BETA");

            // Assert
            expect(application.getVersion().format()).toBe("2.1.0-BETA");
        });

        it("should returns the long application version", () => {
            // Arrange
            const application = new Application("foo bar", "1.5.0-DEV");

            // Act
            const actual = application.getLongVersion();

            // Assert
            expect(actual).toBe("foo bar <info>1.5.0-DEV</info>");
        });

    });

    describe("getHelp", () => {

        it("should returns the application help", () => {
            // Arrange
            const application = new Application();

            // Act
            const actual = application.getHelp();

            // Assert
            expect(actual).toBe("UNKNOWN <info>0.1.0</info>");
        });

    });

    describe("all", () => {

        it("should return the registered commands", () => {
            // Arrange
            const application = new Application();

            // Act
            const actual = application.all();

            // Assert
            expect(actual.get("help")).toBeInstanceOf(HelpCommand);
        });

        it("should take a namespace as its first argument", () => {
            // Arrange
            const application = new Application();
            application.add(new FooCommand());

            // Act
            const actual = application.all("foo");

            // Assert
            expect(actual.size).toBe(1);
        });

    });

    describe("register", () => {

        it("should register a new command", () => {
            // Arrange
            const application = new Application();

            // Act
            const actual = application.register("foo");

            // Assert
            expect(actual.getName()).toBe("foo");
        });

        it("should register ambiguous", async () => {
            // Arrange
            const application = new Application();
            application.setAutoExit(false);
            const tester = new ApplicationTester(application);

            const run = async (input: InputInterface, output: OutputInterface) => {
                output.writeln("It works!");

                return 0;
            };

            const commandOne = application
                .register("test-foo")
                .setAliases(["test"]);

            const commandTwo = application
                .register("test-bar");

            jest.spyOn(commandOne, "run").mockImplementation(run);
            jest.spyOn(commandTwo, "run").mockImplementation(run);

            // Act
            const actual = await tester.run(["test"]);

            // Assert
            expect(actual).toBe(0);
            expect(tester.getDisplay(true)).toContain("It works!");
        });

    });

    describe("add and addCommands", () => {

        it("should add a command", () => {
            // Arrange
            const application = new Application();
            const command = new FooCommand();

            // Act
            application.add(command);

            // Assert
            expect(application.all().get("foo:bar")).toBe(command);
        });

        it("should add multiple commands", () => {
            // Arrange
            const application = new Application();
            const foo = new FooCommand();
            const foo1 = new Foo1Command();

            // Act
            application.addCommands([foo, foo1]);

            // Assert
            const commands = application.all();
            expect(commands.get("foo:bar")).toBe(foo);
            expect(commands.get("foo:bar1")).toBe(foo1);
        });

        it("should throw if command has no name", () => {
            // Arrange
            const application = new Application();
            const command = new Foo5Command();

            // Act
            const actual = () => {
                application.add(command);
            };

            // Assert
            expect(actual).toThrow(LogicException);
        });

    });

    describe("has and get", () => {

        it("should returns tur if a named command is registered", () => {
            // Arrange
            const application = new Application();

            // Act
            const actual = application.has("list");

            // Assert
            expect(actual).toBeTruthy();
        });

        it("should returns false if a named command is not registered", () => {
            // Arrange
            const application = new Application();

            // Act
            const actual = application.has("foo");

            // Assert
            expect(actual).toBeFalsy();
        });

        it("should returns true is alias is registered", () => {
            // Arrange
            const application = new Application();
            const command = new FooCommand();
            application.add(command);

            // Act
            const actual = application.has("afoobar");

            // Assert
            expect(actual).toBeTruthy();
        });

        it("should returns a command by name", () => {
            // Arrange
            const application = new Application();
            const command = new FooCommand();
            application.add(command);

            // Act
            const actual = application.get("foo:bar");

            // Assert
            expect(actual).toBe(command);
        });

        it("should returns a command by alias", () => {
            // Arrange
            const application = new Application();
            const command = new FooCommand();
            application.add(command);

            // Act
            const actual = application.get("afoobar");

            // Assert
            expect(actual).toBe(command);
        });

        it("should returns the help command if --help is provided as the input", () => {
            // Arrange
            const application = new Application();
            const command = new FooCommand();
            application.add(command);
            // Simulate --help
            (application as any).wantHelps = true;

            // Act
            const actual = application.get("foo:bar");

            // Assert
            expect(actual).toBeInstanceOf(HelpCommand);
        });

    });

    it("should display nothing on silent help", async () => {
        // Arrange
        const application = new Application();
        application.setAutoExit(false);
        application.setCatchExceptions(false);
        const tester = new ApplicationTester(application);

        // Act
        await tester.run([["-h", true], ["-q", true]], { decorated: false });

        // Assert
        expect(tester.getDisplay(true)).toBe("");
    });

    it("should throw if command does not exist", () => {
        // Arrange
        const application = new Application();

        // Act
        const actual = () => {
            application.get("foofoo");
        };

        // Assert
        expect(actual).toThrow(ArgumentException);
    });

    it("should return an array fo unique used namespaces", () => {
        // Arrange
        const application = new Application();
        application.add(new FooCommand());
        application.add(new Foo1Command());

        // Act
        const actual = application.getNamespaces();

        // Assert
        expect(actual).toEqual(["foo"]);
    });

    describe("findNamespace", () => {

        it("should returns the given namespace if it exists", () => {
            // Arrange
            const application = new Application();
            application.add(new FooCommand());

            // Act
            const actual = application.findNamespace("foo");

            // Assert
            expect(actual).toBe("foo");
        });

        it("should finds a namespace given an abbreviation", () => {
            // Arrange
            const application = new Application();
            application.add(new FooCommand());

            // Act
            const actual = application.findNamespace("f");

            // Assert
            expect(actual).toBe("foo");
        });

        it("should returns the given namespace if it exists", () => {
            // Arrange
            const application = new Application();
            application.add(new FooCommand());
            application.add(new Foo2Command());

            // Act
            const actual = application.findNamespace("foo");

            // Assert
            expect(actual).toBe("foo");
        });

        it("should returns commands even if the commands are only contained in subnamespaces", () => {
            // Arrange
            const application = new Application();
            application.add(new FooSubnamespaced1Command());
            application.add(new FooSubnamespaced2Command());

            // Act
            const actual = application.findNamespace("foo");

            // Assert
            expect(actual).toBe("foo");
        });

        it("should throw if namespace is ambiguous", () => {
            // Arrange
            const application = new Application();
            application.add(new BarBazCommand());
            application.add(new FooCommand());
            application.add(new Foo2Command());

            // Act
            const actual = () => {
                application.findNamespace("f");
            };

            // Assert
            expect(actual).toThrow(RuntimeException);
        });

        it("should throw on invalid namespace", () => {
            // Arrange
            const application = new Application();

            // Act
            const actual = () => {
                application.findNamespace("bar");
            };

            // Assert
            expect(actual).toThrow(RuntimeException);
        });

    });

    describe("find", () => {

        it("should find non ambiguous", () => {
            // Arrange
            const application = new Application();
            application.add(new TestAmbiguousCommandRegistering());
            application.add(new TestAmbiguousCommandRegistering2());

            // Act
            const actual = application.find("test").getName();

            // Assert
            expect(actual).toBe("test-ambiguous");
        });

        it("should throw if command is not defined", () => {
            // Arrange
            const application = new Application();
            application.add(new FooCommand());
            application.add(new Foo1Command());
            application.add(new Foo2Command());

            // Act
            const actual = () => {
                application.find("foo1");
            };

            // Assert
            expect(actual).toThrow(RuntimeException);
        });

        it("should returns a command if its name exists", () => {
            // Arrange
            const application = new Application();
            application.add(new FooCommand());

            // Act
            const actual = application.find("foo:bar");

            // Assert
            expect(actual).toBeInstanceOf(FooCommand);
        });

        it("should returns the good command even if a namespace has same name", () => {
            // Arrange
            const application = new Application();
            application.add(new Foo3Command());
            application.add(new Foo4Command());

            // Act
            const actual = application.find("foo3:bar");

            // Assert
            expect(actual).toBeInstanceOf(Foo3Command);
        });

        it("should returns a command even if its namespace equals another command name", () => {
            // Arrange
            const application = new Application();
            application.add(new Foo3Command());
            application.add(new Foo4Command());

            // Act
            const actual = application.find("foo3:bar:baz");

            // Assert
            expect(actual).toBeInstanceOf(Foo4Command);
        });

    });

    describe("setCatchExceptions", () => {

        it("should catch exceptions and render them", async () => {
            // Arrange
            const application = new Application();
            application.setAutoExit(false);
            const tester = new ApplicationTester(application);

            // Act
            application.setCatchExceptions(true);

            // Assert
            expect(application.areExceptionsCaught()).toBeTruthy();

            await tester.run([["command", "foo"]], { decorated: false });
            expect(tester.getDisplay(true)).toBe("The command \"foo\" does not exist.\n");

            await tester.run([["command", "foo"]], { decorated: false, captureStderrSeparately: true });
            expect(tester.getErrorOutput(true)).toBe("");
        });

        it("should throw if catch exception is disabled", async () => {
            // Arrange
            const application = new Application();
            application.setAutoExit(false);
            const tester = new ApplicationTester(application);

            // Act
            application.setCatchExceptions(false);

            // Assert
            expect(application.areExceptionsCaught()).toBeFalsy();

            await expect((async () => {
                await tester.run([["command", "foo"]], { decorated: false });
            })()).rejects.toThrow(RuntimeException);

            await expect((async () => {
                await tester.run([["command", "foo"]], { decorated: false, captureStderrSeparately: true });
            })()).rejects.toThrow(RuntimeException);
        });

    });

    describe("autoExit", () => {

        it("should set auto exit", () => {
            // Arrange
            const application = new Application();

            // Act
            application.setAutoExit(true);

            // Assert
            expect(application.isAutoExitEnabled()).toBeTruthy();
        });

        it("should get auto exit", () => {
            // Arrange
            const application = new Application();
            application.setAutoExit(false);

            // Act
            const actual = application.isAutoExitEnabled();

            // Assert
            expect(actual).toBeFalsy();
        });

    });

    describe("run", () => {

        it("should creates an ArgvInput and ConsoleOutput by default if none is given", async () => {
            // Arrange
            const application = new Application();
            const command = new Foo1Command();
            application.setAutoExit(false);
            application.setCatchExceptions(false);
            application.add(command);

            process.argv = ["node", "cli.js", "foo:bar1"];

            // Act
            await application.run();

            // Assert
            expect(command.input).toBeInstanceOf(ArgvInput);
            expect(command.output).toBeInstanceOf(ConsoleOutput);
        });

        it("should runs the list command if no argument is passed", async () => {
            // Arrange
            const application = new Application();
            application.setAutoExit(false);
            application.setCatchExceptions(false);
            ensureStaticCommandHelp(application);
            const tester = new ApplicationTester(application);

            // Act
            await tester.run([], { decorated: false });

            // Assert
            expect(tester.getDisplay(true)).toMatchSnapshot();
        });

        it("should runs the help command if --help is passed", async () => {
            // Arrange
            const application = new Application();
            application.setAutoExit(false);
            application.setCatchExceptions(false);
            ensureStaticCommandHelp(application);
            const tester = new ApplicationTester(application);

            // Act
            await tester.run([["--help", true]], { decorated: false });

            // Assert
            expect(tester.getDisplay(true)).toMatchSnapshot();
        });

        it("should runs the help command if -h is passed", async () => {
            // Arrange
            const application = new Application();
            application.setAutoExit(false);
            application.setCatchExceptions(false);
            ensureStaticCommandHelp(application);
            const tester = new ApplicationTester(application);

            // Act
            await tester.run([["-h", true]], { decorated: false });

            // Assert
            expect(tester.getDisplay(true)).toMatchSnapshot();
        });

        it("should displays the help if --help is passed", async () => {
            // Arrange
            const application = new Application();
            application.setAutoExit(false);
            application.setCatchExceptions(false);
            ensureStaticCommandHelp(application);
            const tester = new ApplicationTester(application);

            // Act
            await tester.run([["command", "list"], ["--help", true]], { decorated: false });

            // Assert
            expect(tester.getDisplay(true)).toMatchSnapshot();
        });

        it("should displays the help if -h is passed", async () => {
            // Arrange
            const application = new Application();
            application.setAutoExit(false);
            application.setCatchExceptions(false);
            ensureStaticCommandHelp(application);
            const tester = new ApplicationTester(application);

            // Act
            await tester.run([["command", "list"], ["-h", true]], { decorated: false });

            // Assert
            expect(tester.getDisplay(true)).toMatchSnapshot();
        });

        it("should forces color output if --ansi is passed", async () => {
            // Arrange
            const application = new Application();
            application.setAutoExit(false);
            application.setCatchExceptions(false);
            ensureStaticCommandHelp(application);
            const tester = new ApplicationTester(application);

            // Act
            await tester.run([["--ansi", true]]);

            // Assert
            expect(tester.getOutput().isDecorated()).toBeTruthy();
        });

        it("should forces color output to be disabled if --no-ansi is passed", async () => {
            // Arrange
            const application = new Application();
            application.setAutoExit(false);
            application.setCatchExceptions(false);
            ensureStaticCommandHelp(application);
            const tester = new ApplicationTester(application);

            // Act
            await tester.run([["--no-ansi", true]]);

            // Assert
            expect(tester.getOutput().isDecorated()).toBeFalsy();
        });

        it("should displays the program version if --version is passed", async () => {
            // Arrange
            const application = new Application();
            application.setAutoExit(false);
            application.setCatchExceptions(false);
            ensureStaticCommandHelp(application);
            const tester = new ApplicationTester(application);

            // Act
            await tester.run([["--version", true]], { decorated: false });

            // Assert
            expect(tester.getDisplay(true)).toMatchSnapshot();
        });

        it("should displays the program version if -V is passed", async () => {
            // Arrange
            const application = new Application();
            application.setAutoExit(false);
            application.setCatchExceptions(false);
            ensureStaticCommandHelp(application);
            const tester = new ApplicationTester(application);

            // Act
            await tester.run([["-V", true]], { decorated: false });

            // Assert
            expect(tester.getDisplay(true)).toMatchSnapshot();
        });

        it("should removes all output and off the interactive if --quiet is passed", async () => {
            // Arrange
            const application = new Application();
            application.setAutoExit(false);
            application.setCatchExceptions(false);
            ensureStaticCommandHelp(application);
            const tester = new ApplicationTester(application);

            // Act
            await tester.run([["command", "list"], ["--quiet", true]]);

            // Assert
            expect(tester.getDisplay()).toBe("");
            expect(tester.getInput().isInteractive()).toBeFalsy();
        });

        it("should removes all output and off the interactive if -q is passed", async () => {
            // Arrange
            const application = new Application();
            application.setAutoExit(false);
            application.setCatchExceptions(false);
            ensureStaticCommandHelp(application);
            const tester = new ApplicationTester(application);

            // Act
            await tester.run([["command", "list"], ["-q", true]]);

            // Assert
            expect(tester.getDisplay()).toBe("");
            expect(tester.getInput().isInteractive()).toBeFalsy();
        });

        it("should sets the output to verbose if --verbose is passed", async () => {
            // Arrange
            const application = new Application();
            application.setAutoExit(false);
            application.setCatchExceptions(false);
            ensureStaticCommandHelp(application);
            const tester = new ApplicationTester(application);

            // Act
            await tester.run([["command", "list"], ["--verbose", true]]);

            // Assert
            expect(tester.getOutput().getVerbosity()).toBe(OutputMode.VERBOSITY_VERBOSE);
        });

        it("should sets the output to verbose if --verbose=1 is passed", async () => {
            // Arrange
            const application = new Application();
            application.setAutoExit(false);
            application.setCatchExceptions(false);
            ensureStaticCommandHelp(application);
            const tester = new ApplicationTester(application);

            // Act
            await tester.run([["command", "list"], ["--verbose", "1"]]);

            // Assert
            expect(tester.getOutput().getVerbosity()).toBe(OutputMode.VERBOSITY_VERBOSE);
        });

        it("should sets the output to very verbose if --verbose=2 is passed", async () => {
            // Arrange
            const application = new Application();
            application.setAutoExit(false);
            application.setCatchExceptions(false);
            ensureStaticCommandHelp(application);
            const tester = new ApplicationTester(application);

            // Act
            await tester.run([["command", "list"], ["--verbose", "2"]]);

            // Assert
            expect(tester.getOutput().getVerbosity()).toBe(OutputMode.VERBOSITY_VERY_VERBOSE);
        });

        it("should sets the output to very verbose if --verbose=3 is passed", async () => {
            // Arrange
            const application = new Application();
            application.setAutoExit(false);
            application.setCatchExceptions(false);
            ensureStaticCommandHelp(application);
            const tester = new ApplicationTester(application);

            // Act
            await tester.run([["command", "list"], ["--verbose", "3"]]);

            // Assert
            expect(tester.getOutput().getVerbosity()).toBe(OutputMode.VERBOSITY_DEBUG);
        });

        it("should sets the output to verbose if unknown --verbose level is passed", async () => {
            // Arrange
            const application = new Application();
            application.setAutoExit(false);
            application.setCatchExceptions(false);
            ensureStaticCommandHelp(application);
            const tester = new ApplicationTester(application);

            // Act
            await tester.run([["command", "list"], ["--verbose", "4"]]);

            // Assert
            expect(tester.getOutput().getVerbosity()).toBe(OutputMode.VERBOSITY_VERBOSE);
        });

        it("should sets the output to verbose if -v is passed", async () => {
            // Arrange
            const application = new Application();
            application.setAutoExit(false);
            application.setCatchExceptions(false);
            ensureStaticCommandHelp(application);
            const tester = new ApplicationTester(application);

            // Act
            await tester.run([["command", "list"], ["-v", true]]);

            // Assert
            expect(tester.getOutput().getVerbosity()).toBe(OutputMode.VERBOSITY_VERBOSE);
        });

        it("should sets the output to verbose if -vv is passed", async () => {
            // Arrange
            const application = new Application();
            application.setAutoExit(false);
            application.setCatchExceptions(false);
            ensureStaticCommandHelp(application);
            const tester = new ApplicationTester(application);

            // Act
            await tester.run([["command", "list"], ["-vv", true]]);

            // Assert
            expect(tester.getOutput().getVerbosity()).toBe(OutputMode.VERBOSITY_VERY_VERBOSE);
        });

        it("should sets the output to verbose if -vvv is passed", async () => {
            // Arrange
            const application = new Application();
            application.setAutoExit(false);
            application.setCatchExceptions(false);
            ensureStaticCommandHelp(application);
            const tester = new ApplicationTester(application);

            // Act
            await tester.run([["command", "list"], ["-vvv", true]]);

            // Assert
            expect(tester.getOutput().getVerbosity()).toBe(OutputMode.VERBOSITY_DEBUG);
        });

        it("should not call interact() if --no-interaction is passed", async () => {
            // Arrange
            const application = new Application();
            application.setAutoExit(false);
            application.setCatchExceptions(false);
            application.add(new FooCommand());
            const tester = new ApplicationTester(application);

            // Act
            await tester.run([["command", "foo:bar"], ["--no-interaction", true]]);

            // Assert
            expect(tester.getDisplay()).toBe("called" + os.EOL);
        });

        it("should not call interact() if -n is passed", async () => {
            // Arrange
            const application = new Application();
            application.setAutoExit(false);
            application.setCatchExceptions(false);
            application.add(new FooCommand());
            const tester = new ApplicationTester(application);

            // Act
            await tester.run([["command", "foo:bar"], ["-n", true]]);

            // Assert
            expect(tester.getDisplay()).toBe("called" + os.EOL);
        });
    });

    /*    it("should work", async () => {
            const application = new Application("example", "0.1.0-DEV");
            application.setAutoExit(false);
            application.setCatchExceptions(false);
            application.register("test")
                             .addArgument("file", ArgumentMode.REQUIRED)
                             .setCode(async (input, output) => {
                                 const file = input.getArgument("file");
                                 output.writeln("<info>File:</info> " + file);

                                 return 0;
                             });
            application.setDefaultCommand('test', true);

            const tester = new ApplicationTester(application);

            await tester.run([['file', 'asd']], {capture_stderr_separately: true, decorated: false, verbosity: OutputMode.VERBOSITY_DEBUG});

            expect(tester.getDisplay(true)).toBe("asd");
        });*/

});
