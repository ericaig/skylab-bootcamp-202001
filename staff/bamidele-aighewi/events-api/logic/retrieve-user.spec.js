

describe('retrieveUser', ()=> {
    let name, password

    before(() => 
    database.connect(MONGODB_URL)
    .then(() => users = database.collection('users')
    )
})