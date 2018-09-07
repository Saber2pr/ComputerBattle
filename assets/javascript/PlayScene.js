var MoveCtrllor = require("MoveCtrllor")
var BarManager = require("BarManager")
var EnemyFactory = require("EnemyFactory")
var AnimationMediator = require("AnimationMediator")
var GlobalData = require("GlobalData")

cc.Class({
    extends: cc.Component,

    properties: {
        //background
        backgroundNode:cc.Node,
        backgroundLayer:cc.Node,
        //ui
        backBtn:cc.Button,
        //ctrl
        basic:cc.Sprite,
        touch:cc.Sprite,
        powerBtn:cc.Button,
        //hero
        hero:cc.Node,
        powerBar:cc.ProgressBar,
        weapon:cc.Node,
        //enemy
        enemySpriteList:{
            default:[],
            type:[cc.SpriteFrame]
        },
        //type
        enemyType:cc.Node,
        bulletType:cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        GlobalData.enemyVector = []
        MoveCtrllor.init(this.basic, this.touch)
        BarManager.initBar(this.powerBar, this)
        BarManager.initPowerBtn(this.powerBtn)
        EnemyFactory.initSource(this.enemyType, this.bulletType, this, this.enemySpriteList)
    },

    start () {
        this.backBtn.node.on("click", function(){
            cc.director.loadScene("StartScene")
        }, this)
        GlobalData.enemyVector.push(EnemyFactory.createAmary(this.backgroundLayer))
        this.schedule(function(){
            var bullet = EnemyFactory.createLabelBulletToEnemys(this.weapon, GlobalData.enemyVector)
        }, 1)
    },

    update (dt) {
        AnimationMediator.backgroundLoop(this.backgroundNode, 64, 'toLeft', 4)
        this.weapon.color = BarManager.getColorFromBar(this.powerBar)
        MoveCtrllor.updateCharacter(this.hero)
        for(var enemy of GlobalData.enemyVector){
            AnimationMediator.moveFollowTarget(enemy, this.hero)
        }
        AnimationMediator.faceToNearestTarget(this.hero, GlobalData.enemyVector)
    },
});
