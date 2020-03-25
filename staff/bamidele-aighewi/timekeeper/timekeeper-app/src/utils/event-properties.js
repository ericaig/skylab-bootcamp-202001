export default {
    get types() {
        return {
            names: ['Work day', 'Public holiday', 'Holiday', 'Absence', "Sign ins 'n out"]
        }
    },

    get states(){
        return {
            names: ['Pending', 'Accepted']
        }
    }
}