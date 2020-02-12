function Feedback({message, type = "success"}) {
    
    return <div className={`feedback feedback__${type}`} >{message}</div>
}