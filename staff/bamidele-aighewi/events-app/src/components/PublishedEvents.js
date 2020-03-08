import React from "react"

export default function PublishedEvents({ events, deleteEvent }) {
    return <ul>
        {events ?
            events.map(({id, title, description}, index) => <li key={index}>
                <h2>{title}&nbsp;<span onClick={()=>{deleteEvent(id)}} style={{color: 'red'}}>X</span></h2>
                <h6>{description}</h6>
            </li>
            )
            :
            'You have no published events'
        }
    </ul>
}