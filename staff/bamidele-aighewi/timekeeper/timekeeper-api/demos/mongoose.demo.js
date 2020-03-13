require('dotenv').config()

const { env: { PORT = 8080, NODE_ENV: env, MONGODB_URL, TEST_MONGODB_URL }, argv: [, , port = PORT] } = process

const { mongoose } = require('timekeeper-data')
const { models: { Event } } = require('timekeeper-data')

// To supress deprecation warnings by mongoose
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {

        const start = "2020-03-21"
        const end = "2020-03-23"
        // const events = await Event.find({ start: new Date("2020-03-11"), end: "2020-03-11" })
        // const startEvents = await Event.find({
        //     "start": {
        //         "$gte": new Date("2020-03-11"), 
        //     },
        // })

        const endEvents = await Event.find({
            "start": {
                "$lte": new Date(end),
            },
            "end": {
                "$gte": new Date(start)
            }
        }).lean()

        // console.log(startEvents)
        console.log(endEvents)

        mongoose.disconnect()
    })