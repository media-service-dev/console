
# @mscs/console

**Version:** 0.1.0-DEV

This is a library to write console applications in typescript for node.

## Installation

```shell script
$ yarn add @mscs/console
```

## Usage

Short example:

```typescript
import { Application, ArgumentMode } from "@mscs/console";

const application = new Application("Demo", "0.1.0-DEV");

application.register("commandName")
           .setDescription("command description")
           .addArgument("argumentName", ArgumentMode.REQUIRED, "argument description")
           .setCode(async (input, output) => {
               output.writeln("<info>Demo - 0.1.0-DEV</info>");
               output.writeln("<info>Argument:</info> " + input.getArgument("argumentName"));

               return 0;
           });

async function runtime() {
    await application.run();
}

runtime().catch(error => {
    console.log(error);
    process.exit(1);
});
```

# Important note 

Since *Symfony* is, for good reason, a registered trademark, please take note that we are in no way associated with [the Symfony brand](https://symfony.com/) or the [SensioLabs](https://sensiolabs.com/) organization.
Therefore, we don't represent or speak for any of them.

## Difference between symfony/console

First of all not all features are included.

Currently, you won't have:

- The Kernel
- The Container
    - CommandLoader
- Auto-Complete
- Progressbar (planned)
- MultiByte support
- Alternative commands suggestions (planned)

There also might be changes between the API.
