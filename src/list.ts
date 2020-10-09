
import chalk from 'chalk';
import languages from './languages';

const { log } = console;

export default (): void => {
    Object.keys(languages).forEach((code) => {
        log(`${chalk.green(code)}\t${languages[code]}`);
    });
};
