const { Router } = require('express')
const {
    registerUser,
    authenticateUser,
    retrieveUser,
    createCompany,
    companyRetrieve,
    companyUpdate,
    companyDelete,
    workerRegister,
    weekDaysCreate,
    weekDaysRetrieve,
    weekDaysUpdate,
    eventCreate,
    eventCompanyCreate,
    eventSignInOut,
    clientCompanyCreate
} = require('./handlers')

const { jwtVerifierMidWare } = require('../mid-wares')
const bodyParser = require('body-parser')

const jsonBodyParser = bodyParser.json()
const router = new Router()

/* USER ROUTES */
router.post('/users', jsonBodyParser, registerUser)
router.post('/users/auth', jsonBodyParser, authenticateUser)
router.get('/users', jwtVerifierMidWare, retrieveUser)
router.post('/users/:inviteToken/invite', jsonBodyParser, workerRegister)

/* COMPANY ROUTES */
router.get('/company', jwtVerifierMidWare, companyRetrieve)
router.post('/company', [jwtVerifierMidWare, jsonBodyParser], createCompany)
router.patch('/company', [jwtVerifierMidWare, jsonBodyParser], companyUpdate)
router.delete('/company', jwtVerifierMidWare, companyDelete)

/* CLIENT COMPANY ROUTES */
router.post('/client', jsonBodyParser, clientCompanyCreate)

/* WEEK DAYS ROUTES */
router.get('/week-days', jwtVerifierMidWare, weekDaysRetrieve)
router.post('/week-days', [jwtVerifierMidWare, jsonBodyParser], weekDaysCreate)
router.patch('/week-days', [jwtVerifierMidWare, jsonBodyParser], weekDaysUpdate)

/* EVENT ROUTES */
router.post('/events', [jwtVerifierMidWare, jsonBodyParser], eventCreate)
router.post('/events-company', [jwtVerifierMidWare, jsonBodyParser], eventCompanyCreate)
router.post('/events-sign-in-out', jwtVerifierMidWare, eventSignInOut)

module.exports = router