class Card{
    constructor(value, suit, isWild=false){
        
        /**
         * Values may be numbers or actions
         * Numbers: 0-9
         * Actions: 'Draw 2', 'Reverse', 'Skip', 'Draw 4'
         */
        this.value = value        

        /**
         * Suits: red, green, yellow, blue
         */
        this.suit = suit
        this.type = "";
        this.isWild = isWild;
    }

    /**
     * Changes the suit of a card if it is Wild.
     * @param {String} suit 
     */
    changeSuit(suit){
        let suits = ["red","green", "yellow", "blue"]
        if(this.isWild && suits.includes(suit)){
            this.suit = suit
            this.isWild = false
            return true
        }        
        return false
    }

    /**
     * Returns state of Card.
     */
    getState(){
        return {
            value: this.value,
            suit: this.suit,
            artwork: this.artwork,
            onPlay: this.type,
            isWild: this.isWild
        }
    }

    isLike(other) {
        return this.isWild || this.value === other.value || this.suit === other.suit || other.isWild;
    }

    equals(other) {
        return this.value === other.value &&
            this.suit === other.suit &&
            this.artwork === other.artwork &&
            this.type === other.type &&
            this.isWild === other.isWild;
    }
}

module.exports = Card