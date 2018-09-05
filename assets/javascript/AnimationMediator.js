var MathVec = require("MathVec")

var AnimationMediator = {
    backgroundLoop (Sprite, pix) {
        if (Sprite.node.x > -pix) {
            Sprite.node.x-=1
            Sprite.node.y-=1
        } else {
            Sprite.node.setPosition(0, 0)
        }
    },
    moveFollowTarget(node, speed, target){
        var front = MathVec.getFront(node, target)
        node.setPosition(node.x + front.x*speed, node.y + front.y*speed)
    },

	fireOnce(node, speed, that){
        node.runAction(cc.moveTo(2*speed, cc.v2(cc.winSize.width, 0)))
        that.scheduleOnce(function(){
            node.destroy()
        }, 2*speed)
    }
}

module.exports = AnimationMediator
