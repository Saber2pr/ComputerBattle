var GlobalData = require("GlobalData")
var AnimationMediator = require("AnimationMediator")

cc.Class({
    extends: cc.Component,

    properties: {
        //ui
        restartBtn:cc.Button,
        //表格数据
        newScore:cc.Label,
        newLevel:cc.Label,
        hScore:cc.Label,
        hLevel:cc.Label,
        //background
        backgroundSpr:cc.Sprite,
        audio:cc.AudioClip
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //统计结果
        //分数
        this.updateLabel(this.newScore, this.hScore, GlobalData.score, GlobalData.scoreVector)
        //关卡
        this.updateLabel(this.newLevel, this.hLevel, GlobalData.level, GlobalData.levelVector)
    },
    
    updateLabel(label, hLabel, string, vector){
        label.string = string
        vector.push(label.string)
        hLabel.string = Math.max.apply(null, vector)
    },

    start () {
        this.restartBtn.node.on("click", function(){
            this.current = cc.audioEngine.play(this.audio, false, 1)
            cc.director.loadScene("PlayScene")
        }, this)
    },

    update (dt) {
        AnimationMediator.backgroundLoop(this.backgroundSpr.node, 64)
    },
});
