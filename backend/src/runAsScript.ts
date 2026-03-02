import Intersection from '#simulation/infrastructure/Intersection.js';
import Simulation from '#simulation/Simulation.js';
import { SimulationDescription } from '#simulation/types/index.js';
import { load, save } from './helpers/jsonFile.js';

if (process.argv.length === 4) {
    const inputData = (await load(process.cwd() + '/' + process.argv[2])) as SimulationDescription;
    const simulation = new Simulation(
        inputData.intersectionDescription ?? Intersection.basicIntersection(),
        inputData.controllerType ?? 'simple-controller',
    );
    const simulationOutput = simulation.run(inputData.commands);
    save({ stepStatuses: simulationOutput }, process.cwd() + '/' + process.argv[3]);
} else {
    console.log(
        `Wrong arguments count ${process.argv.length.toString()}. Usage: npm run simulate -- inputFile.json outputFile.json`,
    );
    process.exitCode = 1;
}
