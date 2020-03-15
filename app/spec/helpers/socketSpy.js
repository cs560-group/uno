class SocketSpy {
    constructor() {
        this.invokes = [];
     }
 
     emit(event, data) {
        this.invokes.push({ event: event, data: data });
     }

     lastInvocation() {
        return this.invokes.length > 0 ? this.invokes[this.invokes.length - 1] : {};
     }
 
     wasInvokedWith(event, data) {
        return this.invokes.some(invocation => invocation.event === event && invocation.data === data);
     }
}

module.exports = SocketSpy;