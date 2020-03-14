class Card{
    constructor(value, suit){        
        this.value = value
        this.suit = suit
        this.artwork = `/assets/card/${suit}-${value}.png`,
        this.onPlay = "";
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
            onPlay: this.onPlay,
            isWild: this.isWild
        }
    }

    isLike(other) {
        return this.value === other.value || this.suit === other.suit || other.isWild;
    }
}

module.exports = Card