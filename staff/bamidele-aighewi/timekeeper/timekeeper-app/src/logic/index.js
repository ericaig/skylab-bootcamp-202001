const clientCompanyCreate = require('./client-company-create')
const registerUser = require('./register-user')
const login = require('./login')
const retrieveUser = require('./retrieve-user')
const isLoggedIn = require('./is-logged-in')
const logout = require('./logout')
const weekDaysUpdate = require('./week-days-update')
const weekDaysRetrieve = require('./week-days-retrieve')
const eventCompanyCreate = require('./event-company-create')
const eventCreate = require('./event-create')
const eventCompanyRetrieve = require('./event-company-retrieve')
const eventsRetrieve = require('./events-retrieve')
const eventSignInOut = require('./event-sign-in-out')
const dashboardAnalytics = require('./dashboard-analytics')
const sendInviteLink = require('./send-invite-link')
const retrieveCompany = require('./retrieve-company')
const eventUpdate = require('./event-update')
const eventDelete = require('./event-delete')
const workerRegister = require('./worker-register')
const companyRetrieve = require('./company-retrieve')
const companyUpdate = require('./company-update')
const retrieveUsers = require('./retrieve-users')
const updateUser = require('./update-user')
const context = require('./context')

module.exports =  {
    registerUser,
    clientCompanyCreate,
    login,
    retrieveUser,
    isLoggedIn,
    logout,
    weekDaysUpdate,
    weekDaysRetrieve,
    eventCompanyCreate,
    eventCompanyRetrieve,
    eventsRetrieve,
    eventSignInOut,
    dashboardAnalytics,
    sendInviteLink,
    retrieveCompany,
    eventUpdate,
    eventDelete,
    workerRegister,
    companyRetrieve,
    companyUpdate,
    retrieveUsers,
    updateUser,
    eventCreate,
    context
}