var MoveCtrllor = require("MoveCtrllor")
var MathVec = require("MathVec")
// var AnimationMediator = require("AnimationMediator")
var BarManager = require("BarManager")

cc.Class({
    extends: cc.Component,

    properties: {
        //background
        backgroundSpr:cc.Sprite,
        backBtn:cc.Button,
        //hero
        hero:cc.Node,
        bar:cc.ProgressBar,
        bloodBar:cc.ProgressBar,
        //weapon
        compu:cc.Node,
        //ctrl
        touchBasic:cc.Sprite,
        touchTarget:cc.Sprite,
        powerX:cc.Button,
        //Amary
        amary:cc.Node
    },

    speed:null,
    compuSpr:null,

    addBarSch:function(){
        BarManager.addBarSch(this.bar, this)
    },
    reduceBarSch:function(){
        BarManager.reduceBarSch(this.bar, this)
    },

    onLoad () {
        this.bar.progress=0
        this.bloodBar.progress=1
        this.compuSpr=this.compu.getComponent(cc.Sprite)
    },

    start () {
        this.addAmary()
        this.speed = 5
        this.backBtn.node.on("click", this.backToStartScene, this)
        this.powerX.node.on("touchstart", this.addBarSch, this)
        this.powerX.node.on("touchend",this.reduceBarSch, this)
        this.powerX.node.on("touchcancel",this.reduceBarSch, this)
        MoveCtrllor.init(this.touchBasic, this.touchTarget, 25)
    },

    addAmary(){
        var amary = cc.instantiate(this.amary)
        amary.parent = this.backgroundSpr.node
        amary.position = MathVec.getRandNum(cc.v2(400, 480), 'y')
    },

    backToStartScene () {
        cc.director.loadScene("StartScene")
    },

    update (dt) {
        if(MoveCtrllor.getStatus()===true){
            MoveCtrllor.updateCharacter(this.hero, this.speed)
        }
    },

    onDestroy () {
        this.unschedule(this.update)
    }
});
