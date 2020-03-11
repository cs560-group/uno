const Collection = require('./collection').Collection

class Player{
    constructor(id, name){
        this.id = id
        this.name = name
        this.hand = new Collection()
        this.myTurn = false
    }

    /**
     * Gets private Player State and players view of other players in game
     * @param {Boolean} all - true if hand and other player information is needed 
     */
    getPublicState(){
        return {
            name: this.name,
            hand: this.hand.getState(),
            myTurn: this.myTurn
        }
    }

    getPrivateState() {
        return {
            name: this.namme,
            hand: this.hand.getState(true),
            myTurn: this.myTurn
        }
    }
}

module.exports = Player;