import User from "./User.js";

export default class Map {
    id = crypto.randomUUID();
    name;
    users = [];
    owner = null;
    singleUserProfit = 0;
    level = 0;
    items = [];
    includeInCalculation = true;

    constructor(name) {
        this.name = name
    }
}