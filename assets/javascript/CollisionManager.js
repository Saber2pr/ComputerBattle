
cc.Class({
    extends: cc.Component,

    properties: {
    	hero:cc.Node,
		amary:cc.Node,
		heroBloodBar:cc.ProgressBar,
		amaryBloodBar:cc.ProgressBar
    },

    onBeginContact (contact, selfCollider, otherCollider){
		this.heroBloodBar.progress-=20
		cc.log("contact!")
	},

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
