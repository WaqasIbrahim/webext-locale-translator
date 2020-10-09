
import chalk from 'chalk';
import progress from 'cli-progress';
import translate from 'google-translate-open-api';
import { AllHtmlEntities } from 'html-entities';

import { Locale } from './types';
import supportedLanguages from './languages';

const { log } = console;
const entities = new AllHtmlEntities();

export default class Translator {
    private messageNames: string[];

    private messages: string[] = [];

    private placeholders: string[] = [];

    private ignoredWordsMap: { [key: string]: string } = {};

    constructor(
        private sourceLocale: Locale,
        private sourceLanguage?: string,
        private skipMessageNames: string[] = [],
        ignoreWords: string[] = [],
    ) {
        this.messageNames = Object.keys(sourceLocale);

        // Skip keys
        this.messageNames.forEach((name) => {
            if (skipMessageNames.includes(name)) {
                return;
            }

            this.messages.push(sourceLocale[name].message);
        });

        // Replace placeholders with ids
        this.messages = this.messages.map((message) => message.replace(
            /\$(\w+)\$/g,
            (_, placeholder) => {
                this.placeholders.push(placeholder);
                return `$$$${this.placeholders.length}$$$`;
            },
        ));

        // Replace ignored words with ids and create a map
        ignoreWords.forEach((word, index) => {
            const key = `***${index + 1}***`;
            const regex = new RegExp(`${word}\\b`, 'g');

            // eslint-disable-next-line no-param-reassign
            this.messages = this.messages.map((message) => message.replace(regex, key));
            this.ignoredWordsMap[key] = word;
        });
    }

    public async translate(to: string): Promise<Locale | undefined> {
        if (typeof supportedLanguages[to] === 'undefined') {
            log(`Translating to ${to} - ${chalk.red('Unsupported')}`);
            return;
        }

        log(`Translating to ${to} - ${supportedLanguages[to]}`);

        const translations: string[] = [];

        const bar = new progress.SingleBar({
            format: '[{bar}] {percentage}% | {value}/{total}',
        }, progress.Presets.shades_classic);

        bar.start(this.messages.length, 0);

        for (let i = 0, len = this.messages.length; i < len; i += 1) {
            let data;

            try {
                // eslint-disable-next-line no-await-in-loop
                data = (await translate(this.messages[i], {
                    to,
                    from: this.sourceLanguage,
                })).data;
            } catch (e) {
                bar.stop();
                log(chalk.red(e.message));
                process.exit(1);
            }

            // eslint-disable-next-line no-await-in-loop
            translations.push(Array.isArray(data) ? data[0] : data);
            bar.update(i + 1);
        }

        bar.stop();
        return this.postProcess(translations); // eslint-disable-line consistent-return
    }

    private postProcess(translations: string[]): Locale {
        let messages = translations.map((message) => entities.decode(message));

        // Replace placeholders with original values
        messages = messages.map((message) => message.replace(
            /\$\$\$\s?(\d+)\s?\$\$\$/g,
            (_, num) => `$${this.placeholders[num - 1]}$`,
        ));

        // Replace ignored words with original values
        messages = messages.map((message) => message.replace(
            /\*\*\*\s?(\d+)\s?\*\*\*/g,
            (_, num) => this.ignoredWordsMap[`***${num}***`],
        ));

        // Generate locale
        const locale: Locale = {};
        let skippedCount = 0;

        this.messageNames.forEach((name, i) => {
            locale[name] = this.sourceLocale[name];

            if (this.skipMessageNames && this.skipMessageNames.includes(name)) {
                // Skip overwriting message
                skippedCount += 1;
            } else {
                locale[name].message = messages[i - skippedCount];
            }
        });

        return locale;
    }
}
