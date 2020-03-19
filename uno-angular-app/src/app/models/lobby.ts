export default class Lobby {
    id: string;
    name: string;
    members: string[];

    constructor(name: string, members: string[] = []) {
        this.id = Math.random().toString().charAt(2);
        this.name = name;
        this.members = members;
    }
}