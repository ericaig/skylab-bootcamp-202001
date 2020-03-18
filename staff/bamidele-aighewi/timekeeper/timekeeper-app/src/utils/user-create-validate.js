import { validate } from 'timekeeper-utils'

export default function(name, surname, email, password){
    validate.string(name, 'Name')
    validate.string(surname, 'Surname')
    validate.string(email, 'E-mail')
    validate.email(email)
    validate.string(password, 'Password')
}