const uuid = require('uuid/v4')

const Collection = require('./collection').Collection
const Deck = require('./collection').Deck

class Game{
    constructor(io){

        this.io = io
        this.id = 0

        this.players = []
        
        this.turn = 0
        this.turnPlayer = null

        this.direction = 0
        this.skip = false

        this.deck = new Deck()
        this.discard = new Collection()

        this.timer = 30
    }

    genID(){
        this.id = uuid()
    }

    addPlayer(player){
        this.players.push(player)
    }

    /**
     * Arranges Players into ring, determines the starting player, deals starting hands and starts the play timer
     * Broadcasts start event to players
     */
    start(){
        //arrange players into 'ring'
        for(let i = 0; i < this.players.length; i++){
            let player = this.players[i]  
            if(i === this.players.length - 1){
                player.addRight(this.players[0])
            }else{
                let next = this.players[i + 1]
                player.addLeft(next)   
            }
        }

        //randomly select first player
        this.turnPlayer = this.players[Math.random(Math.floor(this.players.length))]

        //Top card from deck goes to discard pile
        this.discard()

        //Deal starting hands to players
        let count = 0
        let player = this.turnPlayer
        while(count < this.players.length * 7){
            this.deal(player)
            player = player.left
        }

        //Start Countdown
        this.countdown()

        //Broadcast start event to all players
        for(let player of this.players){
            this.io.to(player.io).emit('start')
        }
    }
    
    /**
     * Counts down play timer, and broadcasts timer to all players. 
     * Automatically goes to the next turn if it reaches 0.
     */
    countdown(){
        setInterval(() => {
            this.timer --
            this.io.emit('countdown', this.timer)
            if(this.timer === 0){
                //Current player draws if the timer goes to 0 
                this.deck.sendCard(0, this.turnPlayer.hand)
                this.nextTurn()
            }
        }, 1000);
    }

    /**
     * Determines and sets the next player and resets play timer
     */
    nextTurn(){
        this.turnPlayer.myTurn = false
        if(this.direction === 0){
            if(this.skip){
                this.turnPlayer = this.turnPlayer.left.left               
            }else{
                this.turnPlayer = this.turnPlayer.left
            }            
        }else{
            if(this.skip){
                this.turnPlayer = this.turnPlayer.right.right
            }else{
                this.turnPlayer = this.turnPlayer.right
            }  
        }     
        this.skip = false
        this.turnPlayer.myTurn = true  
        this.timer = 30
    }

    /**
     * Reads Card on top of discard and takes appropriate action if necessary
     * *To be implemented*
     */
    readCard(){
        let card = this.discard.getTopCard()
        //Define behaviours
    }

    /**
     * Determines if a card is a legal play, given the current gamestate
     * *To be implemented*
     * @param {Card} card 
     */
    isValid(card){
        let top = this.discard.getTopCard()
        return card.value === top.value || card.suit === top.suit || card.suit === 'wild'
    }

    /**
     * Sends top card of deck to player's hand
     * @param {Player} player 
     */
    deal(player){
        this.deck.sendCard(0, player.hand)
    }

    /**
     * Sends top card of deck to top of discard pile
     */
    discard(){
        this.deck.sendCard(0, this.discard, true)
    }

    /**
     * Determine whether or not a player has won. 
     * @param {Player} player 
     */
    win(player){
        return player.hand.cardCount === 0
    }

    /**
     * Represent public gamestate
     */
    getState(){
        return {
            id: this.id,
            discard: { 
                cards: this.discard.getState(true),
                top: this.discard.getTopCard()
            },
            deck: this.deck.getState()
        }
    }

    /**
     * Sends player-specific gamestate to each player
     */
    update(){
        let game = this.getState()
        for(player of this.players){
            let data = player.getState(true)
            data.game = game
            this.io.to(player.id).emit('update', data)
        }
    }    
}

module.exports = Game