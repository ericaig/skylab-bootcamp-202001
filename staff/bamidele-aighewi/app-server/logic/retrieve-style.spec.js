const retrieveStyle = require('./retrieve-style')
const { logger, call } = require('../utils')
const path = require('path')
require('../specs/specs-helper.js')
require('../utils/array.prototype.random')


logger.level = logger.DEBUG
logger.path = path.join(__dirname, '../e2e.log')

logger.debug('$$RUNNING_TEST$$ retrieveStyle')

describe('retrieveStyle', () => {
    const vehicleIds = ['FYG51', 'FYD40', 'FYF88', 'FYB45', 'FYD88', 'FYG08', 'FYF37', 'FYD95', 'FYC23', 'FYC48', 'FYC56', 'FYF11', 'FYD81', 'FYD93', 'FYF64', 'FYC08', 'FYD86', 'FYB52', 'FYF24', 'FKB94', 'FYF53', 'FYD84', 'FYB51', 'FYD46', 'GBT50', 'GBT83', 'GBT35', 'FYF55', 'GBT39', 'GBT40', 'GBT42', 'GBT45', 'GBT47', 'FYD82', 'FYG19', 'FYB50', 'FYF06', 'FYD59', 'FYC37', 'FYC83', 'FYD98', 'FYF42', 'FYC91', 'FYB76', 'FYD15', 'FYC07', 'FYG77', 'FJX08', 'FYB60', 'FYD24', 'FYB77', 'FYB64', 'FJY98', 'FYB95', 'FYC59', 'FYC52', 'FYD66', 'FYC40', 'FYG00', 'FYD28', 'FJY63', 'FKB51', 'FJY08', 'FKB18', 'FJW70', 'FJY50', 'FJY85', 'FJY01', 'FYJ52', 'FKB34', 'FRR82', 'FKB52', 'FJY25', 'FJV73', 'FJX14', 'FKC09', 'FRR87', 'FJW23', 'FJY56', 'FJX73', 'FJY46', 'FJY55', 'FTX88', 'FKC01', 'FJY97', 'FJW93', 'FRR92', 'FJW68', 'FJX41', 'FJW20', 'FJW24', 'FJX78', 'FJW16', 'FJX80', 'FJX20', 'FKB40', 'FJW47', 'FKC00', 'FKB26', 'FJX53', 'FJX84', 'FJW57', 'FJW05', 'DTY34', 'DVB64', 'DVC40', 'DVC28', 'DTY60', 'DTY95', 'DTY10', 'DVC34', 'DTY74', 'DTX24', 'DTY41', 'DTY38', 'DVB67', 'DVB40', 'DTY07', 'DTX40', 'DVB89', 'DVC23', 'DVB09', 'DVB80', 'DVB66', 'DVB14', 'DVB16', 'DTX13', 'DTY80', 'DTY48', 'DTY70', 'DTY27', 'DTX29', 'DTX50', 'DTX82', 'DTY25', 'DTY01', 'DTY39', 'DTX34', 'DTX36', 'DTW95', 'DJM21', 'BDM54', 'DJJ50', 'DHT35', 'DHR85', 'DHR93', 'DHR67', 'DHP94', 'DHX49', 'DHY12', 'DHP21', 'DHP55', 'DHP58', 'DHW55', 'DHR09', 'DHX29', 'DHT27', 'DHW65', 'DHP74', 'DHW71', 'DHT90', 'DHT28', 'DHT29', 'DHX79', 'DHX97', 'DHX46', 'DHT30', 'DHT31', 'DHP36', 'DHX11', 'DHR52', 'DHW89', 'DHP82', 'DHP87', 'DHP88', 'DHX84', 'DHX54', 'DHT06', 'DHX10', 'DHW95', 'DHR73', 'DHT20', 'DHX98', 'DHR35', 'DHT83', 'DHW54', 'DHX23', 'DHW84', 'DHR96', 'DHR98', 'DHY06', 'DHR20', 'DHY10', 'DHR25', 'DHP44', 'DHT95']

    let vehicleId
    let styleId

    beforeEach(() => {
        vehicleId = vehicleIds.random()
        styleId = undefined
    })

    describe('when vehicle already exist', () => {
        beforeEach(done =>{
            call(`https://skylabcoders.herokuapp.com/api/hotwheels/vehicles/${vehicleId}`, undefined, (error, response) => {
                
                logger.debug(`RUNNING TEST:: retrieveStyle (vehicle ${vehicleId}) > fetching vehicle's informations: PENDING`)

                if (error) return done(error)

                if (response.content) {
                    const content = JSON.parse(response.content)
                    const { error } = content

                    if (error) return done(new Error(error))

                    const { style: _styleId } = content // vehicle

                    if (!_styleId) return done(new Error(`Vehicle's (${vehicleId}) - style ${_styleId}`))

                    styleId = _styleId

                    logger.debug(`RUNNING TEST:: retrieveStyle (vehicle ${vehicleId} | style ${_styleId}) > fetching vehicle's informations: OK`)

                    done()

                } else done(new Error('something went wrong'))
            })
        })

        it('should succeed in returning a vehicle\'s style information', (done) => {
            logger.debug(`RUNNING TEST:: retrieveStyle (vehicle ${vehicleId} | style ${styleId}) > should succeed in returning a vehicle\'s style information: PENDING`)

            retrieveStyle(styleId, (error, style) => {
                expect(error).toBeUndefined()
                expect(style).toBeDefined()
                expect(style).toBeA('object')
                expect(style.name).toBeA('string')
                expect(style.url).toBeA('string')
                expect(style.image).toBeA('string')
                expect(style.id).toBeA('string')

                logger.debug(`RUNNING TEST:: retrieveStyle (vehicle ${vehicleId} | style ${styleId}) > should succeed in returning a vehicle\'s style information: OK`)

                done()
            })
        })

        it('should fail on incorrect style id', (done) => {
            logger.debug(`RUNNING TEST:: retrieveStyle (vehicle ${vehicleId} | style ${styleId}) > should fail on incorrect style id: PENDING`)

            retrieveStyle(`INCORRECT_STYLE_ID`, (error, style) => {
                expect(error).toBeUndefined()
                expect(style).toBeNull()

                logger.debug(`RUNNING TEST:: retrieveStyle (vehicle ${vehicleId} | style ${styleId}) > should fail on incorrect style id: OK`)
                done()
            })
        })
    })


    it('should fail on non string first param', () => {
        logger.debug(`RUNNING TEST:: retrieveStyle > should fail on non string first param: PENDING`)

        expect(() => retrieveStyle(1, () => { })).toThrowError(TypeError, '1 is not a string')
        expect(() => retrieveStyle(true, () => { })).toThrowError(TypeError, 'true is not a string')
        expect(() => retrieveStyle({}, () => { })).toThrowError(TypeError, '[object Object] is not a string')
        expect(() => retrieveStyle(undefined, () => { })).toThrowError(TypeError, 'undefined is not a string')
        expect(() => retrieveStyle(null, () => { })).toThrowError(TypeError, 'null is not a string')

        logger.debug(`RUNNING TEST:: retrieveStyle > should fail on non string first param: OK`)
    })

    it('should fail is id param is empty', () => {
        logger.debug(`RUNNING TEST:: retrieveStyle > should fail is id param is empty: PENDING`)

        expect(() => retrieveStyle('', () => { })).toThrowError(Error, 'id is empty')

        logger.debug(`RUNNING TEST:: retrieveStyle > should fail is id param is empty: OK`)
    })

    it('should fail on non function second param', () => {
        logger.debug(`RUNNING TEST:: retrieveStyle > should fail on non function second param: PENDING`)

        expect(() => retrieveStyle('FAKE_ID', 1)).toThrowError(TypeError, '1 is not a function')
        expect(() => retrieveStyle('FAKE_ID', true)).toThrowError(TypeError, 'true is not a function')
        expect(() => retrieveStyle('FAKE_ID', {})).toThrowError(TypeError, '[object Object] is not a function')
        expect(() => retrieveStyle('FAKE_ID', undefined)).toThrowError(TypeError, 'undefined is not a function')
        expect(() => retrieveStyle('FAKE_ID', null)).toThrowError(TypeError, 'null is not a function')

        logger.debug(`RUNNING TEST:: retrieveStyle > should fail on non function second param: OK`)
    })
});