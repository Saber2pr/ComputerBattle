var AnimationMediator = require("AnimationMediator")

cc.Class({
    extends: cc.Component,

    properties: {
        amary:cc.Node,
        target:cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    update (dt) {
        AnimationMediator.moveFollowTarget(this.amary, 1, this.target)
    }
});
