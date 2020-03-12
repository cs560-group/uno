const uuid = require('uuid/v4')

const { Collection , Deck } = require('./collection')

class Game{
    constructor(io){

        this.io = io
        this.id = 0

        this.players = []
        
        this.turn = 0
        this.currentPlayer = null

        this.direction = 1
        this.skip = false

        this.deck = new Deck()
        this.discard = new Collection()

        this.turnDuration = 15;
        this.turnSecondsRemaining = this.turnDuration;
    }

    genID(){
        this.id = uuid()
    }

    addPlayer(player){
        this.players.push(player)
    }

    /**
     * Arranges Players into ring, determines the starting player, deals starting hands, starts the play timer and discards card from deck.
     * Broadcasts start event to players
     */
    start(){
        this.createRing()

        this.currentPlayer = this.players[Math.floor(Math.random() * this.players.length)]
        this.currentPlayer.myTurn = true

        const cardsPerPlayer = 7;
        const totalCardsToDeal = this.players.length * cardsPerPlayer;
        
        let player = this.currentPlayer
        for(let i = 0; i < totalCardsToDeal; i++){
            this.dealCard(player)
            player = player.left
        }

        this.broadcast('start', this.id)

        this.discardCard()

        this.countdown()
        this.update()
    }

    /**
     * Sets left and right of each player to create ring
     */
    createRing(){
        for(let i = 0; i < this.players.length; i++){
            let player = this.players[i]
            let next = this.players[(i + 1) % this.players.length]
            player.setLeft(next)
            next.setRight(player)
        }
    }

    /**
     * Counts down play timer, and broadcasts timer to all players. 
     * Automatically goes to the next turn if it reaches 0.
     */
    countdown(){
        const oneSecond = 1000;
        setInterval(() => {
            this.io.emit('countdown', this.turnSecondsRemaining)
            if(this.turnSecondsRemaining <= 0) {
                //Current player draws if the timer goes to 0 
                this.dealCard(this.currentPlayer)
                this.nextTurn()
            }
            --this.turnSecondsRemaining;
        }, oneSecond);
    }

    /**
     * Sets the seconds remaining in the turn to the turn duration
     */
    resetCountdownTimer() {
        this.turnSecondsRemaining = this.turnDuration;
    }

    /**
     * Changes current player based on direction and skip, resets coundown timer
     */
    nextTurn(){
        this.currentPlayer.myTurn = false
        if(this.direction === 1){
            if(this.skip){
                this.currentPlayer = this.currentPlayer.left.left
            }else{
                this.currentPlayer = this.currentPlayer.left
            }
        }else{
            if(this.skip){
                this.currentPlayer = this.currentPlayer.right.right
            }else{
                this.currentPlayer = this.currentPlayer.right
            }
        }

        this.skip = false
        this.currentPlayer.myTurn = true
        this.turn++
        
        this.resetCountdownTimer()
        this.update()
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
    dealCard(player){
        this.deck.sendCard(0, player.hand)
    }

    /**
     * Sends top card of deck to top of discard pile
     */
    discardCard(){
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
            deck: this.deck.getState(),
            currentPlayer: this.currentPlayer.name
        }
    }

    /**
     * Sends data to each player from its own "perspective"
     */
    update(){
        let game = this.getState()

        for(player of this.players){
            let data = player.getState(true)
            data.game = game

            this.emitTo(player, 'update', data)
            console.log(data)
        }
    }

    /**
     * Sends data to all players in game
     * @param {String} event 
     * @param {*} data 
     */
    broadcast(event, data={}) {
        this.players.forEach(player => this.io.to(player.id).emit(event, data));
    }

    /**
     * Send data to one player
     * @param {Player} player 
     * @param {String} event 
     * @param {*} data 
     */
    emitTo(player, event, data) {
        this.io.to(player.id).emit(event, data);
    }
}

module.exports = Game;
