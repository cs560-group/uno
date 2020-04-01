const Card = require('./card')

class Collection{
    constructor(cards=[]){
        this.cards = cards
    }
    
    /**
     * Number of cards in Collection
     */
    count(){
        return this.cards.length
    }

    /**
     * Adds card to collection
     * @param {Card} card : card to be added
     * @param {Boolean} toTop : true if card should be added to top of Collection
     */
    addCard(card, toTop=false){
        if(toTop){
            this.cards.splice(0, 0, card)
        }else{
            this.cards.push(card)
        }        
    }

    /**
     * Remove card from collection. Returns removed card
     * @param {Number} index : index of card to be removed
     */
    removeCard(index){
        if(index < this.cards.length && index >= 0){
            return this.cards.splice(index, 1)[0];
        }else{
            return false
        }      
    }

    /**
     * Sends card to another collection
     * @param {Number} index : index of card to be sent
     * @param {Collection} destination : destination Collection
     * @param {Boolean} toTop : true if card should be added on top of Collection
     * @returns {Card} : A copy of the card sent.
    */
    sendCard(index, collection, toTop=false){
        const card = this.removeCard(index)
        if(card){
            collection.addCard(card, toTop);
            return Object.assign(new Card(), card);   
        }else{
            return false
        }        
    }

    indexOf(card) {
        return this.cards.findIndex(c => card.equals(c));
    }

    /**
     * Returns top card of collection
     */
    getTopCard(){
        if(this.count() > 0){
            return this.cards[0]
        }else{
            return false
        }        
    }

    /**
     * Returns state of the collection
     * @param {Boolean} all : true if all the cards are required
     */
    getState(all=false){
        if(all){
            let cards = this.cards.map(card => {return card.getState()})
            return{
                cards: cards,
                count: this.count()
            }
        }else{
            return{
                count: this.count()
            }
        }
    }
}

class Deck extends Collection{
    constructor(cards = []){
        super(cards);
    }

    /**
     * Initializes Deck of cards.
     */
    initDeck(){
        this.cards = []
        const suits = ["red", "green", "yellow", "blue"]
        for(let suit of suits){
            /**
             * Initializes number cards for each suit
             * 1 0-card
             * 2 1-9-cards
             */
            this.addCard(new Card(0, suit))

            for(let i = 1; i < 10; i++){
                this.addCard(new Card(i, suit));
                this.addCard(new Card(i, suit));
            }

            /**
             * Initialize Skip, Draw 2 and Reverse Cards for each suit
             * 2 each
             */

            for(let i = 0; i < 2; i++){
                this.addCard(new Card("skip", suit));
                this.addCard(new Card("+2", suit));
                this.addCard(new Card("reverse", suit));
            }
        }

        /**
         * Initialize Wild cards and Wild Draw 4 cards
         * 4 each
         */

        for(let i = 0; i < 4; i++){
            this.addCard(new Card("wild", "wild", true))
            this.addCard(new Card("+4", "wild", true))
        }

        this.shuffle()
    }

    /**
     * Shuffles Collection
     */
    shuffle(){
        for(let i = this.cards.length-1; i > 0; i--) {
            const j = Math.floor(Math.random() * i)
            const temp = this.cards[i]
            this.cards[i] = this.cards[j]
            this.cards[j] = temp
        } 
    }

    /**
     * @returns A copy of the top card.
     */
    peekTop() {
        return Object.assign(new Card("", ""), this.getTopCard());
    }

    /**
     * 
     * @param {Collection} destination 
     * @param {Boolean} toTop 
     * @returns {Card} A copy of the card sent.
     */
    sendTop(destination, toTop = false) {
        return this.sendCard(0, destination, toTop);
    }
}

module.exports = {
    Collection: Collection,
    Deck: Deck
}