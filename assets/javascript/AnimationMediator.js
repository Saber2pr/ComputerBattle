var MathVec = require("MathVec")

var AnimationMediator = {
    backgroundLoop (node, pix, method, speed) {
        var _speed = typeof(speed)==='undefined'?1:speed
        if (node.x > -pix) { 
            node.x-=_speed
            node.y-=method==='toLeft'?0:_speed
        } else {
            node.setPosition(0, 0)
        }
    },
    moveFollowTarget(node, target, speed){
        let _speed = typeof(speed)==='undefined'?1:speed
        var front = MathVec.getFront(node, target)
        node.setPosition(node.x + front.x*_speed, node.y + front.y*_speed)
    },
    moveFollowTarget(node, target, speed){
        let _speed = typeof(speed)==='undefined'?1:speed
        var front = MathVec.getFront(node, target)
        node.setPosition(node.x + front.x*_speed, node.y + front.y*_speed)
    },
	fireOnce(node, speed, that){
        node.runAction(cc.moveTo(2*speed, cc.v2(cc.winSize.width, 0)))
        that.scheduleOnce(function(){
            node.destroy()
        }, 2*speed)
    },
    fireToTargetOnce(node, speed, target, that){
        var p = cc.director.getScene().convertToWorldSpaceAR(target.position)
        node.runAction(cc.moveTo(2*speed, cc.v2(target.x, target.y)))
        that.scheduleOnce(function(){
            node.destroy()
        }, 2*speed)
    },
    getRandString(list){
        return list[parseInt((list.length)*cc.random0To1())]
    },
    randColor () {
        var c1 = 200 * cc.random0To1()
        var c2 = 200 * cc.random0To1()
        var c3 = 200 * cc.random0To1()
        return cc.color(c1, c2, c3)
    },
    faceToTarget(node, target){
        node.rotation = -MathVec.transformAngle(MathVec.getAngle(MathVec.getFront(node, target)))
    },
    faceToNearestTarget(node, vector){
        this.faceToTarget(node, this.getNearestTarget(node, vector))
    },
    getNearestTarget(node, vector){
        var disVector = []
        for(var target of vector){
            disVector.push(parseInt(MathVec.getDistance(node, target)))
        }
        var minDis = MathVec.getMinFromVector(disVector)
        return vector[MathVec.getOrderFromVector(minDis, disVector)]
    },

    rotateToTarget(node, target){
        node.rotation = -MathVec.transformAngle(MathVec.getAngle(MathVec.getFront(node, target)))
    }
}

module.exports = AnimationMediator
