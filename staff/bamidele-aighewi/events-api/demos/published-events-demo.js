require('dotenv').config()

const { env: { TEST_MONGODB_URL, MONGODB_URL } } = process
// const { env: { MONGODB_URL }} = process
const { publishedEvents } = require('../logic')
const { database } = require('../data')


database.connect(MONGODB_URL).then(() => {
    return publishedEvents('5e5985027b2a5434d7e5d9a0').then(events => {
        debugger
        console.log(events)
    })
}).catch(error=>{
    console.log(error)
})