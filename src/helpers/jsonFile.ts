import { writeFile } from 'fs';

// TODO: add validation using runtypes
export async function load(path: string): Promise<unknown> {
    const commands = await import(path) as unknown;
    return commands;
}

// TODO: better error handling
export function save(data: object, path: string) {
    const stringifiedData = JSON.stringify(data);
    writeFile(path, stringifiedData, (err) => {
        if (err) console.log('Error occured while writing to file: ', err);
    });
}
