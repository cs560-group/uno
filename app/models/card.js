class Card{
    constructor(value, suit){
        
        /**
         * Values may be numbers or actions
         * Numbers: 0-9
         * Actions: 'Draw 2', 'Reverse', 'Skip', 'Draw 4', 'Wild'
         */
        this.value = value        

        /**
         * Suits: red, green, yellow, blue, wild
         * Treating wild as a suit makes it unnecessary to create other tests for wild
         */
        this.suit = suit
        this.artwork = `/assets/card/${suit}-${value}.png`,
        this.type = "";
        this.isWild = false;
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
        return this.value === other.value || this.suit === other.suit || other.isWild;
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