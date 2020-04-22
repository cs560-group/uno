const Collection = require('./collection').Collection

class Player{
    constructor(id, name){
        this.id = id
        this.name = name
        this.hand = new Collection()
        this.myTurn = false
        this.left = null
        this.right = null
        this.clickUno = false;
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
        for(let i = 0; i < this.hand.cards.length; i++){
            let card = this.hand.getCard(i)
            if(this.game.isPlayable(card)){
                playableCards.push({card: card, index: i})
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
                
                let card = this.chooseCard()

                if(card.card.isWild){
                    let color = this.chooseColor()
                    return this.game.playCard(card.index, color)
                }else{
                    return this.game.playCard(card.index)
                }
            }
        }
    }

    chooseCard(){
        let card

        if(this.game.currentPlayerHasPassed){
            card = {card: this.hand.getCard(this.hand.count() - 1), index: this.hand.count() -1}
        }else{
            if(this.difficulty === 1){
                playableCards.push(false);
                card = this.playableCards[Math.floor(Math.random() * playableCards.length)]
            }else if(this.difficulty === 2){
                playableCards.sort((a,b) => {return b.points - a.points})
                if(playableCards.length > 1){
                    card = this.playableCards[Math.floor(Math.random() * playableCards.length / 2)]
                }else{
                    card = this.playableCards[0]
                }               
            }else if(this.difficulty === 3){
                playableCards.sort((a,b) => {return b.points - a.points})
                let i = 0;
                card = playableCards[i]
                while(card.value === "+4" && playableCards.length > 1){
                    i++
                    card = playableCards[i]
                }
            }
        }

        return card
    }

    getColors(){
        let red = {color: 'red', count: 0, points: 0}
        let green = {color: 'green', count: 0, points: 0}
        let yellow = {color: 'yellow', count: 0, points: 0}
        let blue = {color: 'blue', count: 0, points: 0}
        let colors = [red, green, yellow, blue]

        for(let card of this.hands.card){
            let color = card.suit
            if(color === 'red'){
                red.count ++
                red.points += card.points
            }else if(color === 'green'){
                green.count ++
                green.points += card.points
            }else if(color === 'yellow'){
                yellow.count ++
                yellow.points += card.points
            }else if(color === 'blue'){
                blue.count ++
                blue.points += card.points
            }
        }

        return colors
    }

    chooseColor(){

        let colors = this.getColors()

        let currentColor = this.game.discard.getTopCard().suit

        if(this.difficulty === 1){
            let color = colors[Math.floor(Math.random() * colors.length)]
            while(color.color === currentColor){
                color = colors[Math.floor(Math.random() * colors.length)]
            }
        }else if(this.difficulty === 2){
            colors.sort((a,b) => {b.count - a.count})
            let color = colors[Math.floor(Math.random() * colors.length / 2)]
            while(color.color === currentColor){
                color = colors[Math.floor(Math.random() * colors.length / 2)]
            }
        }else if(this.difficulty === 3){
            colors.sort((a,b) => {b.count * b.points - a.count * a.points})
            let i = 0
            color = colors[i].color
            while(color.color === currentColor){
                i++
                color = colors[i].color
            }
        }

        return color
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
