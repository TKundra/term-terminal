#! /usr/bin/env node

import chalk from "chalk";
import yargs from "yargs";
import utils from "./utils.js";
import boxen from "boxen";
import translate from "@vitalets/google-translate-api";

const usg = chalk.yellow("\nUsage: term <lang_name> sentence to be translated");
const options = yargs(process.argv.slice(2)).usage(usg).option("l", {
    alias: "languages",
    description: "list all supported languages",
    type: "boolean",
    demandOption: false
})
.help(true)
.version("1.0.0")
.argv;

// console.log(options)
(function(){
    if (options.l == true || options.languages == true) {
        utils.showAll();
        return;
    }

    if (options._[0].toLowerCase() == "search") {
        console.log(utils.search(options._[1]));
        return;
    }
    
    if (options._[0] == null) {
        utils.showHelp();
        return;
    }
    
    if (options._[0])
        var language = options._[0].toLowerCase(); // stores the language
    
    var sentence = utils.parseSentence(options._);
    
    if (sentence == "") {
        console.error(chalk.red.bold("\nThe entered sentence is like John Cena, I can't see it!\n"))
        console.log(chalk.blue("Enter term --help to get started.\n"))
        return;
    }
    
    //parsing the language specified to the ISO-639-1 code.
    language = utils.parseLanguage(language);
    
    //terminating the program if the language is unsupported.
    if (language == null) {
        return;
    }

    translate(sentence, {to: language}).then(res => {
        console.log("\n" + boxen(chalk.green("\n" + res.text + "\n"), {padding: 1, borderColor: 'green', dimBorder: true}) + "\n");
    }).catch(err => {
	    console.error(chalk.red("something went wrong!"));
        utils.showHelp();
	});

})()

/*
1. create folder bin in root dir
2. inside bin create index.js. This is going to be the entry point of CLI.
3. in package.json change main to bin/index.js
4. set entry point
    "bin": {
        "term": "./bin/index.js"
    }, // term - is keyword for calling CLI
5. 

yargs: helps you to build interactive CLI tools, by parsing args and generating an elegent UI.
chalk: make use of terminal colors
boxen: to decorate output

to access CLI install it globally npm install -g .

package.json
"type": "module", // to make use of ES6 modules

    first line starts with #! shebang line. A shebang line is use to specify the absolute
    path to the interpreter that will run below code. The sheband line use in Linux and UNIX
    type systems but node requires it for Windows and MacOS too, for proper installation and
    execution of the script.
    All the arguments that you pass with the command get stored under the list options._
    unless the arguement begin with a - or a -- in that case, it is treated as a flag with
    a default value of boolean.

term --help
    Usage: term <lang_name> sentense to be translated

    Options:
    -l, --languages  list all supported languages.                       [boolean]
        --version    Show version number                                 [boolean]
        --help       Show help                                           [boolean]

console.log(options)
    { _: [], languages: true, l: true, '$0': 'term' }

working commands:
    term --version {CLI version}
    term --languages {give list of all avaiable languages}
    term --help {help text}
    term search <language_code> {return language name corresponding to language code}
    term <lang_code> <sentence> {return translated sentense corresponing to code}
*/