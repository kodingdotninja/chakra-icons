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
  constantCase: CONSTANT_CASE,
} = require("change-case");
const encoding = "utf-8";

if (input.isTTY) {
  main(argv);
} else {
  input.setEncoding(encoding);
  input.on("data", function (data) {
    if (data) {
      const name = argv.name || argv.n || "Unamed";
      const exportNameCase = argv.C || argv.case;
      const source = createCode(name, {
        source: data,
        displayName: stringToCase(name, exportNameCase),
      });
      output.write(source);
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
  }[true];
}

function stringToInput({ displayName, exportNameCase, encoding }) {
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
            }))
        );
      } else {
        acc.push({
          displayName: stringToCase(displayName, exportNameCase),
          source: Fs.readFileSync(str, encoding),
        });
      }
    }
    return acc;
  };
}
// :: [Object] -> () *Effect*
function main(args) {
  const inputs = (args.i && [args.i]) || (args.input && [args.input]) || args._;
  const version = args.V || args.version;
  const outFile = args.o || args.output;
  const name = args.name || args.n || "Unamed";
  const exportNameCase = args.C || args.case;

  if (inputs.length > 0) {
    // make code
    const source = createCode(
      name,
      ...inputs.reduce(
        stringToInput({ displayName: name, exportNameCase, encoding }),
        []
      )
    );
    // write output in output
    return outFile
      ? Fs.writeFile(Path.resolve(outFile), source, (err) => {
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
                          [e.g.: -S "Icon"]
  --ts, --typescript      Sets output as TypeScript code. (UNAVAILABLE, SOON).


[INPUT]:    This option for read the input from PATH of FILE or DIRECTORIES.
            [e.g.: create-chakra-icons ./MyICON.svg ~/assets] 

${packageName} (version: ${packageVersion})
`);
}
