import { validate } from '#middleware/validate.js';
import Intersection from '#simulation/infrastructure/Intersection.js';
import Simulation from '#simulation/Simulation.js';
import { SimulationDescription, SimulationDescriptionSchema, SimulationOutput } from '#simulation/types/index.js';
import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT ?? '3000';

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
    console.log('Response sent');
});

app.post(
    '/simulate',
    validate(SimulationDescriptionSchema),
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    (req: Request<{}, SimulationOutput, SimulationDescription>, res: Response<SimulationOutput>) => {
        const { intersectionDescription, commands, controllerType } = req.body;
        const simulation = new Simulation(
            intersectionDescription ?? Intersection.basicIntersection(),
            controllerType ?? 'simple-controller',
        );
        const simulationOutput = simulation.runWithSnapshot(commands);
        res.send(simulationOutput);
    },
);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
