const { Router } = require('express')
const {
    registerUser,
    authenticateUser,
    retrieveUser,
    createCompany,
    companyRetrieve,
    companyUpdate,
    companyDelete,
} = require('./handlers')

const { jwtVerifierMidWare } = require('../mid-wares')
const bodyParser = require('body-parser')

const jsonBodyParser = bodyParser.json()
const router = new Router()

/* USER ROUTES */
router.post('/users', jsonBodyParser, registerUser)
router.post('/users/auth', jsonBodyParser, authenticateUser)
router.get('/users', jwtVerifierMidWare, retrieveUser)

/* COMPANY ROUTES */
router.get('/company', jwtVerifierMidWare, companyRetrieve)
router.post('/company', [jwtVerifierMidWare, jsonBodyParser], createCompany)
router.patch('/company', [jwtVerifierMidWare, jsonBodyParser], companyUpdate)
router.delete('/company', jwtVerifierMidWare, companyDelete)

module.exports = router