
import { program } from 'commander';
import chalk from 'chalk';
import { readFileSync, existsSync } from 'fs';

import { Locale } from './types';
import supportedLanguages from './languages';
import Translator from './Translator';
import writeLocale from './write-locale';

const { log } = console;

export default async (): Promise<void> => {
    const source = program.source as string;
    let translateTo = program.to as string[] | undefined;
    const translateFrom = program.from as string | undefined;
    const skipMessageNames = program.skip as string[] | undefined;
    const ignoreWords = program.ignoreWords as string[] | undefined;

    if (!existsSync(source)) {
        throw new Error('Source file does not exist');
    }

    const file = readFileSync(source, { encoding: 'utf-8' });
    const sourceLocale: Locale = JSON.parse(file);
    const translator = new Translator(sourceLocale, translateFrom, skipMessageNames, ignoreWords);

    if (typeof translateTo === 'undefined') {
        log(chalk.yellow('-t, --to option not specified, translating to all supported locales.'));
        translateTo = Object.keys(supportedLanguages);
    }

    for (let i = 0, len = translateTo.length; i < len; i += 1) {
        const languageCode = translateTo[i];

        // eslint-disable-next-line no-await-in-loop
        const locale = await translator.translate(languageCode);

        if (locale) {
            writeLocale(languageCode, locale);
            log(chalk.green('DONE'));
        }
    }
};
