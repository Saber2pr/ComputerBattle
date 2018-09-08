
cc.Class({
    extends: cc.Component,

    properties: {
        restartBtn:cc.Button
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.restartBtn.node.on("click", function(){
            cc.director.loadScene("PlayScene")
        }, this)
    },

    // update (dt) {},
});
