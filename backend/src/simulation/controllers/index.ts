import SimpleController from './SimpleController.js';
import WithArrows from './WithArrows.js';

export default {
    'simple-controller': () => new SimpleController(),
    'with-arrows': () => new WithArrows(),
};

export const controllerTypes = ['simple-controller', 'with-arrows'] as const;
