function toggleTeamFav(teamId, token, callback){
    if (typeof teamId !== 'string') throw new TypeError(`${teamId} is not a string`)
    if (!teamId.trim()) throw new Error('teamId is empty')
    if (typeof token !== 'string') throw new TypeError(`${token} is not a string`)
    if (!token.trim()) throw new Error('token is empty')
    if (typeof callback !== 'function') throw new TypeError(`${callback} is not a function`)

    const tokenParts = token.split('.')
    if (tokenParts.length !== 3) throw new Error('token is invalid')

    /*try {
        const { sub } = JSON.parse(atob(tokenParts[1]))
        if(!sub) throw new Error('Invalid token. "Sub" does not exist in token')
    } catch (error) {
        throw new Error('token is not a valid base64 string')
    }*/

    if (typeof callback !== 'function') throw new TypeError(`${callback} is not a function`)

    const [, payload,] = tokenParts
    const payloadObject = JSON.parse(atob(payload))


    call(`https://skylabcoders.herokuapp.com/api/v2/users/${payloadObject.sub}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }, (error, response) => {
        if (error) return callback(error)
        const content = JSON.parse(response.content)
        if (response.status !== 200) {
            callback(new Error(content.error))
        } else {
            const { footballFavs: favs } = content
            let favourites = []

            if (favs) {
                const existIndex = favs.findIndex(item => item === teamId)
                if (existIndex !== -1) {
                    favs.splice(existIndex, 1)
                    favourites = favs
                } else {
                    favourites = favs
                    favourites.push(teamId)
                }
            } else {
                favourites.push(teamId)
            }

            call(`https://skylabcoders.herokuapp.com/api/v2/users`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ "footballFavs": favourites })
            }, (error, response) => {
                if (error) return callback(error)

                if (response.content) {
                    const content = JSON.parse(response.content)
                    if (response.status !== 204) callback(new Error(content.error))
                    else callback()
                } else {
                    callback()
                }
            })
        }
    })
}