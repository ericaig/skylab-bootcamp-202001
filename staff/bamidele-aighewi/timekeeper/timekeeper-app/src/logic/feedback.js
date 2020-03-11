const feedbackTimeout

module.exports = {
    unsetFeedback() {
        if (feedbackTimeout !== "undefined")
            clearTimeout(feedbackTimeout)
    },

    handleFeedback(message, callback) {
        this.unsetFeedback()
        setTimeout(() => {
            if (typeof callback === 'function') callback()
        }, 5000)
    }
}