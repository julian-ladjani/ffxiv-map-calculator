export default class User {
    name;
    id = crypto.randomUUID();

    constructor(name) {
        this.name = name
    }
}