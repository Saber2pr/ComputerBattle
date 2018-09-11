var MathVec = require("MathVec")

var AnimationMediator = {
    /**
     * 滚动背景(node, pix, method, speed)
     */
    backgroundLoop (node, pix, method, speed) {
        var _speed = typeof(speed)==='undefined'?1:speed
        if (node.x > -pix) { 
            node.x-=_speed
            node.y-=method==='toLeft'?0:_speed
        } else {
            node.setPosition(0, 0)
        }
    },
    /**
     * 追踪节点(update中刷新)(node, target, speed)
     */
    moveFollowTarget(node, target, speed){
        let _speed = typeof(speed)==='undefined'?1:speed
        var front = MathVec.getFront(node, target)
        node.setPosition(node.x + front.x*_speed, node.y + front.y*_speed)
    },
    /**
     * 发射一次(node, des, angle, speed, that)
     */
	fireOnce(node, des, angle, speed, that){
        node.runAction(cc.moveTo(2*speed, MathVec.getPos(angle, des)))
        that.scheduleOnce(function(){
            node.destroy()
        }, 2*speed)
    },
    /**
     * 朝目标节点发射一次(node, speed, target, that)
     */
    fireToTargetOnce(node, speed, target, that){
        var p = target.parent.convertToWorldSpace(target.position)
        node.runAction(cc.moveTo(2*speed, cc.v2(target.x, target.y)))
        that.scheduleOnce(function(){
            node.destroy()
        }, 2*speed)
    },
    /**
     * 获取随机色
     */
    randColor () {
        var c1 = 200 * cc.random0To1()
        var c2 = 200 * cc.random0To1()
        var c3 = 200 * cc.random0To1()
        return cc.color(c1, c2, c3)
    },
    /**
     * 面向目标节点(node, target)
     */
    faceToTarget(node, parentNode, target){
        AnimationMediator.rotateToTarget(node, parentNode, target)
    },
    /**
     * 面向最近的节点(node, vector)
     */
    faceToNearestTarget(node, parentNode, vector){
        this.faceToTarget(node, parentNode, this.getNearestTarget(parentNode, vector))
    },
    /**
     * 获取最近的节点(node, vector)
     */
    getNearestTarget(node, vector){
        var disVector = []
        for(var target of vector){
            disVector.push(parseInt(MathVec.getDistance(node, target)))
        }
        var minDis = MathVec.getMinFromVector(disVector)
        if(vector.length>0){
            return vector[MathVec.getOrderFromVector(minDis, disVector)]
        }
    },
    /**
     * 转向目标(node, target)
     */
    rotateToTarget(node, parentNode, target){
        node.rotation = -MathVec.transformAngle(MathVec.getAngle(MathVec.getFront(parentNode, target)))
    },
    /**
     * 同步旋转(node1, node2)
     */
    followRotate(node1, node2){
        node1.rotation = node2.rotation
    },
    /**
     * X轴翻转面向target(node, sprNode, target)
     */
    faceTargetToX(node, sprNode, target){
        node.x-target.x>0?sprNode.runAction(cc.flipX(true)):sprNode.runAction(cc.flipX(false))
    },
    /**
     * 根据角度翻转X
     * 例如
     * ```js
     *  //人物自动转向
        AnimationMediator.faceTargetByAngle(this.weapon.rotation, this.hero.getChildByName('spr'))
        ```
     */
    faceTargetByAngle(angle, sprNode){
        Math.abs(angle)>90?sprNode.runAction(cc.flipX(true)):
            sprNode.runAction(cc.flipX(false))
    }

}

module.exports = AnimationMediator
