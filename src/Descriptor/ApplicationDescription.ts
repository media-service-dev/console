/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import { ApplicationInterface } from "../Application/ApplicationInterface";
import { CommandInterface } from "../Command/CommandInterface";
import { RuntimeException } from "../Exception/RuntimeException";
import { NumberUtilities } from "../Utilities/NumberUtilities";
import { NamespaceData } from "./NamespaceData";

export class ApplicationDescription {

    public static GLOBAL_NAMESPACE = "_global";

    private application: ApplicationInterface;

    private namespace: string | null = null;

    private showHidden: boolean;

    private namespaces: Map<string, NamespaceData>;

    private commands: Map<string, CommandInterface>;

    private aliases: Map<string, CommandInterface>;

    public constructor(application: ApplicationInterface, namespace: string | null = null, showHidden: boolean = false) {
        this.application = application;
        this.namespace = namespace;
        this.showHidden = showHidden;
    }

    public getNamespaces() {
        if (typeof this.namespaces === "undefined") {
            this.inspectApplication();
        }

        return this.namespaces;
    }

    public getCommand(name: string): CommandInterface {
        if (!this.commands.has(name) && !this.aliases.has(name)) {
            throw new RuntimeException(`Command "${name}" does not exist.`);
        }

        if (this.commands.has(name)) {
            return this.commands.get(name) as CommandInterface;
        }

        return this.aliases.get(name) as CommandInterface;
    }

    public getCommands(): Map<string, CommandInterface> {
        if (typeof this.commands === "undefined") {
            this.inspectApplication();
        }

        return this.commands;
    }

    private inspectApplication() {
        this.commands = new Map<string, CommandInterface>();
        this.namespaces = new Map<string, NamespaceData>();
        this.aliases = new Map<string, CommandInterface>();

        const all = this.application.all(this.namespace
            ? this.application.findNamespace(this.namespace)
            : null);
        const sorted = this.sortCommands(all);
        for (const [namespace, commands] of sorted.entries()) {
            const names: string[] = [];

            for (const [name, command] of commands) {
                if (!command.getName() || (!this.showHidden && command.isHidden())) {
                    continue;
                }

                if (command.getName() === name) {
                    this.commands.set(name, command);
                } else {
                    this.aliases.set(name, command);
                }

                names.push(name);
            }

            this.namespaces.set(namespace, { id: namespace, commands: names });
        }
    }

    private sortCommands(commands: Map<string, CommandInterface>): Map<string, Map<string, CommandInterface>> {
        const sortedCommands = new Map<string, Map<string, CommandInterface>>();
        const globalCommands = new Map<string, CommandInterface>();
        const namespacesCommands = new Map<string, Map<string, CommandInterface>>();

        for (const [name, command] of commands) {
            const key = this.application.extractNamespace(name, 1);
            if (key === "" || key === ApplicationDescription.GLOBAL_NAMESPACE) {
                globalCommands.set(name, command);
            } else {
                if (!namespacesCommands.has(key)) {
                    namespacesCommands.set(key, new Map<string, CommandInterface>());
                }
                const map = namespacesCommands.get(key);
                if (map) {
                    map.set(name, command);
                }
            }
        }

        if (globalCommands.size) {
            const items = new Map([...globalCommands].sort());
            sortedCommands.set(ApplicationDescription.GLOBAL_NAMESPACE, items);
        }

        if (namespacesCommands.size) {
            const items = new Map<string, Map<string, CommandInterface>>([...namespacesCommands].sort(([currentNamespace], [nextNamespace]) => {
                const currentIsInteger = NumberUtilities.isIntStrict(currentNamespace);
                const nextIsInteger = NumberUtilities.isIntStrict(nextNamespace);

                if (currentIsInteger && nextIsInteger) {
                    const currentInteger = NumberUtilities.parseIntStrict(currentNamespace);
                    const nextInteger = NumberUtilities.parseIntStrict(nextNamespace);
                    if (currentInteger === nextInteger) {
                        return 0;
                    }

                    return currentInteger > nextInteger ? 1 : -1;
                } else if (currentIsInteger) {
                    return 1;
                } else if (nextIsInteger) {
                    return -1;
                }
                return currentNamespace.localeCompare(nextNamespace);
            }));
            for (const [key, commandsSet] of items) {
                const sortedCommandsSet = new Map<string, CommandInterface>([...commandsSet].sort());
                sortedCommands.set(key, sortedCommandsSet);
            }
        }

        return sortedCommands;
    }

}
