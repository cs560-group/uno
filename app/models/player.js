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
            
            if(this.left){
                let player = this;     
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

class Bot extends Player{
    constructor(name, game, difficulty){
        super(null, name);
        this.game = game;
        this.difficulty = difficulty;
        this.isBot = true;
    }

    getPlayableCards(){
        let playableCards = []
        for(let card of this.hand.cards){
            if(this.game.isPlayable(card)){
                playableCards.push(card)
            }
        }
        return playableCards
    }

    playCard(){
        if(this.myTurn){
            let playableCards = this.getPlayableCards()
            if(playableCards.length === 0){
                return false;
            }else{
                if(this.difficulty === 1){
                    playableCards.push(false);
                    let card = this.playableCards[Math.floor(Math.random() * playableCards.length)]
                    return card
                }else if(this.difficulty === 2){
                    playableCards.sort((a,b) => {return b.points - a.points})
                    let card
                    if(playableCards.length > 1){
                        card = this.playableCards[Math.floor(Math.random() * playableCards.length / 2)]
                    }else{
                        card = this.playableCards[0]
                    }
                    return card                
                }else if(this.difficulty === 3){
                    playableCards.sort((a,b) => {return b.points - a.points})
                    let card = playableCards[0]
                    if(card.value === "+4" && playableCards.length > 1){
                        card = playableCards[1]
                    }
                    return card
                }
            }
        }
    }

    challenge(){
        if(this.myTurn){
            if(this.game.discard.getTopCard().value === "+4"){
                if(this.difficulty === 1){
                    return true
                }else if(this.difficulty === 2){
                    let choice = [true, false];
                    return choice[Math.floor(Math.random() * choice.length)]
                }else if(this.difficulty === 3){
                    let prevPlayer = this.game.direction === 0 ? this.right : this.left
                    if(prevPlayer.hand.count() > 4){
                        return true
                    }else{
                        return false
                    }
                }
            }
        }
    }
}

module.exports = {
    Player: Player,
    Bot: Bot
};
