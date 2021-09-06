#!/usr/bin/env node
const {
  name: packageName,
  version: packageVersion,
} = require("./package.json");
const Fs = require("fs");
const Path = require("path");
const BabelGenerator = require("@babel/generator").default;
const argv = require("minimist")(process.argv.slice(2));
const { createChakraIcon } = require("./lib/chakra");
const {
  stdout: output,
  stdin: input,
  exit,
  stderr: error,
} = require("process");
const {
  pascalCase: PascalCase,
  camelCase,
  snakeCase: snake_case,
  constantCase: CONSTANT_CASE,
} = require("change-case");
const encoding = "utf-8";

if (input.isTTY) {
  main(argv);
} else {
  input.setEncoding(encoding);
  input.on("data", function (data) {
    if (data) {
      const { name, exportNameCase, isTypescript, outputFile } =
        getCommonOptions(argv);
      const source = createCode({
        source: data,
        displayName: stringToCase(name, exportNameCase),
        isTypescript,
      });
      return outputFile
        ? Fs.writeFile(Path.resolve(outputFile), source, (err) => {
            if (err) {
              error.write(err, () => exit(1));
            }
          })
        : output.write(source);
    }
  });
}

function createCode(...sources) {
  const icon = createChakraIcon(...sources);
  return BabelGenerator(icon).code;
}

function stringToCase(str, _case) {
  return {
    [true]: PascalCase(str),
    [_case === "pascal"]: PascalCase(str),
    [_case === "camel"]: camelCase(str),
    [_case === "constant"]: CONSTANT_CASE(str),
    [_case === "snake"]: snake_case(str),
  }[true];
}

function stringToInput({
  displayName,
  exportNameCase,
  encoding,
  isTypescript,
}) {
  return function (acc, str) {
    if (Fs.existsSync(str)) {
      if (Fs.lstatSync(str).isDirectory()) {
        const pathResolved = Path.resolve(str);
        acc.push(
          ...Fs.readdirSync(pathResolved)
            .filter((f) => f.split(".")[1] === "svg")
            .map((f) => Path.join(pathResolved, f))
            .map((source) => ({
              displayName: stringToCase(
                Path.basename(source).split(".")[0],
                exportNameCase
              ),
              source: Fs.readFileSync(source, encoding),
              isTypescript,
            }))
        );
      } else {
        acc.push({
          displayName: stringToCase(displayName, exportNameCase),
          source: Fs.readFileSync(str, encoding),
          isTypescript,
        });
      }
    }
    return acc;
  };
}
function getCommonOptions(args) {
  return {
    inputs: (args.i && [args.i]) || (args.input && [args.input]) || args._,
    outputFile: args.o || args.output,
    name: args.name || args.n || "Unamed",
    isTypescript: args.ts || args.typescript || false,
    exportNameCase: args.C || args.case,
  };
}
// :: [Object] -> () *Effect*
function main(args) {
  const { inputs, outputFile, name, exportNameCase, isTypescript } =
    getCommonOptions(args);
  const version = args.V || args.version;

  if (inputs.length > 0) {
    // make code
    const source = createCode(
      ...inputs.reduce(
        stringToInput({
          displayName: name,
          exportNameCase,
          encoding,
          isTypescript,
        }),
        []
      )
    );
    // write output in output
    return outputFile
      ? Fs.writeFile(Path.resolve(outputFile), source, (err) => {
          if (err) {
            error.write(err, () => exit(1));
          }
        })
      : output.write(`${source}`);
  } else if (version) {
    return output.write(packageVersion);
  }

  output.write(`
USAGE:  ${packageName} [FLAGS] [OPTIONS] [INPUT]

By default, output is written to stdout.
Stdin is read if is piped to create-chakra-icons.

FLAGS:
  -h, --help      Prints help information
  -V, --version   Prints version information


OPTIONS:
  -i, --input <PATH>      This option for read the input from PATH from FILE or DIRECTORIES.
                          [e.g.: -i some/path , -i file.svg]
  -o, --output <PATH>     Writes the output. [default: stdout]
  -n, --name <STRING>     Sets value for \`displayName\` properties
                          (*ONLY for pipelines command). [default: Unamed] [e.g. -n "MyIcon"]
  -C, --case <snake|camel|constant|pascal>     
                          Sets for case [snake|camel|constant|pascal] in export named declaration 
                          output. [default: pascal]

  -S, --suffix <STRING>   Sets for suffix in export named declaration.
  -P, --prefix <STRING>   Sets for prefix in export named declaration.

                          [e.g.: -S "Icon"]
  --ts, --typescript      Sets output as TypeScript code. (UNAVAILABLE, SOON).


[INPUT]:    This option for read the input from PATH of FILE or DIRECTORIES.
            [e.g.: create-chakra-icons ./MyICON.svg ~/assets] 

${packageName} (version: ${packageVersion})
`);
}
