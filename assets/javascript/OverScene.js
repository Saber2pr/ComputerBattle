var GlobalData = require("GlobalData")
var AnimationMediator = require("AnimationMediator")

cc.Class({
    extends: cc.Component,

    properties: {
        restartBtn:cc.Button,
        scoreLabel:cc.Label,
        list:cc.Label,
        backgroundSpr:cc.Sprite,
        audio:cc.AudioClip
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.scoreLabel.string = GlobalData.score
        GlobalData.scoreVector.push(this.scoreLabel.string)
        this.list.string = Math.max.apply(null, GlobalData.scoreVector)
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
