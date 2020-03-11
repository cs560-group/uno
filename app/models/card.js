class Card{
    constructor(value, suit){        
        this.value = value
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
            type: this.type,
            isWild: this.isWild
        }
    }
}

module.exports = Card