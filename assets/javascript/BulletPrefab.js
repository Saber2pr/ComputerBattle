
module.exports = cc.Class({
    extends: cc.Component,

    properties: {
        nodeRoot:cc.Node,
        text:cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.log("bulletConfig"+this.text.string)
        cc.log("rootConfig"+this.nodeRoot)
    },

    start () {

    },

    getRootNode(){
        return this.nodeRoot
    }

    // update (dt) {},
});
