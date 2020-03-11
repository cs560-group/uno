const Card = require('./card')

class Collection{
    constructor(cards=[]){
        this.cards = cards
    }
    
    /**
     * Number of cards in Collection
     */
    cardCount(){
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
        return this.cards.splice(index, 1)
    }

    /**
     * Sends card tp another collection
     * @param {Number} index : index of card to be sent
     * @param {Collection} collection : destination Collection
     * @param {Boolean} toTop : true if card should be added on top of Collection
     */
    sendCard(index, collection, toTop=false){
        let card = this.removeCard(index)
        collection.addCard(card, toTop)        
    }

    /**
     * Returns top card of collection
     */
    getTopCard(){
        return this.cards[0]
    }

    /**
     * Returns state of the collection
     * @param {Boolean} all : true if all the cards are required
     */
    getState(all=false){
        if(all){
            return{
                cards: this.cards,
                count: this.cardCount
            }
        }else{
            return{
                count: this.cardCount
            }
        }
    }
}

class Deck extends Collection{
    constructor(){
        super()
        this.initDeck()
    }

    /**
     * Initializes Deck of cards.
     * Only creates coloured number cards for now
     * Will extend for future splits
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
                for(let j = 0; j < 2; j++){
                    this.addCard(new Card(i, suit))
                }
            }

            /**
             * Initialize Skip, Draw 2 and Reverse Cards for each suit
             * 2 each
             * *To be added*
             */
        }

        /**
         * Initialize Wild cards and Wild Draw 4 cards
         * 4 each
         * *To be added*
         */

        this.shuffle()
    }

    /**
     * Shuffles Collection
     */
    shuffle(){
        for(let i = this.cards.length-1; i > 0; i--){
            const j = Math.floor(Math.random() * i)
            const temp = this.cards[i]
            this.cards[i] = this.cards[j]
            this.cards[j] = temp
          } 
    }
}

module.exports = {
    Collection: Collection,
    Deck: Deck
}