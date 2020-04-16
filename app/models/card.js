class Card{
    constructor(value, suit, isWild){
        
        /**
         * Values may be numbers or actions
         * Numbers: 0-9
         * Actions: '+2', 'reverse', 'skip', '+4', 'wild'
         */
        this.value = value        

        /**
         * Suits: red, green, yellow, blue, wild
         * Treating wild as a suit makes it unnecessary to create other tests for wild
         */
        this.suit = suit
        this.type = "";
        this.isWild = isWild;
        this.points = typeof(this.value) === typeof(0) ? this.value : this.isWild ? 50 : 20;
    }

    changeSuit(suit){
        let suits = ['red', 'green', 'yellow', 'blue']
        if(this.isWild && suits.includes(suit)){
            this.suit = suit
            this.isWild = false
        }
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