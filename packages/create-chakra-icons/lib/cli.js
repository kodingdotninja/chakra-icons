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
      const {
        name,
        isUseFilename,
        exportNameCase,
        exportNameSuffix,
        exportNamePrefix,
        isTypescript,
        isIgnoreImport,
        outputFile,
        isAppendFile,
        outputType,
      } = getCommonOptions(args);
      const exportNamed = createExportNamed(exportNameCase, exportNamePrefix, exportNameSuffix);
      const source = createCode({
        source: data,
        displayName: exportNamed(name),
        isUseFilename,
        isTypescript,
        isIgnoreImport,
        exportNameSuffix,
        exportNamePrefix,
        outputType,
      });
      return outputFile
        ? isAppendFile
          ? Fs.appendFile(Path.resolve(outputFile), source, (err) => {
              if (err) {
                error.write(err, () => exit(1));
              }
            })
          : Fs.writeFile(Path.resolve(outputFile), source, (err) => {
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
    isAppendFile,
    name,
    isUseFilename,
    exportNameCase,
    exportNameSuffix,
    exportNamePrefix,
    isTypescript,
    isIgnoreImport,
    outputType,
  } = getCommonOptions(args);
  const version = args.V || args.version;

  if (inputs.length > 0) {
    // make code
    const source = createCode(
      ...inputs.reduce(
        stringToInput({
          displayName: name,
          isUseFilename,
          exportNameCase,
          encoding: ENCODING,
          isTypescript,
          isIgnoreImport,
          exportNameSuffix,
          exportNamePrefix,
          outputType,
        }),
        [],
      ),
    );
    // write output in output
    return outputFile
      ? isAppendFile
        ? Fs.appendFile(Path.resolve(outputFile), source, (err) => {
            if (err) {
              error.write(err, () => exit(1));
            }
          })
        : Fs.writeFile(Path.resolve(outputFile), source, (err) => {
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

  --use-filename          Sets use filename for export named declaration.

  --append-file           Sets output write file as append mode
                          (*ONLY for output path provided).

  --ts, --typescript      Sets output as TypeScript code.

  --ignore-import         Sets output without import statement.

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
    isAppendFile: args["append-file"] || false,
    name: args.name || args.n || "Unamed",
    isUseFilename: args["use-filename"] || false,
    isTypescript: args.ts || args.typescript || false,
    isIgnoreImport: args["ignore-import"] || false,
    exportNameCase: args.C || args.case,
    exportNameSuffix: args.S || args.suffix || "",
    exportNamePrefix: args.P || args.prefix || "",
    outputType: String(args.T || args.type),
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
  isUseFilename,
  exportNameCase,
  exportNamePrefix,
  exportNameSuffix,
  encoding,
  isTypescript,
  isIgnoreImport,
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
              isIgnoreImport,
              outputType,
            })),
        );
      } else {
        acc.push({
          displayName: exportNamed(isUseFilename ? Path.basename(str).split(".")[0] : displayName),
          source: Fs.readFileSync(str, encoding),
          isTypescript,
          isIgnoreImport,
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
