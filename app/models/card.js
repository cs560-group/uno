class Card{
    constructor(value, suit){        
        this.value = value
        this.suit = suit
        this.artwork = `/assets/card/${suit}-${value}.png`
    }

    /**
     * Returns state of Card.
     */
    getState(){
        return {
            value: this.value,
            suit: this.suit,
            artwork: this.artwork
        }
    }
}

module.exports = Card