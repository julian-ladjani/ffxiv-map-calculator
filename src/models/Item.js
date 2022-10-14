export default class Item {
    id;
    name;
    icon;
    url;
    price;

    constructor(id, name, url, icon) {
        this.name = name
        this.id = id
        this.url = url
        this.icon = icon
        this.price = 0
    }
}