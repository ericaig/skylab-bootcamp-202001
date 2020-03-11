module.exports = function(modelInstance){
    if (modelInstance){
        modelInstance.id = modelInstance._id
        delete modelInstance._id
        delete modelInstance.__v
    }
    
    return modelInstance
}