const { mongoose } = require('events-data')
const { models: { Event, User } } = require('events-data')
const { NotFoundError } = require('events-errors')

mongoose.connect('mongodb://localhost:27017/events', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {

        const userId = '5e5985027b2a5434d7e5d9a0'

        return User.findOne({ _id: userId }).then(user => {
            if (!user) throw new Error(`User with id ${userId} does not exist`)
            return user
        }).then(user => {
            const _user = user.toJSON()
            // user exists. Let's recover their subscribed events

            if ('subscribedEvents' in _user) {
                const { subscribedEvents } = _user

                console.log(subscribedEvents)

                const cursor = Event.find({ _id: { $in: subscribedEvents } }).lean().cursor()

                const _events = []

                return (function streamItems() {
                    return cursor.next()
                        .then(result => {
                            debugger
                            if (result) _events.push(result)
                            return result
                        })
                        .then(result => (result && streamItems()) || console.log(_events))
                })()

                // function* streamify () {
                //     const cursor1 = Event.find({ _id: { $in: subscribedEvents } }).cursor()

                //     debugger

                //     yield cursor1.next()

                //     // for (let doc = yield cursor1.next(); doc != null; doc = yield cursor1.next()) {
                //     //     // _events.push(doc)
                //     //     console.log(doc);
                //     // }

                //     // return 'end'

                //     debugger
                // }

                // streamify().next().value.then(val=>{
                //     console.log(val)
                // })
            }


            // throw new NotFoundError(`User ${userId} has no subscribed events`)

        })

        // const cat = {
        //     name: { type: String, required: true }
        // }

        // const Cat = mongoose.model('Cat', cat)

        // const kitty = new Cat({ name: 'Garfield' })

        // return kitty.save()
        //     .then(() => console.log('meow'))

    })
    .then(() => {
        // mongoose.disconnect()
    })