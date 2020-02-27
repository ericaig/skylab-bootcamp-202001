const { retrieveUser } = require('../logic')

module.exports = (req, res) => {

    const [,token] = req.get('Authorization').split(' ')
    
    try{
        retrieveUser(token)
            .then(user =>
                res.status(200).json(user)
            )
            .catch(({message}) => {
                res
                    .status(400)
                    .json({
                        error: message
                    })
                })
            
    }catch ({message}) {
        res
            .status(400)
            .json({
                error: message
            })
        }
}
