
cc.Class({
    extends: cc.Component,

    properties: {
        bullet:cc.Node
    },

    onBeginContact(contact, selfCollider, otherCollider){
        cc.log("contact!")
    },

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
