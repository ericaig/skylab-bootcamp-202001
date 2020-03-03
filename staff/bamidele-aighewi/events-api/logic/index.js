module.exports = {
    registerUser: require('./register-user'),
    authenticateUser: require('./authenticate-user'),
    retrieveUser: require('./retrieve-user'),
    createEvent: require('./create-event'),
    deleteEvent: require('./delete-event'),
    retrieveAllEvents: require('./retrieve-all-events'),
    retrievePublishedEvents: require('./retrieve-published-events'),
    retrieveLastEvents: require('./retrieve-last-events'),
    updateEvent: require('./update-event'),
    subscribeToEvent: require('./subscribe-to-event'),
    unSubscribeFromEvent: require('./unsubscribe-from-event'),
    retrieveSubscribedEvents: require('./retrieve-subscribed-events'),
}