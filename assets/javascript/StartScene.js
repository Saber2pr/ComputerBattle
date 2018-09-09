
var AnimationMediator = require("AnimationMediator")

cc.Class({
    extends: cc.Component,

    properties: {
        startBtn:cc.Button,
        backgroundSpr:cc.Sprite,
        audio:cc.AudioClip
    },

    // LIFE-CYCLE CALLBACKS:

    bool:null,

    start () {
        this.bool = true
        this.startBtn.node.on("click", this.gotoPlayScene, this)
        this.schedule(function(){
            this.bool = !this.bool
        }, 1)
    },

    gotoPlayScene () {
        this.current = cc.audioEngine.play(this.audio, false, 1)
        cc.director.loadScene("PlayScene")
    },

    update (dt) {
        this.startBtn.node.active = this.bool
        AnimationMediator.backgroundLoop(this.backgroundSpr.node, 64)
    }
});
