const uuid = require('uuid/v4')

const { Collection , Deck } = require('./collection')

class Game{
    constructor(io){

        this.io = io
        this.id = 0

        this.players = []
        
        this.turn = 0
        this.currentIndex = 0;

        this.direction = 1
        this.skip = false

        this.deck = new Deck()
        this.discard = new Collection()

        this.turnDuration = 30;
        this.turnSecondsRemaining = this.turnDuration;
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
        //randomly select first player
        //this.turnPlayer =  this.players[Math.random(Math.floor(this.players.length))];
        this.dealInitialHands();
        this.broadcast("start");
        this.updatePlayersState();
    }

    broadcast(event, data={}) {
        this.players.forEach(player => this.io.to(player.id).emit(event, data));
    }

    emitTo(player, event, data) {
        this.io.to(player.id).emit(event, data);
    }

    updatePlayersState() {
        this.players.forEach(player => {
            let gameState = this.getState();
            gameState.currentPlayer = this.getCurrentPlayer().getPublicState();
            gameState.private = player.getPrivateState();
            this.emitTo(player, "update", gameState);
        })
    }

    dealInitialHands() {
        const cardsPerPlayer = 7;
        const totalCardsToDeal = this.players.length * cardsPerPlayer;
        for (let i = 0; i < totalCardsToDeal; i++){
            this.dealCurrentPlayer();
            this.updateCurrentPlayer();
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
                this.deck.sendCard(0, this.turnPlayer.hand)
                this.updateCurrentPlayer()
                this.resetCountdownTimer();
            }
            --this.turnSecondsRemaining;
        }, oneSecond);
    }

    resetCountdownTimer() {
        this.turnSecondsRemaining = this.turnDuration;
    }

    updateCurrentPlayer() {
        this.getCurrentPlayer().myTurn = false;
        this.updateCurrentIndex();
        this.getCurrentPlayer().myTurn = true;
    }

    /**
     * Determines and sets the next player and resets play timer
     */
    updateCurrentIndex(){
        const currentPlayer = this.getCurrentPlayer();
        this.currentIndex = this.getNextIndex();
    }

    getNextIndex() {
        return ++this.currentIndex % this.players.length;
    }

    /**
     * Sends top card of deck to player's hand
     * @param {Player} player 
     */
    deal(player){
        this.deck.sendCard(0, player.hand)
    }

    dealCurrentPlayer() {
        this.deal(this.getCurrentPlayer());
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
            deck: this.deck.getState(),
            players: this.players.map(player => player.getPublicState())
        }
    }

    getCurrentPlayer() {
        const currentPlayer = this.players[this.currentIndex];
        currentPlayer.myTurn = true;
        return currentPlayer;
    }
}

module.exports = Game;