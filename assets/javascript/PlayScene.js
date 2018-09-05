var MoveCtrllor = require("MoveCtrllor")
var MathVec = require("MathVec")
var AnimationMediator = require("AnimationMediator")
var BarManager = require("BarManager")
var GlobalData = require("GlobalData")
var EnemyFactory = require("EnemyFactory")

cc.Class({
    extends: cc.Component,

    properties: {
        //background
        backgroundSpr:cc.Sprite,
        backBtn:cc.Button,
        //hero
        hero:cc.Node,
        bar:cc.ProgressBar,
        heroBlood:cc.ProgressBar,
        //weapon
        compu:cc.Node,
        //ctrl
        touchBasic:cc.Sprite,
        touchTarget:cc.Sprite,
        powerX:cc.Button,
        //prefab
        enemyType:cc.Prefab,
        bulletType:cc.Prefab,
        //spriteList
        spriteList:{
            default:[],
            type:[cc.SpriteFrame]
        }
    },

    speed:null,
    compuSpr:null,

    onLoad () {
        GlobalData.enemyVector = []
		EnemyFactory.initSource(this.spriteList, this.enemyType, this.bulletType)
        BarManager.initBar(this.bar, this)
        BarManager.initPowerBtn(this.powerX)
        MoveCtrllor.init(this.touchBasic, this.touchTarget, 25)
        this.heroBlood.progress=1
        this.compuSpr=this.compu.getComponent(cc.Sprite)
    },

    start () {
        this.addAmary() 
        this.backBtn.node.on("click", this.backToStartScene, this)
    },

    addAmary(){
        var bullet = EnemyFactory.createBullets(this.compu, this)
		var enemy = EnemyFactory.createAmary(this.backgroundSpr.node)
        enemy.position = MathVec.getRandNum(cc.v2(400, 480), 'y')
    	GlobalData.enemyVector.push(enemy)
    },

    backToStartScene () {
        cc.director.loadScene("StartScene")
    },

    update (dt) {
		this.compu.color = this.bar.barSprite.node.color
		for(var enemy of GlobalData.enemyVector){
            AnimationMediator.moveFollowTarget(enemy, 1, this.hero)
        }
        MoveCtrllor.updateCharacter(this.hero, 5)
    },

    onDestroy () {
        this.unschedule(this.update)
    }
});
