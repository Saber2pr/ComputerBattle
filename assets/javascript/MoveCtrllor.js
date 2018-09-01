//depend
var MathVec = require('MathVec')
/**
 * #### 2018年9月1日15:26:16
 * * 使用它创建轮盘很简单
 * 1. 先在场景onload中初始化
 * > MoveCtrllor.init(this.touchBasic, this.touchTarget, 25)
 * 2. 然后在update里绑定角色节点
 * > if(MoveCtrllor.getStatus()===true){
   >     MoveCtrllor.updateCharacter(this.hero, this.speed)
   > }
 * 3. 传入拖动盘和拖动点，实现拖动手柄
 * 4. 提供返回拖动角度和拖动力度的接口
 * 5. 控制节点运动接口
 * #### By AK-12 @[qq:1029985799@qq.com, gmail:saber2pr@gmail.com]
 */
var MoveCtrllor = {
    angle:null,
    force:null,
    status:null,
    onload(touchSpr){
        this.angle=0
        this.force=0
        this.status=false
        touchSpr.node.setPosition(0, 0)
    },
    /**
     * 传入拖动盘和拖动点，实现拖动手柄
     */
    init: function (basicSpr, touchSpr, radius) {
        basicSpr.node.on("touchstart", function(touch){
            this.status=true
        }, this)
        basicSpr.node.on("touchmove", function(touch){
            //转换到局部坐标
            var touchPosOnBasic = basicSpr.node.convertToNodeSpaceAR(touch.getLocation())
            //限制拖动范围
            var touchPosOnBasicLimited = MathVec.limitToCircle(touchPosOnBasic, radius)
            touchSpr.node.setPosition(touchPosOnBasicLimited)
            //保存角度
            this.angle = MathVec.getAngle(touchPosOnBasicLimited)
            //保存拖动力度
            this.force = MathVec.getLength(touchPosOnBasicLimited)/radius
        }, this)
        basicSpr.node.on("touchend", function(touch){
            this.onload(touchSpr)
        }, this)
        basicSpr.node.on("touchcancel", function(touch){
            this.onload(touchSpr)
        }, this)
    },
    /**
     * 获取拖动角度(弧度)
     */
    getMoveAngle(){
        return this.angle
    },
    /**
     * 获取拖动力度
     */
    getForce(){
        return this.force
    },
    /**
     * 获取按键状态
     */
    getStatus(){
        return this.status
    },
    /**
     * 角色动作响应,建议1<speed<10
     */
    updateCharacter(node, speed){
        var angle = this.getMoveAngle()
        var force = this.getForce()
        var desPos = cc.p(node.x + speed*Math.cos(angle)*force, node.y + speed*Math.sin(angle)*force)
        node.runAction(cc.moveTo(0.1, cc.v2(MathVec.limitToRect(desPos, 400, 240))))
    }
}

module.exports = MoveCtrllor