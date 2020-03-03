const createEvent = require('../logic/create-event')
// const { models: { User, Event } } = require('../data')

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/events', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {

        
        return createEvent('5e58dd58f50e09b65a2ce293`', 'test title -demo', 'demo description', 'demo location', new Date)
        .then(()=>{
            console.log('created event and updated user...')
        })

        // const cat = {
        //     name: { type: String, required: true }
        // }

        // const Cat = mongoose.model('Cat', cat)

        // const kitty = new Cat({ name: 'Garfield' })

        // return kitty.save()
        //     .then(() => console.log('meow'))

    })
    .then(() => mongoose.disconnect())