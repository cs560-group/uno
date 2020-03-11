const Collection = require('./collection').Collection

class Player{
    constructor(id, name, right=null, left=null){
        this.id = id
        this.name = name
        this.right = right
        this.left = left
        this.hand = new Collection()
        this.myTurn = false
    }

    /**
     * Adds Player to the Left
     * @param {Player} player : player to be added 
     */
    addLeft(player){
        this.left = player
        player.right = this
    }

    /**
     * Adds Player to the Right
     * @param {Player} player 
     */
    addRight(player){
        this.right = player
        player.left = this
    }

    /**
     * Gets private Player State and players view of other players in game
     * @param {Boolean} all - true if hand and other player information is needed 
     */
    getState(all=false){
        if(all){
            let players =  []
            if(player.left){
                let player = this
                while(player.id !== this.right.id){
                    player = player.left
                    players.push(player.getState)
                }
            }
            return {
                id: this.id,
                name: this.name,
                hand: this.hand.getState(true),
                players: players,
                myTurn: this.myTurn
            }
        }else{
            return{
                name: this.name,
                hand: this.hand.getState(),
                myTurn: this.myTurn
            }
        }
    }
}

module.exports = Player