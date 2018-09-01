var MoveCtrllor = require("MoveCtrllor")
var MathVec = require("MathVec")

cc.Class({
    extends: cc.Component,

    properties: {
        //background
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

    onLoad () {
        this.bar.progress=0
        this.bloodBar.progress=1
        this.compuSpr=this.compu.getComponent(cc.Sprite)
    },

    start () {
        this.addAmary()
        this.speed = 5
        this.backBtn.node.on("click", this.backToStartScene, this)
        this.powerX.node.on("touchstart", function(){
            this.unschedule(this.reducePower)
            this.schedule(this.addPower, 0.1, 200, 0)
        }, this)
        this.powerX.node.on("touchend",function(){
            this.schedule(this.reducePower, 0.1, 200, 0)
            this.unschedule(this.addPower)
        }, this)
        this.powerX.node.on("touchcancel",function(){
            this.schedule(this.reducePower, 0.1, 200, 0)
            this.unschedule(this.addPower)
        }, this)
        MoveCtrllor.init(this.touchBasic, this.touchTarget, 25)
    },

    addPower(){
        this.bar.progress<0.3?this.bar.progress+=0.01:
        this.bar.progress<0.7?this.bar.progress+=0.007:
        this.bar.progress<0.990?this.bar.progress+=0.005:
        this.bar.progress=1
        this.colorBar()
    },

    reducePower(){
        this.bar.progress>0.05?this.bar.progress-=0.05:this.bar.progress=0
        this.colorBar()
    },

    colorBar(){
        this.bar.progress<0.3?this.bar.barSprite.node.color=cc.Color.GREEN:
        this.bar.progress<0.7?this.bar.barSprite.node.color=cc.Color.YELLOW:
        this.bar.progress<0.990?this.bar.barSprite.node.color=cc.Color.BLUE:
        this.bar.barSprite.node.color=cc.Color.BLACK
        this.compuSpr.node.color=this.bar.barSprite.node.color
    },

    addAmary(){
        var amary = cc.instantiate(this.amary)
        amary.parent = cc.director.getScene()
        amary.position = MathVec.getRandNum(cc.v2(700, 480), 'y')
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
