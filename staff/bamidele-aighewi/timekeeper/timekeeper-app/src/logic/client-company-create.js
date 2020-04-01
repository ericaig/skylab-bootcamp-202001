// import { userCreateValidate, companyCreateValidate, serverResponse } from '../utils'
const { userCreateValidate, companyCreateValidate, serverResponse } = require('../utils')
const fetch = require("node-fetch")
const API_URL = process.env.REACT_APP_API_URL

module.exports = function(client, company) {
    userCreateValidate(...Object.values(client))
    companyCreateValidate(...Object.values(company))

    return (async () => {
        const response = await fetch(`${API_URL}/client`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ client, company })
        })

        return await serverResponse(response)
    })()
}