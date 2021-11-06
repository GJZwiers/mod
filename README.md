# mod

[![Build](https://github.com/GJZwiers/mod/actions/workflows/build.yaml/badge.svg)](https://github.com/GJZwiers/mod/actions/workflows/build.yaml)
[![Coverage Status](https://coveralls.io/repos/github/GJZwiers/mod/badge.svg?branch=main)](https://coveralls.io/github/GJZwiers/mod?branch=main)
[![nest badge](https://nest.land/badge.svg)](https://nest.land/package/mod)

`mod` is a simple command line tool to initialize Deno projects from prompts.

## Quickstart

```
deno install --allow-read --allow-run=git --allow-write --name mod https://deno.land/x/mod@v0.1.0/mod.ts

mod -y --name awesome_deno_project
```

## Quickerstart (no install)

```
deno run --allow-read --allow-run=git --allow-write https://deno.land/x/mod@v0.1.0/mod.ts -y -n awesome_deno_project
```

## Table of Contents

- [Installation](#installation)
- [Permissions](#permissions)
- [Basic Usage](#basic-usage)
- [Options](#options)
- [Contributing](#contributing)

## Installation

First install `deno` and make sure it is available on a terminal. `git` is also
recommended though not required.

Next, run `deno install` to install the CLI:

```
deno install --allow-read --allow-run=git --allow-write -n mod https://deno.land/x/mod@v0.1.0/mod.ts
```

You can install `mod` from a GitHub raw URL with a tag as well, or without one
to get the latest and greatest (though also unreleased) version:

```
deno install --allow-read --allow-run=git --allow-write -n mod https://raw.githubusercontent.com/GJZwiers/mod/main/mod.ts
```

To upgrade, run the command with a new version number and include `-f`.

## Permissions

The program needs the following permissions to run:

- `read`: to check if files already exists before writing
- `run=git`: to run `git` commands, more specifically `git init`
- `write`: to make files as part of the project initialization

## Basic Usage

```
mod
```

This will prompt you for the following:

- Use TypeScript? (default `y`)
- Set entrypoint: (default `mod.ts`)
- Set dependency entrypoint: (default `deps.ts`)
- Set dev dependency entrypoint: (default `dev_deps.ts`)
- Add import map? (default `n`)

Choosing all defaults will create the following structure in the current
directory:

```
.
├── .gitignore
├── deps.ts
├── dev_deps.ts
├── mod.ts
```

If you choose to init with an import map an `import_map.json` file will be added
to the above. If `git` is installed on the machine then `git init` will be run
as well.

Note that `mod` will not overwrite files unless the `--force` option is used
explicitly. This means the program can 'fill in the blanks' in a project where
not all of the files above are present yet.

## Options

`--help` will print helpful information to the terminal.

`--prompt` or `-p` will ask for input with a few questions in order to construct
the module:

```
mod --prompt
```

`--name` or `-n` will initialize the project in a new directory in the current
working directory:

```
mod --name my_project
```

```
.
├── my_project
|   ├── .gitignore
|   ├── deps.ts
|   ├── dev_deps.ts
|   ├── mod.ts
```

the `name` argument can be any path in the local filesystem, and `mod` will make
any missing directories along the way.

`--map` or `-m` will add an (empty) `import_map.json` file to the project:

```
mod --map
```

`--config` or `-c` will add an (empty) `deno.json` file to the project:

```
mod --config
```

`--config-only` or `-o` will add _only_ a `deno.json` file to the project. Note
that this also disables running `git init`:

```
mod --config-only
```

`--tdd` or `-t` will include a `.test` file to get started with a test-driven
project, such as `mod.test.ts`:

```
mod --tdd
```

`--force` or `-f` will allow the program to overwrite existing files. This can
be helpful to re-initialize but use with caution.

```
mod --force
```

`--no-git` will disable running `git init` as part of the project
initialization.

```
mod --no-git
```

`--ascii` will draw an ASCII Deno to the screen!

```
mod --ascii
```

## Contributing

Feel free to submit a bug report, issue or feature request!
