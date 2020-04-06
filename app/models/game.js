const { Collection , Deck } = require('./collection')

class Game{
    constructor(id, io, players=[], duration=15){
        this.id = id;
        this.io = io
        this.deck = new Deck();
        this.discards = new Collection();
        this.players = players;
        this.turn = 0;
        this.currentPlayer = null;
        /**
         * Directions:
         * 1 - left
         * 0 - right
         */
        this.direction = 1;
        this.skip = false;
        this.turnDuration = duration;
        this.turnSecondsRemaining = this.turnDuration;
        this.currentPlayerHasPassed = false;
        this.done = false;
    }

    addPlayer(player){
        this.players.push(player);
        this.createRing();
    }

    /**
     * Arranges Players into ring, determines the starting player, deals starting hands, starts the play timer and discards card from deck.
     * Broadcasts start event to players
     */
    start(){
        this.createRing();
        this.currentPlayer = this.players[Math.floor(Math.random()*this.players.length)];
        this.currentPlayer.myTurn = true;
        this.dealInitialHands();
        this.discardTopOfDeck();
        this.broadcast("start", this.id);
        this.countdown();
        this.update();
    }

    /**
     * Deals initial hands to all players
     */
    dealInitialHands() {
        const cardsPerPlayer = 7;
        const totalCardsToDeal = this.players.length * cardsPerPlayer;
        for (let i = 0; i < totalCardsToDeal; i++) {
            this.dealCurrentPlayer();
            this.nextTurn();
        }
    }

    /**
     * Sets left and right of each player to create ring
     */
    createRing() {
        for(let i = 0; i < this.players.length; i++) {
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
    countdown() {
        const oneSecond = 1000;
        setInterval(() => {
            this.io.emit('countdown', this.turnSecondsRemaining)
            if(this.turnSecondsRemaining <= 0) {
                //Current player draws if the timer goes to 0
                this.dealCurrentPlayer();
                this.nextTurn();
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
     * Sets new current player, increments turn count and resets countdown timer
     */
    nextTurn() {
        this.currentPlayerHasPassed = false;        
        this.currentPlayer = this.nextPlayer()
        this.currentPlayer.myTurn = true
        
        this.skip = false
        this.turn++
        
        this.resetCountdownTimer();
        this.update();
    }

    /**
     * Determines next player
     * @returns {Player} Next Player
     */
    nextPlayer(){
        this.currentPlayer.myTurn = false
        if(this.direction === 1){
            if(this.skip){
                return this.currentPlayer.left.left
            }else{
                return this.currentPlayer.left
            }
        }else{
            if(this.skip){
                return this.currentPlayer.right.right
            }else{
                return this.currentPlayer.right
            }
        }
    }

    /**
     * @returns {Card} A copy of the dealt card
     */
    dealCurrentPlayer() {
        return this.deal(this.getCurrentPlayer());
    }

    /**
     * Sends top card of deck to player's hand
     * @param {Player} player 
     * @returns A copy of the dealt card
     */
    deal(player){
        return this.deck.sendTop(player.hand, false);
    }

    /**
     * Sends top card of deck to top of discard pile
     */
    discardTopOfDeck(){
        this.deck.sendTop(this.discards, true)
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
                cards: this.discards.getState(true),
                top: this.discards.getTopCard()
            },
            deck: this.deck.getState(),
            currentPlayer: this.currentPlayer.name
        }
    }

    getCurrentPlayer() {
        return this.currentPlayer;
    }

    /**
     * @returns True if the player has passed, otherwise false if the current player has already passed on their turn.
     */
    passCurrentTurn() {
        if (this.currentPlayerHasPassed) {
            return false;
        }
        this.currentPlayerHasPassed = true;
        const dealtCard = this.dealCurrentPlayer();
        if (!this.isPlayable(dealtCard))
            this.nextTurn();
        this.update();
        return true;
    }

    /**
     * Determines if a card is playable in current gamestate
     * @param {Card} card 
     */
    isPlayable(card) {
        return this.discards.getTopCard() === undefined || card.isLike(this.discards.getTopCard());
    }

    /**
     * Attempts to play card from current player's hand.
     * @param {number} card_index 
     * @returns {Boolean} true if card is played
     * @returns {Boolean} false if it cannot be played
     */
    play(card_index) {
        let card = this.currentPlayer.hand.getCard(card_index)
        if(card && this.isPlayable(card)) {
            this.currentPlayer.hand.sendCard(card_index, this.discards, true);
            return true;
        }
        return false;
    }

    /**
     * Checks if current player has won the game
     */
    currentPlayerHasWon() {
        return this.getCurrentPlayer().hand.count() === 0;
    }

    /**
     * Broadcasts winner to all players
     */
    finish() {
        this.done = true;
        this.update();
        this.broadcast("gameOver", { winner: this.getCurrentPlayer().name });
    }

    /**
     * Sends data to each player from its own "perspective"
     */
    update(){
        let game = this.getState()
        this.players.forEach(player => {
            let data = player.getState(true)
            data.game = game
            this.emitTo(player, 'update', data)
        });
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
