const { Collection , Deck } = require('./collection')
const Card = require('./card')
const Bot = require('./player').Bot

class Game{
    constructor(id, io, players=[], duration=15){
        this.id = id;
        this.io = io
        this.deck = new Deck();
        this.discards = new Collection();
        this.players = players;
        this.turn = 0;
        this.currentPlayer = null;
        this.prevPlayer = null;
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
        this.shouldCallUno = [];
        this.challengeActive = false;
        this.done = false;
    }

    addPlayer(player){
        this.players.push(player);
        this.createRing();
    }

    getPlayer(id){
        for(let player of this.players){
            if(player.id === id){
                return player
            }
        }
        return false;
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
        this.turn = 1;
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
        for (let i = 0; i < totalCardsToDeal; i++){
            this.dealCurrentPlayer();
            this.nextTurn(false);
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
            this.broadcast('countdown', this.turnSecondsRemaining)
            if(this.turnSecondsRemaining <= 0) {
                if(this.challengeActive){
                    this.challenge(false)
                    this.emitTo(this.currentPlayer, "clearChallenge", null)
                }else{
                    //Current player draws if the timer goes to 0
                    this.dealCurrentPlayer();
                }
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
    nextTurn(incrementTurn=true) {
        this.currentPlayerHasPassed = false;    
        this.currentPlayer.myTurn = false    
        this.prevPlayer = this.currentPlayer
        this.currentPlayer = this.nextPlayer()
        this.currentPlayer.myTurn = true
        this.skip = false
        if(incrementTurn){
            this.turn++
            if(this.currentPlayer.hand.count() === 2){
                this.shouldCallUno.push(this.currentPlayer);
            }
        }        
        this.resetCountdownTimer();
        this.update();
    }

    /**
     * Determines next player
     * @returns {Player} Next Player
     */
    nextPlayer(){
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
        if(this.deck.count() === 0){
            this.resetDeck();
        }
        return this.deal(this.getCurrentPlayer());
    }

    /**
     * Sends top card of deck to player's hand
     * @param {Player} player 
     * @returns A copy of the dealt card
     */
    deal(player){
        if(this.deck.count === 0){
            this.resetDeck();
        }        
        let card = this.deck.sendTop(player.hand, false)
        this.update();
        return card;
    }

    /**
     * Sends a nummber of cards from the top of thedeck to the a player's hand
     * @param {Player} player 
     * @param {Number} number
     */
    draw(player, number){
        for(let i = 0; i < number; i++){
            this.deal(player);
        }
    }

    /**
     * Sends top card of deck to top of discard pile
     */
    discardTopOfDeck(){
        let card = this.deck.sendTop(this.discards, true)
        while((card.value === "+4" || card.value === "wild") && this.turn === 1){
            card = this.discards.getTopCard();
            this.discards.sendCard(0, this.deck);
            this.deck.shuffle();
            this.deck.sendTop(this.discards, true);
            card = this.discards.getTopCard();
        }
    }

    /**
     * Determine whether or not a player has won. 
     * @param {Player} player 
     */
    win(player){
        return player.hand.cardCount === 0
    }

    /**
     * Switches Deck and discard pile if the deck has no cards left.
     */
    resetDeck(){
        if(this.deck.count() == 0){
            let cards = this.discards.cards
            this.deck = new Deck(cards)
            this.discards = new Collection()
            this.discardTopOfDeck()
            this.deck.shuffle()
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

        if(this.shouldCallUno.length > 0 && this.shouldCallUno[0] !== this.currentPlayer){
            this.shouldCallUno.shift()        
        }

        const dealtCard = this.dealCurrentPlayer();
        if (!this.isPlayable(dealtCard)){
            this.nextTurn();
        }            
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
     * Checks a players hand to see if they have playable cards in their hand other than Wild Draw 4 cards.
     * @param {Player} player 
     * @returns {boolean} true if draw 4 cards are the only playable cards false if other playable cards are available.
     */
    checkHand(player, card) {
        for(let c of player.hand.cards){
            if(c.isLike(card) && c.value !== "+4"){
                return false
            }
        }
        return true
    }

    /**
     * Attempts to play card from current player's hand.
     * @param {number} card_index
     * @param {string} suit
     * @returns {Boolean} true if card is played, false if it cannot be played
     */
    play(card_index, suit) {
        let card = this.currentPlayer.hand.getCard(card_index)
        
        //If a player has passed, they can only play the drawn card which would be the last card in their hand.
        if(this.currentPlayerHasPassed  && card_index !== this.currentPlayer.hand.count() - 1){
            return false
        }
        
        if(card && this.isPlayable(card)){

            if(card.isWild && !suit){
                this.emitTo(this.currentPlayer, "suit", {index: card_index})
                return false;
            }else if(card.isWild && suit){
                card.changeSuit(suit)
            }

            this.currentPlayer.hand.sendCard(card_index, this.discards, true);
            this.readCard(card)

            if(this.shouldCallUno.length > 0 && this.shouldCallUno[0] !== this.currentPlayer){
                this.shouldCallUno.shift()        
            }

            return true;
            
        }
        return false;
    }

    /**
     * Reads card and changes game state based on it's value, if necessary
     * @param {Card} card 
     */
    readCard(card){
        let actions = ["skip", "reverse", "+2", "+4"]
        if(actions.includes(card.value)){
            if(card.value === "skip"){
                this.skip = true;
            }else if(card.value === "reverse"){
                if(this.direction === 1){   
                    this.direction = 0;
                }else{
                    this.direction = 1;
                } 
            }else if(card.value === "+2"){
                this.draw(this.nextPlayer(), 2);
                if(this.turn > 1){
                    this.skip = true;
                }
            }else if(card.value === "+4"){
               this.emitTo(this.nextPlayer(), 'challenge', {name: this.currentPlayer.name});
               this.challengeActive = true;
            }
        }
    }

    /**
     * Challenges the play of a Wild Draw 4 card.
     * If the player played the +4 card illgally, they draw 4, otherwise challenging player draws 6
     * @param {boolean} doesChallenge 
     */
    challenge(doesChallenge){
        if(doesChallenge){
            if(this.checkHand(this.prevPlayer,this.discards.getCard(1))){
                this.draw(this.currentPlayer, 6);
            }else{
                this.draw(this.prevPlayer, 4);
            }
        }else{
            this.draw(this.currentPlayer, 4);
        }
        this.challengeActive = false;
    }

    callUno(player, game=this){
        if(player === game.currentPlayer && game.shouldCallUno.includes(player)){
            if(game.shouldCallUno[0] === player){
                game.shouldCallUno.shift()
            }else{
                game.shouldCallUno.pop()
            }
        }
        
        if(game.shouldCallUno.length > 0){
            for(let i = 0; i < game.shouldCallUno.length; i++){
                let p = game.shouldCallUno[i]
                if(player !== p && p.hand.count() === 1){
                    game.draw(p, 4);
                    if(i === 0){
                        game.shouldCallUno.shift()
                    }else{
                        game.shouldCallUno.pop()
                    }
                }
            }
        }
    }    

    currentPlayerHasWon() {
        return this.getCurrentPlayer().hand.count() === 0;
    }

    /**
     * Broadcasts winner to all players
     */
    finish() {
        this.update();
        this.broadcast("gameOver", { winner: this.getCurrentPlayer().name });
        this.done = true;
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
        if(!this.done){
            this.players.forEach(player => this.io.to(player.id).emit(event, data));
        }
    }

    /**
     * Send data to one player
     * @param {Player} player 
     * @param {String} event 
     * @param {*} data 
     */
    emitTo(player, event, data) {
        if(!this.done){
            this.io.to(player.id).emit(event, data);
        }        
    }
    
}

class SingleMode extends Game{
    constructor(id, io, player, numPlayers, difficulty){
        super(id, io)

        this.addPlayer(player);
        this.player = player;
        this.bots = []
        for(let i = 1; i < numPlayers; i++){
            let name = `Bot-${i}`
            let bot = new Bot(name, this, difficulty)
            this.addPlayer(bot)
            this.bots.push(bot)
        }       
    }

    start(){
        super.start()

        if(this.currentPlayer.isBot && this.turn > 0){
            let delay = this.getDelay(2000)
            setTimeout(this.botTurn, delay, this.currentPlayer, this)
        }
    }

    nextTurn(incrementTurn=true){
        super.nextTurn(incrementTurn)

        let delay = this.getDelay()
        setTimeout(this.botUno, delay / 2, this)        
        if(this.currentPlayer.isBot && this.turn > 0){
            setTimeout(this.botTurn, delay, this.currentPlayer, this)
        }
    }

    botTurn(bot, game=this){
        if(bot.isBot){
            if(game.challengeActive){
                let doesChallenge = bot.challenge()
                game.challenge(doesChallenge)
                game.nextTurn();
            }else{
                let turn = bot.playCard()
                if(game.currentPlayerHasWon()){
                    game.finish()
                }else if(turn){
                    game.nextTurn()
                }else{
                    game.passCurrentTurn()
                    if(game.currentPlayer === bot){
                        game.botTurn(bot, game)
                    }
                }
            }
        }
    }

    botUno(game=this){
        let options = [true, true, true, true, false];
        let priority = options[Math.floor(Math.random() * options.length)]

        if(priority && game.currentPlayer.isBot && game.shouldCallUno.includes(game.currentPlayer)){
            game.callUno(game.currentPlayer)
        }

        for(let bot of game.bots){
            if(game.shouldCallUno.length > 0 && ((game.prevPlayer && game.prevPlayer.hand.count() == 1) || game.shouldCallUno.includes(bot))){
                if(bot.callUno()){
                    let delay = game.getDelay(0, 2000);
                    setTimeout(game.callUno, delay, bot, game)
                }
            }   
        }        
    }

    update(){
        let game = this.getState()
        let data = this.player.getState(true)
        data.game = game
        this.emitTo(this.player, 'update', data)
    }

    broadcast(event, data={}){
        if(!this.done){
            this.emitTo(this.player, event, data)
        }
    }

    getDelay(min=1000, max=7000){
        return min + Math.floor(Math.random() * (max - min))
    }
}

module.exports = {
    Game: Game,
    SingleMode: SingleMode
}