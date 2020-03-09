class Card{
    constructor(value, color, type=0){        
        this.value = value
        this.color = color
        this.type = type
        this.artwork = `/assets/card/${color}-${value}.png`
    }

    /**
     * Returns state of Card.
     */
    getState(){
        return {
            value: this.value,
            color: this.color,
            artwork: this.artwork
        }
    }
}

module.exports = Card