const { Collection , Deck } = require('./collection')

class Game{
    constructor(id, io, deck, discard){
        this.id = id;
        this.io = io
        this.deck = deck;
        this.discards = discard;
        this.players = [];
        this.turn = 0;
        this.currentPlayer = null;
        this.direction = 1;
        this.skip = false;
        this.turnDuration = 15;
        this.turnSecondsRemaining = this.turnDuration;
        this.currentPlayerHasPassed = false;
        this.done = false;
    }

    addPlayer(player){
        this.players.push(player);
        this.createRing();
    }

    addAllPlayers(players) {
        players.forEach(player => this.addPlayer(player));
    }

    /**
     * Arranges Players into ring, determines the starting player, deals starting hands, starts the play timer and discards card from deck.
     * Broadcasts start event to players
     */
    start(){
        this.createRing();
        this.currentPlayer = this.players[0];
        this.currentPlayer.myTurn = true;
        this.dealInitialHands();
        this.discardTopOfDeck();
        this.broadcast("start", this.id);
        this.countdown();
        this.update();
    }

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


    nextTurn() {
        this.currentPlayerHasPassed = false;
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
        
        this.resetCountdownTimer();
        this.update();
    }

    /**
     * @returns A copy of the dealt card
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
     * Sends top card of deck to player's hand
     * @param {integer} player 
     */
    draw(Player){
        for(let i=0; i<this.drawCard; i++){
            this.deal(Player);
        }

        this.drawCard = 0;
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
                top: this.discards.peekTop()
            },
            deck: this.deck.getState(),
            currentPlayer: this.currentPlayer.name
        }
    }

    getCurrentPlayer() {
        return this.currentPlayer;
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

    isPlayable(card) {
        const lastPlayedCard = this.discards.peekTop();
        return lastPlayedCard === undefined || card.isLike(lastPlayedCard);
    }

    play(card) {
        const isPlayable = this.isPlayable(card);
        if (isPlayable) {
            const player = this.getCurrentPlayer();
            const index = player.hand.indexOf(card);
            if (index != -1) {
                player.hand.sendCard(index, this.discards, true);
                this.readCard(card)
                return true;
            }
        }
        return false;
    }

    /**
     * Reads card and changes game state based on it's value, if necessary
     * @param {Card} card 
     */
    readCard(card){
        if(typeof(card.value) === "string"){
            if(card.value === "skip"){
                this.skip = true;
            }else if(card.value === "reverse"){
                if(this.direction === 1){
                    this.direction = 0;
                }else{
                    this.direction = 1;
                } 
            }else if(card.value === "+2"){
                this.drawCard = 2;
                if(this.direction === 1){
                    this.draw(this.currentPlayer.left);
                }else{
                    this.draw(this.currentPlayer.right);
                }
            }else if(card.value === "+4"){
                this.drawCard = 4;
                if(this.direction === 1){ 
                    this.draw(this.currentPlayer.left);
                }else{
                    this.draw(this.currentPlayer.right);
                }
            }
        }
    }

    currentPlayerHasWon() {
        return this.getCurrentPlayer().hand.count() === 0;
    }

    finish() {
        this.done = true;
        this.update();
        this.broadcast("gameOver", { winner: this.getCurrentPlayer().name });
    }
}

module.exports = Game;
