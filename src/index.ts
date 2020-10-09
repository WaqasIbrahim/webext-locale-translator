#!/usr/bin/env node

import { help, program } from 'commander';

import list from './list';
import translate from './translate';

function parseList(value: string): string[] {
    return value.split(',').map((v) => v.trim());
}

program
    .version('1.0.0')
    .description('Translate Chrome extension and WebExtension locale files using Google Translate API')
    .option('-l, --list', 'Lists all supported languages')
    .option('-s, --source <source>', 'Source locale file')
    .option('-t, --to <codes>', 'List of language codes', parseList)
    .option('-f, --from <code>', 'Source language code')
    .option('-s, --skip <names>', 'List of message names to ignore', parseList)
    .option('-i, --ignore-words <words>', 'List of words to ignore', parseList)
    .parse(process.argv);

if (program.list) {
    list();
} else if (program.source) {
    translate();
} else {
    help();
}
