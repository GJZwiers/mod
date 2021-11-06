# mod

[![Build](https://github.com/GJZwiers/mod/actions/workflows/build.yaml/badge.svg)](https://github.com/GJZwiers/mod/actions/workflows/build.yaml)
[![Coverage Status](https://coveralls.io/repos/github/GJZwiers/mod/badge.svg?branch=main)](https://coveralls.io/github/GJZwiers/mod?branch=main)
[![nest badge](https://nest.land/badge.svg)](https://nest.land/package/mod)

`mod` is a command line tool to quickly scaffold a new Deno project. It requires
`deno` and optionally `git`.

Try it without installing anything:

```
deno run --allow-read --allow-run=git --allow-write https://deno.land/x/mod@v1.0.3/mod.ts -n awesome_deno_project
```

## Table of Contents

- [Installation](#installation)
- [Permissions](#permissions)
- [Basic Usage](#basic-usage)
- [Options](#options)
- [Contributing](#contributing)

## Installation

Install the latest stable release from `deno.land` (or `nest.land`):

```
deno install --allow-read --allow-run=git --allow-write -n mod https://deno.land/x/mod@v1.0.3/mod.ts
```

Or install the latest unstable (unreleased) version from `GitHub`:

```
deno install --allow-read --allow-run=git --allow-write -n mod https://raw.githubusercontent.com/GJZwiers/mod/main/mod.ts
```

To upgrade, run the command with a new version number and include `-f`.

## Permissions

`mod` requires the following permissions

- `read`: to check if files already exists before writing
- `run=git`: to run `git` commands, more specifically `git init`
- `write`: to make files as part of the project initialization

## Usage

```
mod
```

This will create the following file structure in the current working directory:

```
.
├── .gitignore
├── deps.ts
├── dev_deps.ts
├── mod.ts
```

Note that `mod` does not overwrite files unless `--force` is used explicitly.
This means the program can also be used to 'fill in the blanks' in a directory
where not all of the files above are present yet.

If `git` is installed on the machine then `git init` will be run as well.

To create the new module in a new directory:

```
mod --name my_deno_project
```

This will create the following file and directory structure:

```
.
├── my_deno_project
|   ├── .gitignore
|   ├── deps.ts
|   ├── dev_deps.ts
|   ├── mod.ts
```

## Options

To see what options and flags are available use `mod --help` if you have the CLI
installed or `deno run https://deno.land/x/mod@v1.0.3/mod.ts --help`

## Contributing

Bug reports and feature requests are very welcome!
