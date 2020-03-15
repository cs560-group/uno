class IoSpy { 

    constructor(socketSpy) {
       this.invokes = [];
       this.socketSpy = socketSpy;
    }

    to(playerId) {
        return this.socketSpy;
    }

    emit(event, data) {
        this.invokes.push({ event: event, data: data });
    }

    wasInvokedWith(event, data) {
        return this.invokes.some(invocation => invocation.event === event && invocation.data === data);
    }
}

module.exports = IoSpy;