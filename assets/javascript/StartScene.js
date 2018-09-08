
var AnimationMediator = require("AnimationMediator")

cc.Class({
    extends: cc.Component,

    properties: {
        startBtn:cc.Button,
        backgroundSpr:cc.Sprite,
        audio:cc.AudioClip
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.startBtn.node.on("click", this.gotoPlayScene, this)
    },

    gotoPlayScene () {
        this.current = cc.audioEngine.play(this.audio, false, 1)
        cc.director.loadScene("PlayScene")
    },

    update (dt) {
        AnimationMediator.backgroundLoop(this.backgroundSpr.node, 64)
    }
});
