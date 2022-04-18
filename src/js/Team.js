export default class Team {
    constructor() {
        this.members = [];

    }

    *[Symbol.iterator]() {
        for (const item of this.members) {
            yield item;
        }
    }

    add(Character) { 
        this.members.push(Character)
    }
}
