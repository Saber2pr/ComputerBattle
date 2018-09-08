var MoveCtrllor = require("MoveCtrllor")
var BarManager = require("BarManager")
var EnemyFactory = require("EnemyFactory")
var AnimationMediator = require("AnimationMediator")
var GlobalData = require("GlobalData")
var MathVec = require("MathVec")
var CollisionManager = require("CollisionManager")

cc.Class({
    extends: cc.Component,

    properties: {
        //scene
        PlayScene:cc.Node,
        //background
        backgroundLayer:cc.Node,
        //ui
        backBtn:cc.Button,
        //ctrl
        basic:cc.Sprite,
        touch:cc.Sprite,
        powerBtn:cc.Button,
        //hero
        hero:cc.Node,
        heroBlood:cc.ProgressBar,
        powerBar:cc.ProgressBar,
        weapon:cc.Node,
        //enemy
        enemyBar:cc.ProgressBar,
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
        //barSet
        this.heroBlood.progress = 1
        this.powerBar.progress = 1
        GlobalData.enemyVector = []
        GlobalData.bulletVector = []
        MoveCtrllor.init(this.basic, this.touch)
        //BarManager.initBar(this.powerBar, this)
        //BarManager.initPowerBtn(this.powerBtn)
        EnemyFactory.initSource(this.enemyType, this.bulletType, this, this.enemySpriteList)
    },

    start () {
        //GlobalData.enemyVector.push(EnemyFactory.createAmary(this.backgroundLayer))
        this.backBtn.node.on("click", function(){
            cc.director.loadScene("StartScene")
        })
        //发射按键
        this.powerBtn.node.on("click",function(){
            //如果有怪物
            if(GlobalData.enemyVector.length>0){
                //武器在背景下发射子弹
                var bullet = EnemyFactory.createBulletToEnemy(this.weapon, this.backgroundLayer, GlobalData.enemyVector)    
            }else{
                var bullet = EnemyFactory.createBullet(this.weapon, this.backgroundLayer)
            }
            //弹药减少
            this.powerBar.progress-=0.1
            //保存子弹数据
            GlobalData.bulletVector.push(bullet)
        }, this)
    },

    update (dt) {
        EnemyFactory.createAmaryInVectorAuto(GlobalData.enemyVector, this.backgroundLayer)
        //摄像机视角
        MoveCtrllor.updateCamera(this.backgroundLayer)
        //人物默认转向
        AnimationMediator.faceTargetByAngle(this.weapon.rotation, this.hero.getChildByName('spr'))
        //武器自动转向
        MoveCtrllor.getStatus()===true?this.weapon.rotation = -MathVec.transformAngle(MoveCtrllor.getMoveAngle()):
        this.weapon.rotation = -MathVec.transformAngle(MoveCtrllor.getLastAngle())      
        //人物血量为0，load游戏结果
        if(this.heroBlood.progress<0.01){
            cc.director.loadScene("OverScene")
        }
        for(var enemy of GlobalData.enemyVector){
            //enemy追踪角色
            AnimationMediator.moveFollowTarget(enemy, MathVec.getPosNegative(this.backgroundLayer.position), 0.5)
            //武器指向怪物
            AnimationMediator.faceToTarget(this.weapon, MathVec.addTwoPos(this.backgroundLayer.position, enemy))
            //backgroundLayer和enemy的坐标原点都是编辑器里的(0, 0)
            //由于摄像机移动，backgroundLayer的坐标为负数
            AnimationMediator.faceTargetToX(MathVec.getPosNegative(this.backgroundLayer.position), this.hero.getChildByName('spr'), enemy)
            //人物撞到怪物减血
            if(CollisionManager.testPos(MathVec.getPosNegative(this.backgroundLayer.position), enemy.position, 10)){
                this.heroBlood.progress -= 0.005
            }
        }
        //匹配子弹和怪物
        for(var bullet of GlobalData.bulletVector){
            for(var enemy of GlobalData.enemyVector){
                //子弹撞到怪物，怪物减血
                if(CollisionManager.testPos(bullet.position, enemy.position, 30)){
                    enemy.getChildByName('blood').getComponent(cc.ProgressBar).progress-=0.2
                    //怪物死亡
                    if(enemy.getChildByName('blood').getComponent(cc.ProgressBar).progress<0.05){
                        enemy.destroy()
                        GlobalData.enemyVector.pop()
                    }
                    cc.log("EBLOOD"+enemy.getChildByName('blood').getComponent(cc.ProgressBar).progress)
                    cc.log("contact")
                }
            }
        }
    }
});
