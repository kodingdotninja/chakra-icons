/* eslint-disable new-cap */

const { name: packageName, version: packageVersion } = require("../package.json");
const Fs = require("fs");
const Path = require("path");
const BabelGenerator = require("@babel/generator").default;
const { createChakraIcon } = require("./chakra");
const { stringToCase, compose } = require("./utils");
const { stdout: output, stdin: input, exit, stderr: error } = require("process");

const ENCODING = "utf-8";

function pipeline(args) {
  input.setEncoding(ENCODING);
  input.on("data", (data) => {
    if (data) {
      const { name, exportNameCase, exportNameSuffix, exportNamePrefix, isTypescript, outputFile, outputType } =
        getCommonOptions(args);
      const exportNamed = createExportNamed(exportNameCase, exportNamePrefix, exportNameSuffix);
      const source = createCode({
        source: data,
        displayName: exportNamed(name),
        isTypescript,
        exportNameSuffix,
        exportNamePrefix,
        outputType,
      });
      return outputFile
        ? Fs.writeFile(Path.resolve(outputFile), source, (err) => {
            if (err) {
              error.write(err, () => exit(1));
            }
          })
        : output.write(source);
    }
    return null;
  });
}

function main(args) {
  const {
    inputs,
    outputFile,
    name,
    exportNameCase,
    exportNameSuffix,
    exportNamePrefix,
    isTypescript,
    outputType,
    multiFileOutput,
  } = getCommonOptions(args);
  const version = args.V || args.version;

  if (inputs.length > 0) {
    // make code
    const reducedInputs = inputs.reduce(
      stringToInput({
        displayName: name,
        exportNameCase,
        encoding: ENCODING,
        isTypescript,
        exportNameSuffix,
        exportNamePrefix,
        outputType,
      }),
      [],
    );
    if (multiFileOutput) {
      // iterate through inputs, generate code and write to file
      reducedInputs.forEach((fileInput) => {
        const source = createCode(fileInput);
        return outputFile
          ? Fs.writeFile(
              Path.resolve(outputFile, `${fileInput.displayName}${isTypescript ? ".ts" : ".js"}`),
              source,
              (err) => {
                if (err) {
                  error.write(err, () => exit(1));
                }
              },
            )
          : output.write(`${source}`);
      });
      return true;
    } else {
      const source = createCode(...reducedInputs);
      // write output in output
      return outputFile
        ? Fs.writeFile(Path.resolve(outputFile), source, (err) => {
            if (err) {
              error.write(err, () => exit(1));
            }
          })
        : output.write(`${source}`);
    }
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
  -o, --output <PATH>     Writes the output or sets output directory. [default: stdout]
  -n, --name <STRING>     Sets value for \`displayName\` properties
                          (*ONLY for pipelines command). [default: Unamed] [e.g. -n "MyIcon"]
  -C, --case <snake|camel|constant|pascal>
                          Sets for case [snake|camel|constant|pascal] in export named declaration
                          output. [default: pascal]

  -S, --suffix <STRING>   Sets for suffix in export named declaration.
  -P, --prefix <STRING>   Sets for prefix in export named declaration.

                          [e.g.: -S "Icon"]

  --m, --multi             Creates separate output for each input.

  --ts, --typescript      Sets output as TypeScript code.

  -T, --type <TYPE>       TYPE:
                          (F|f). Sets output code with function \`createIcon({...})\`.
                          (C|c). Sets output code with Component Icon \`(props) => <Icon> {...} </Icon>\`.

                          [e.g.: -T C]


[INPUT]:    This option for read the input from PATH of FILE or DIRECTORIES.
            [e.g.: create-chakra-icons ./MyICON.svg ~/assets]

${packageName} (version: ${packageVersion})
`);
  return null;
}

function getCommonOptions(args) {
  return {
    inputs: (args.i && [args.i]) || (args.input && [args.input]) || args._,
    outputFile: args.o || args.output,
    name: args.name || args.n || "Unamed",
    isTypescript: args.ts || args.typescript || false,
    exportNameCase: args.C || args.case,
    exportNameSuffix: args.S || args.suffix || "",
    exportNamePrefix: args.P || args.prefix || "",
    outputType: String(args.T || args.type),
    multiFileOutput: args.m || args.multi || false,
  };
}

function createExportNamed(exportNameCase, exportNamePrefix, exportNameSuffix) {
  return compose(
    (str) => stringToCase(str, exportNameCase),
    (str) => `${str}${exportNameSuffix}`,
    (str) => `${exportNamePrefix}${str}`,
  );
}

// eslint-disable-next-line no-shadow
function stringToInput({
  displayName,
  exportNameCase,
  exportNamePrefix,
  exportNameSuffix,
  encoding,
  isTypescript,
  outputType,
}) {
  const exportNamed = createExportNamed(exportNameCase, exportNamePrefix, exportNameSuffix);

  return (acc, str) => {
    if (Fs.existsSync(str)) {
      if (Fs.lstatSync(str).isDirectory()) {
        const pathResolved = Path.resolve(str);
        acc.push(
          ...Fs.readdirSync(pathResolved)
            .filter((f) => f.split(".")[1] === "svg")
            .map((f) => Path.join(pathResolved, f))
            .map((source) => ({
              displayName: exportNamed(Path.basename(source).split(".")[0]),
              source: Fs.readFileSync(source, encoding),
              isTypescript,
              outputType,
            })),
        );
      } else {
        acc.push({
          displayName: exportNamed(displayName),
          source: Fs.readFileSync(str, encoding),
          isTypescript,
          outputType,
        });
      }
    }
    return acc;
  };
}

function createCode(...sources) {
  const icon = createChakraIcon(...sources);
  return BabelGenerator(icon).code;
}

module.exports = { main, pipeline };
