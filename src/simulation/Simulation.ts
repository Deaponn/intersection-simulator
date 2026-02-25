export default class Simulation {
    public step(): string {
        return '';
    }

    public run(): string[] {
        return [this.step(), this.step(), this.step()];
    }
}
