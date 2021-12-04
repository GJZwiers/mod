# mod

<p align="center">
<img src=".github/excited_deno.png" width="350">
</p>

[![Build](https://github.com/GJZwiers/mod/actions/workflows/build.yaml/badge.svg)](https://github.com/GJZwiers/mod/actions/workflows/build.yaml)
[![Coverage Status](https://coveralls.io/repos/github/GJZwiers/mod/badge.svg?branch=main)](https://coveralls.io/github/GJZwiers/mod?branch=main)
[![nest badge](https://nest.land/badge.svg)](https://nest.land/package/mod)
![GitHub](https://img.shields.io/github/license/GJZwiers/mod)

`mod` is a command line tool to quickly scaffold a new Deno module. It requires
`deno` and optionally `git`.

Try it without installing anything:

<details open>
<summary>Bash/Zsh</summary>
<p>

```bash
deno run \
--allow-read=my_deno_module \
--allow-run=git \
--allow-write=my_deno_module \
https://deno.land/x/mod/mod.ts \
--name my_deno_module
```

</p>
</details>

<details>
<summary>PowerShell</summary>
<p>

```console
deno run `
--allow-read=my_deno_module `
--allow-run=git `
--allow-write=my_deno_module `
https://deno.land/x/mod/mod.ts `
--name my_deno_module
```

</p>
</details>

## Table of Contents

- [Installation](#installation)
- [Permissions](#permissions)
- [Usage](#usage)
- [Options](#options)
- [Contributing](#contributing)

## Installation

You can get the latest stable release from `deno.land/x`:

```console
deno install --allow-read --allow-run=git --allow-write -fn mod https://deno.land/x/mod/mod.ts
```

If you want to install a particular version use, for example,
`https://deno.land/x/mod@v2.2.8/mod.ts`.

You can also get the _unstable_ canary release from GitHub by installing via the
`main` branch's raw URL:

```console
deno install --allow-read --allow-run=git --allow-write -fn mod https://raw.githubusercontent.com/GJZwiers/mod/main/mod.ts
```

## Permissions

`mod` requires the following permissions:

- `read`: to check if files already exists before writing.
- `run=git`: to run `git` commands, more specifically `git init`
- `write`: to make files as part of the module initialization.

Omitting `run` permissions is possible, but it means a Git repository will not
be initialized automatically.

## Usage

```console
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

Also note that `mod` does not perform editor-specific setups such as enabling
Deno in VS Code via `.vscode/settings.json`.

If `git` is installed on the machine then `git init` will be run as well.

To create the new module in a new directory:

```console
mod --name my_deno_module
```

This will create the following file and directory structure:

```
.
├── my_deno_module
|   ├── .gitignore
|   ├── deps.ts
|   ├── dev_deps.ts
|   ├── mod.ts
```

`mod` can also create other files in addition to the basics, such as a workflow
file for GitHub Actions:

```console
mod -n my_deno_module --ci
```

```
.
├── my_deno_module
|   ├── .github
|   |   ├── workflows
|   |   |   ├── build.yaml
|   ├── .gitignore
|   ├── deps.ts
|   ├── dev_deps.ts
|   ├── mod.ts
```

You can also initialize with JavaScript:

```console
mod --js
```

```
.
├── .gitignore
├── deps.js
├── dev_deps.js
├── mod.js
```

## Options

`mod` can create other files with the module, such as an import map or a Deno
configuration file. To see what options and flags are available use:

- `mod --help` if you have the CLI installed or
- `deno run https://deno.land/x/mod/mod.ts --help`

## Contributing

Bug reports and feature requests are very welcome! If you want to contribute a
fix or feature yourself, fork this repository and make a pull request with your
changes.
