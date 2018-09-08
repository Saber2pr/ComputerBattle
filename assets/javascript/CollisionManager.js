var MathVec = require("MathVec")

var CollisionManager = {
    testPos(pos1, pos2, dis){
        return MathVec.getDistance(pos1, pos2)<dis?true:false
    }
}

module.exports = CollisionManager
