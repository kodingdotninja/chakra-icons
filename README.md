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

<!-- prettier-ignore-start -->
| Name                                                                                                                 | Publishable | Version                                                                                                                         |
| -------------------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------- |
| [create-chakra-icons](https://github.com/kodingdotninja/chakra-icons/tree/main/packages/create-chakra-icons)         | ✅          | [![npm version](https://badge.fury.io/js/create-chakra-icons.svg)](https://www.npmjs.com/package/create-chakra-icons)           |
| [@tooling/tsconfig](https://github.com/kodingdotninja/chakra-icons/tree/main/tooling/ts.conf)                        | ❌          |                                                                                                                                 |
| [@tooling/msrconfig](https://github.com/kodingdotninja/chakra-icons/tree/main/tooling/msr.conf)                      | ❌          |                                                                                                                                 |
| [@chakra-icons/cli](https://github.com/kodingdotninja/chakra-icons/tree/main/tooling/cli)                            | ✅          | [![npm version](https://badge.fury.io/js/@chakra-icons%2Fcli.svg)](https://www.npmjs.com/package/@chakra-icons/cli)             |
| [@chakra-icons/bootstrap](https://github.com/kodingdotninja/chakra-icons/tree/main/packages/@chakra-icons/bootstrap) | ✅          | [![npm version](https://badge.fury.io/js/@chakra-icons%2Fbootstrap.svg)](https://www.npmjs.com/package/@chakra-icons/bootstrap) |
| [@chakra-icons/flat-icon](https://github.com/kodingdotninja/chakra-icons/tree/main/packages/@chakra-icons/flat-icon) | ✅  | [![@chakra-icons/flat-icon version](https://badge.fury.io/js/@chakra-icons%2Fflat-icon.svg)](https://www.npmjs.com/package/@chakra-icons/flat-icon) |
| [@chakra-icons/octicons](https://github.com/kodingdotninja/chakra-icons/tree/main/packages/@chakra-icons/octicons) | ✅  | [![@chakra-icons/octicons version](https://badge.fury.io/js/@chakra-icons%2Focticons.svg)](https://www.npmjs.com/package/@chakra-icons/octicons) |
| [@chakra-icons/tabler-icons](https://github.com/kodingdotninja/chakra-icons/tree/main/packages/@chakra-icons/tabler-icons) | ✅  | [![@chakra-icons/tabler-icons version](https://badge.fury.io/js/@chakra-icons%2Ftabler-icons.svg)](https://www.npmjs.com/package/@chakra-icons/tabler-icons) |
| [@chakra-icons/carbon](https://github.com/kodingdotninja/chakra-icons/tree/main/packages/@chakra-icons/carbon) | ✅  | [![@chakra-icons/carbon version](https://badge.fury.io/js/@chakra-icons%2Fcarbon.svg)](https://www.npmjs.com/package/@chakra-icons/carbon) |
<!-- APPEND_CHAKRA_ICONS_HERE -->
<!-- prettier-ignore-end -->

## Contribution

Feel free for:

- Create Issue, Request Features, & send a pull request.

### How to add new icons

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

- when success generated new package, the package listed in [**./packages/@chakra-icons**](https://github.com/kodingdotninja/chakra-icons/tree/main/packages/@chakra-icons)

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
