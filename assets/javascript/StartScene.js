var AnimationMediator = require("AnimationMediator")

cc.Class({
    extends: cc.Component,

    properties: {
        startBtn:cc.Button,
        backgroundSpr:cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.startBtn.node.on("click", this.gotoPlayScene, this)
    },

    gotoPlayScene () {
        cc.director.loadScene("PlayScene")
    },

    update (dt) {
        AnimationMediator.backgroundLoop(this.backgroundSpr, 64)
    }
});
