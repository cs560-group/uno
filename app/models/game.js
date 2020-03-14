const { Collection , Deck } = require('./collection')

class Game{
    constructor(id, io, deck, discard){
        this.id = id;
        this.io = io
        this.deck = deck;
        this.discards = discard;
        this.players = []
        this.turn = 0
        this.currentIndex = 0;
        this.direction = 1
        this.skip = false
        this.turnDuration = 30;
        this.turnSecondsRemaining = this.turnDuration;
    }

    addPlayer(player){
        this.players.push(player)
    }

    addAllPlayers(players) {
        players.forEach(player => this.addPlayer(player));
    }

    /**
     * Arranges Players into ring, determines the starting player, deals starting hands and starts the play timer
     * Broadcasts start event to players
     */
    start(){
        this.dealInitialHands();
        this.discardTopOfDeck();
        this.broadcast("start", this.id);
        this.setCurrentIndexRandomly();
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
        for (let i = 0; i < totalCardsToDeal; i++) {
            this.dealCurrentPlayer();
            this.endCurrentTurn();
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
        this.updateCurrentIndex();
        this.getCurrentPlayer().myTurn = true;
    }

    /**
     * Determines and sets the next player and resets play timer
     */
    updateCurrentIndex(){
        this.currentIndex = this.getNextIndex();
    }

    setCurrentIndexRandomly() {
        this.currentIndex = Math.round(Math.random() & this.players.length);
    }

    getNextIndex() {
        return ++this.currentIndex % this.players.length;
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
            players: this.players.map(player => player.getPublicState())
        }
    }

    getCurrentPlayer() {
        const currentPlayer = this.players[this.currentIndex];
        currentPlayer.myTurn = true;
        return currentPlayer;
    }

    passCurrentTurn() {
        const dealtCard = this.dealCurrentPlayer();
        if (!this.isPlayable(dealtCard))
            this.endCurrentTurn();
        this.updatePlayersState();
    }

    isPlayable(card) {
        const lastPlayedCard = this.discards.peekTop();
        return lastPlayedCard === undefined || card.isLike(lastPlayedCard);
    }

    endCurrentTurn() {
        this.getCurrentPlayer().myTurn = false;
        this.updateCurrentPlayer();
    }
}

module.exports = Game;
