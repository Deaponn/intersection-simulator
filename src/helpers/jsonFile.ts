import { writeFile } from 'fs';

// TODO: add validation using runtypes
export function load(path: string): unknown {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const commands = require(path) as unknown;
    return commands;
}

// TODO: better error handling
export function save(data: object, path: string) {
    const stringifiedData = JSON.stringify(data);
    writeFile(path, stringifiedData, (err) => {
        if (err) console.log('Error occured while writing to file: ', err);
    });
}
