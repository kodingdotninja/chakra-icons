<p align="center">
  <label style="font-weight:bold;font-size:200%">Transform SVG to React Chakra UI <Icon \/> ✨ </label>
  <br/><label style="font-weight:bold;font-size:small;font-style:italic">from SVG file to CODE</label>
  <br/>
  <br/>
  <img src="https://raw.githubusercontent.com/kodingdotninja/create-chakra-icons/main/.github/docs/create-chakra-icons.gif" alt="create-chakra-icons" />  
</p>

## Features

- [x] Transform `<SVG/>` to Chakra-UI `Icon` Component or Functional `createIcon(...)`.
  - `<Icon />` Component, [**See**](https://chakra-ui.com/docs/media-and-icons/icon#using-the-icon-component).
  - `createIcon(...)` Functional, [**See**](https://chakra-ui.com/docs/media-and-icons/icon#using-the-createicon-function).
- [x] Multiple input with `directories` or `files` as input value for option `-i` or `--input`.
- [x] Support case in export name declaration (camel|snake|pascal|constant).
- [x] Suffix and Prefix for generated code of export name declaration.
- [x] Support type annotation when code generated is `<Icon />`.

## Usage

### Command Line Arguments

```console
create-chakra-icons [FLAGS] [OPTIONS] [INPUT]
```

### Flags

```console
-h, --help      Prints help information
-V, --version   Prints version information
```

### Options

```console
-i, --input <PATH>      This option for read the input from PATH of FILE or DIRECTORIES.
                        [e.g.: -i some/path , -i file.svg]
-o, --output <PATH>     Writes the output. [default: stdout]
-n, --name <STRING>     Sets value for `displayName` properties
                        (*ONLY for pipelines command). [default: Unamed] [e.g. -n "MyIcon"]
-C, --case <snake|camel|constant|pascal>
                        Sets for case [snake|camel|constant|pascal] in export named declaration
                        output. [default: pascal]
-S, --suffix <STRING>   Sets for suffix in export named declaration.
-P, --prefix <STRING>   Sets for prefix in export named declaration.
                        [e.g.: -S "Icon"]
--ts, --typescript      Sets output as TypeScript code.

-T, --type <TYPE>       TYPE:
                        (F|f). Sets output code with function \`createIcon({...})\`.
                        (C|c). Sets output code with Component Icon \`(props) => <Icon> {...} </Icon>\`.

                        [e.g.: -T C]

```

### Input

```console
[INPUT]     This option for read the input from PATH of FILE or DIRECTORIES.
            [e.g.: create-chakra-icons ./MyICON.svg ~/assets]
```

### Examples

#### Pipelines command:

- **input** in pipe

```console
echo "
<svg viewBox=\"0 0 200 200\">
    <path
      fill=\"#666\"
      d=\"M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0\"
    />
  </svg>
" | create-chakra-icons -n "KodingNinjaIcon"
```

- **output** in stdout

```jsx
import { createIcon } from "@chakra-ui/react";
export const KodingNinjaIcon = createIcon({
  displayName: "KodingNinjaIcon",
  viewBox: "0 0 200 200",
  d: "M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0",
});
```

#### Multiple Input

- **input** `per-file`

```console
create-chakra-icons  -o Icons.js ./Facebook.svg ./Apple.svg ./Amazon.svg ./Netflix.svg ./Google.svg
```

- **input** `directories`

```console
create-chakra-icons  -o Icons.js ./social-icons
```

- **input** `directories and per-file` at the same time

```console
create-chakra-icons  -o Icons.js ./MyCompany.svg ./social-icons
```

- **output** will be make in `Icons.js` (argument `-o` or `--output`).

## Roadmap

- [x] TypeScript Support (Type Annotation or Type Definition).
  - Only when code generated is `<Icon />` component [**See**](https://chakra-ui.com/docs/media-and-icons/icon#using-the-icon-component).
- [ ] ReScript Support.
- [ ] Per file input is Per file output. ⁉️ 🤔
- [ ] Feel free for give me any feedback or feature request (create an issue first).

## Maintainer

- **Rin** ([@ri7nz](//github.com/ri7nz))

## Contribution

Feel free for making an issue, pull request, or give any feedback. 🙌

### Documentation

- Write the documentation 📝, you just need to modify `comments` in `lib/*.js`.
- When you done write the documentation, you just need to run `yarn docs` in the root repository.
- The command `yarn docs` will modify `README.md` and see the changes.

## LICENSE

[See Here](./LICENSE)
