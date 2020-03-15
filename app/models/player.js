const Collection = require('./collection').Collection

class Player{
    constructor(id, name){
        this.id = id
        this.name = name
        this.hand = new Collection()
        this.myTurn = false
        this.left = null
        this.right = null
    }

    setLeft(player){
        this.left = player
    }

    setRight(player){
        this.right = player
    }

    /**
     * Gets private Player State and "perspective" of other players
     * @param {Boolean} isPrivate - true if cards in hand and other player information is needed 
     * 
     * Perspective here refers to information about other players visible from this player in game
     * ie. a player's name, whether or not it's a player's turn and the number of cards in their hand
     */
    getState(isPrivate=false){
        if(isPrivate){
            let players = []
            
            if(player.left){
                let player = this            
                while(player.id != this.right.id){
                    player = player.left
                    players.push(player.getState())
                }
            }

            return {
                id: this.id,
                name: this.name,
                hand: this.hand.getState(isPrivate),
                players: players,
                myTurn: this.myTurn
            }            
        }else{
            return {
                name: this.name,
                hand: this.hand.getState(),
                myTurn: this.myTurn
            }    
        }
    }
}

module.exports = Player;
