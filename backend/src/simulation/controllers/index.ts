import SimpleController from './SimpleController.js';

export default {
    'simple-controller': new SimpleController(),
};

export const controllerTypes = ['simple-controller'] as const;
