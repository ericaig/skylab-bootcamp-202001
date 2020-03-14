/**
 * @namespace
 * @property {number} WORK_DAY - Normal working day
 * @property {number} WORK_HOLIDAY - Days that the company is mandatory closed and workers won't come to work
 * @property {number} USER_HOLIDAY - Days any user marks as holiday
 * @property {number} USER_ABSENCE - Days any user is/will be absent from work
 */
module.exports = {
    WORK_DAY: 1,
    WORK_HOLIDAY: 2,
    USER_HOLIDAY: 3,
    USER_ABSENCE: 4,
    USER_SIGN_IN_OUT: 5
}