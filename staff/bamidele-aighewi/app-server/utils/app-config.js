const config = {
    __debugger__: false,
    set debugger(state) { this.__debugger__ = state },
    get debugger() { return this.__debugger__ }
}

if (typeof module !== 'undefined') module.exports = config