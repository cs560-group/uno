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
        super(name, name);
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
                let card = this.chooseCard(playableCards)
                if(!card){
                    return false;
                }else if(card.card.isWild){
                    let color = this.chooseColor()
                    return this.game.play(card.index, color)
                }else{
                    return this.game.play(card.index)
                }
            }
        }
    }

    chooseCard(playableCards){
        let cards = playableCards
        let card
        if(this.game.currentPlayerHasPassed){
            card = {card: this.hand.getCard(this.hand.count() - 1), index: this.hand.count() - 1}
        }else{
            if(this.difficulty === 1){
                cards.push(false);
                card = this.selectRandom(cards)
            }else if(this.difficulty === 2){
                cards.sort((a,b) => {return b.points - a.points})                
                if(cards.length > 1){
                    card = this.selectRandom(cards, 0.5)
                }else{
                    card = cards[0]
                }               
            }else if(this.difficulty === 3){
                cards.sort((a,b) => {return b.points - a.points})
                let i = 0;
                card = cards[i]
                while(card.value === "+4" && cards.length > 1){
                    i++
                    card = cards[i]
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

        for(let card of this.hand.cards){
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
        let currentColor = this.game.discards.getTopCard().suit
        let color
        if(this.difficulty === 1){
            color = this.selectRandom(colors).color
            while(color === currentColor){
                color = this.selectRandom(colors).color
            }
        }else if(this.difficulty === 2){
            colors.sort((a,b) => {b.count - a.count})
            color = this.selectRandom(colors, 0.5).color
            while(color === currentColor){
                color = this.selectRandom(colors, 0.5).color
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
        if(this.myTurn && this.game.challengeActive){
            if(this.difficulty === 1){
                return true
            }else if(this.difficulty === 2){
                let choice = [true, false];
                return this.selectRandom(choice)
            }else if(this.difficulty === 3){
                let prevPlayer = this.game.direction === 0 ? this.right : this.left
                if(prevPlayer.hand.count() > 5){
                    return true
                }else{
                    return false
                }
            }
        }
    }

    callUno(){
        if(this.difficulty == 1){
            let options = [true, false, false];
            return this.selectRandom(options);
        }else if(this.difficulty == 2){
            let options = [true, true, true, true, true, true, true, false];
            return this.selectRandom(options);
        }else if(this.difficulty == 3){
            return true;
        }
    }

    selectRandom(collection, mod = 1){
        if(mod <= 1 && mod >= 0){
            let index = Math.floor(Math.random() * collection.length * mod)
            return collection[index]
        }        
    }
}

module.exports = {
    Player: Player,
    Bot: Bot
};
