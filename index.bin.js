#!/usr/bin/env node
const Fs = require("fs");
const Path = require("path");
const BabelGenerator = require("@babel/generator").default;
const argv = require("minimist")(process.argv.slice(2));
const { createChakraIcon } = require("./lib/chakra");
const { stdout: output, stdin: input, exit } = process;
const encoding = "utf-8";
if (input.isTTY) {
  main(argv);
} else {
  input.setEncoding(encoding);
  input.on("data", function (data) {
    if (data) {
      const name = argv.name || argv.n || "Unamed";
      const source = createCode(name, {
        file: data,
        displayName: name,
      });
      output.write(source);
    }
  });
}

function createCode(name, ...svgs) {
  const icon = createChakraIcon(name, ...svgs);
  return BabelGenerator(icon).code;
}
// :: [Object] -> () *Effect*
function main(args) {
  const fileOrDirs = args.i || args.input;
  const outFile = args.o || args.output;
  const name = args.name || args.n || "Unamed";

  // check is {file} exist
  Fs.exists(fileOrDirs, (isExist) => {
    if (!isExist) {
      console.error("Cannot handle input") && exit(1);
    }
    // all the input will put in an array {_files}
    let _files = [];
    // handle when {-i} || {--input} is file.svg or dirs/
    if (Fs.lstatSync(fileOrDirs).isDirectory()) {
      const pathResolved = Path.resolve(fileOrDirs);
      _files = _files.concat(
        Fs.readdirSync(pathResolved)
          .filter((f) => f.split(".")[1] === "svg")
          .map((f) => Path.join(pathResolved, f))
      );
    } else {
      _files = _files.concat([fileOrDirs]);
    }
    // make code
    const source = createCode(
      name,
      ..._files.map((_file) => ({
        file: Fs.readFileSync(_file, encoding),
        displayName: (() => {
          const [_name] = Path.basename(_file).split(".") || [name];
          return _name;
        })(),
      }))
    );
    // write output in output
    outFile
      ? Fs.writeFile(Path.resolve(outFile), source, (err) => {
          if (err) {
            console.log(err) && exit(1);
          }
        })
      : output.write(source);
  });
}
