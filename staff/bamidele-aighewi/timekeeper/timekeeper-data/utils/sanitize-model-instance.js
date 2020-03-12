module.exports = function(modelInstance){
    if (modelInstance && modelInstance instanceof Object ){
        modelInstance.id = modelInstance._id
        delete modelInstance._id
        delete modelInstance.__v
    }
    
    return modelInstance
}