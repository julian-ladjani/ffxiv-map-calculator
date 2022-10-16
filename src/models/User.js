export default class User {
    name;
    id = crypto.randomUUID();

    constructor(name) {
        this.name = name
    }

    static UnknownUser() {
        let user = new User("Aucun joueur")
        user.id = null
        return user
    }
}