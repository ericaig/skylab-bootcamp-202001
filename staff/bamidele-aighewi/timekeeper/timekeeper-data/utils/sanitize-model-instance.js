module.exports = function(modelInstance){
    modelInstance.id = modelInstance._id
    delete modelInstance._id
    delete modelInstance.__v
}