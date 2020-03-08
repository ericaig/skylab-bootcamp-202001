import React from 'react'

export default function Landing({ setView }) {
    return <>
        <a href="/" onClick={e => {
            e.preventDefault()
            setView('create-event')
        }}>Create event</a><br />
        {/* <a href="/" onClick={e => {
            e.preventDefault()
            retrievePublishedEvents()
        }}>View published event</a><br /> */}
    </>
}