<!-- markdownlint-disable MD033 MD036 MD041 -->
<p align="center">
  <img src="https://raw.githubusercontent.com/kodingdotninja/create-chakra-icons/main/.github/docs/chakra-icons.png" /> 
  <br />
</p>

<p align="center">
  <a href="#packages">Packages</a> • 
  <a href="#contribution">Contribution</a>
</p>

## Packages

| Name                                                                                                         | Publishable | Version                                                                                                               |
| ------------------------------------------------------------------------------------------------------------ | ----------- | --------------------------------------------------------------------------------------------------------------------- |
| [create-chakra-icons](https://github.com/kodingdotninja/chakra-icons/tree/main/packages/create-chakra-icons) | ✅          | [![npm version](https://badge.fury.io/js/create-chakra-icons.svg)](https://www.npmjs.com/package/create-chakra-icons) |
| [@tooling/cli](https://github.com/kodingdotninja/chakra-icons/tree/main/tooling/cli)                         | ❌          |                                                                                                                       |
| [@tooling/tsconfig](https://github.com/kodingdotninja/chakra-icons/tree/main/tooling/ts.conf)                | ❌          |                                                                                                                       |
| [@tooling/msrconfig](https://github.com/kodingdotninja/chakra-icons/tree/main/tooling/msr.conf)              | ❌          |                                                                                                                       |

## Contribution

Feel free for:

- Create Issue, Request Features, & send a pull request.

## How to add new icons

- clone this repo

```
  git clone https://github.com/kodingdotninja/chakra-icons.git
```

- go to the project directory

```
  cd chakra-icons
```

- install dependencies

```
  yarn | yarn install
```

- make a new package

```
  yarn plop
```

- fill the blank of prompts

```
  repository url : [link repo] e.g (https://github.com/twbs/icons)
  path of svg icons : [the name of folder where the svg is stored] e.g (icons)
  projects name : [name new package] e.g (bootstrap)
```

- when success generated new package, the package listed in [**./packages/@chakra-icons**](https://github.com/kodingdotninja/chakra-icons/tree/main/packages/create-chakra-icons)

- build the new package

```
  yarn build
```

- if the process build success and no issue, then you can make a new [PRs](https://github.com/kodingdotninja/chakra-icons/compare)

## Maintainers

- Rin ([@ri7nz](https://github.com/ri7nz))
- Griko Nibras ([@grikomsn](https://github.com/grikomsn))

## License

[MIT License, Copyright (c) 2022 Koding Ninja](./LICENSE)
