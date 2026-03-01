import { writeFile } from 'fs';

// TODO: add validation using runtypes
export async function load(path: string): Promise<unknown> {
    const commands = (await import(path)) as unknown;
    return commands;
}

export function save(data: object, path: string) {
    const stringifiedData = JSON.stringify(data, undefined, 4);
    writeFile(path, stringifiedData, (err) => {
        if (err) console.log('Error occured while writing to file: ', err);
    });
}
