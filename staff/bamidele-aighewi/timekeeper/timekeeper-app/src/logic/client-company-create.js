import { userCreateValidate, companyCreateValidate, serverResponse } from '../utils'
const API_URL = process.env.REACT_APP_API_URL

export default function(client, company) {
    // const { name, surname, email, password } = _client
    // const { name: companyName, email: companyEmail, address, web, cif, city, postalCode } = _company

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