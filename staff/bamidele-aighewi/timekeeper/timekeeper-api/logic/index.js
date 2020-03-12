module.exports = {
    registerUser: require('./user-register'),
    authenticateUser: require('./user-authenticate'),
    retrieveUser: require('./user-retrieve'),
    createCompany: require('./company-create'),
    companyRetrieve: require('./company-retrieve'),
    companyUpdate: require('./company-update'),
    companyDelete: require('./company-delete'),
    workerRegister: require('./worker-register'),
    weekDaysCreate: require('./week-days-create'),
    weekDaysRetrieve: require('./week-days-retrieve'),
    weekDaysUpdate: require('./week-days-update'),
}