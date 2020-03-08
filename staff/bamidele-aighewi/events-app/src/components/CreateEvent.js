import React from 'react'

export default function CreateEvent({ onSubmit }) {
    const handleCreateEvent = (event) => {
        event.preventDefault()

        const {
            target: {
                title: { value: title },
                description: { value: description },
                location: { value: location },
                date: { value: date },
            }
        } = event

        onSubmit(title, description, location, date)
    }

    return <form onSubmit={handleCreateEvent}>
        <input type="text" name="title" placeholder="Title" defaultValue="Titlte" />
        <input type="text" name="description" placeholder="Description" defaultValue="Rosalía's concert, come if you are interested" />
        <input type="text" name="location" placeholder="Location" defaultValue="Lcoation" />
        <input type="date" name="date" placeholder="Event date" />
        <button>Create event</button>
    </form>
}