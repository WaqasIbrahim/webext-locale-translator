
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { Locale } from './types';

export default (
    languageCode: string,
    locale: Locale,
): void => {
    if (!existsSync('_locales')) {
        mkdirSync('_locales');
    }

    // Chrome uses zh_CN instead of zh-CN
    // eslint-disable-next-line no-param-reassign
    languageCode = languageCode.replace('-', '_');

    if (!existsSync(`_locales/${languageCode}`)) {
        mkdirSync(`_locales/${languageCode}`);
    }

    writeFileSync(
        `./_locales/${languageCode}/messages.json`,
        JSON.stringify(locale, null, 4),
        { encoding: 'utf-8' },
    );
};
