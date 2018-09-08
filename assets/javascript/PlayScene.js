var SceneMediator = require("SceneMediator")
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
        audio:cc.AudioClip,
        //background
        backgroundLayer:cc.Node,
        noticeLabel:cc.Label,
        scoreLabel:cc.Label,
        timeLabel:cc.Label,
        heroBloodLabel:cc.Label,
        bulletLabel:cc.Label,
        levelLabel:cc.Label,
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
    
    enemyLock:null,
    enemySpeed:null,
    timeStep:null,
    bulletNum:null,
    // LIFE-CYCLE CALLBACKS:
    
    onLoad () {
        //labelSet
        this.bulletNum=20
        this.timeLabel.string=0
        this.timeStep=10
        this.timeLabel.string+=this.timeStep
        this.bulletLabel.string=this.bulletNum
        this.levelLabel.string=1
        //barSet
        this.scoreLabel.string = 0
        this.heroBlood.progress = 1
        this.powerBar.progress = 1
        //enemySet
        this.enemySpeed=0.5
        this.enemyLock=false
        //GlobalDataInit
        GlobalData.enemyVector = []
        GlobalData.bulletVector = []
        MoveCtrllor.init(this.basic, this.touch)
        EnemyFactory.initSource(this.enemyType, this.bulletType, this, this.enemySpriteList)
    },

    start () {
        this.backBtn.node.on("click", function(){
            this.current = cc.audioEngine.play(this.audio, false, 1)
            cc.director.loadScene("StartScene")
        }, this)
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
            this.powerBar.progress-=1/this.bulletNum
            
            //保存子弹数据
            GlobalData.bulletVector.push(bullet)
        }, this)
        this.schedule(function(){
            if(this.enemyLock){
                this.timeLabel.string-=1
                if(this.timeLabel.string<0){
                    this.timeStep+=10
                    this.timeLabel.string=this.timeStep
                    this.enemySpeed+=0.5
                    this.levelLabel.string+=1
                }
            }
        }, 1)
    },

    update (dt) {
        //同步子弹数量
        this.bulletLabel.string = parseInt(this.powerBar.progress*this.bulletNum)
        //进入战斗区域
        if(this.backgroundLayer.x<300){
            //移除指示
            this.noticeLabel.node.removeFromParent(false)
            this.enemyLock=true
        }
        if(this.enemyLock){
            EnemyFactory.createAmaryInVectorAuto(GlobalData.enemyVector, this.backgroundLayer, MathVec.getRandPos(cc.p(600, 480*0.66), cc.p(-300, -240*0.66)))
        }
        //摄像机视角
        MoveCtrllor.updateCamera(this.backgroundLayer)
        //人物默认转向
        AnimationMediator.faceTargetByAngle(this.weapon.rotation, this.hero.getChildByName('spr'))
        //武器自动转向
        MoveCtrllor.getStatus()===true?this.weapon.rotation = -MathVec.transformAngle(MoveCtrllor.getMoveAngle()):
        this.weapon.rotation = -MathVec.transformAngle(MoveCtrllor.getLastAngle())      
        //人物血量为0或弹药用尽，load游戏结果
        if(this.heroBlood.progress<0.01 || this.bulletLabel.string<0){
            GlobalData.score = this.scoreLabel.string
            cc.director.loadScene("OverScene")
        }
        for(var enemy of GlobalData.enemyVector){
            //enemy追踪角色
            AnimationMediator.moveFollowTarget(enemy, MathVec.getPosNegative(this.backgroundLayer.position), this.enemySpeed)
            //武器指向怪物
            AnimationMediator.faceToTarget(this.weapon, MathVec.addTwoPos(this.backgroundLayer.position, enemy))
            //backgroundLayer和enemy的坐标原点都是编辑器里的(0, 0)
            //由于摄像机移动，backgroundLayer的坐标为负数
            AnimationMediator.faceTargetToX(MathVec.getPosNegative(this.backgroundLayer.position), this.hero.getChildByName('spr'), enemy)
            //人物撞到怪物减血
            if(CollisionManager.testPos(MathVec.getPosNegative(this.backgroundLayer.position), enemy.position, 10)){
                this.heroBlood.progress -= 0.005
                this.heroBloodLabel.string=parseInt(this.heroBlood.progress*100)
            }
        }
        //匹配子弹和怪物
        for(var bullet of GlobalData.bulletVector){
            for(var enemy of GlobalData.enemyVector){
                //子弹撞到怪物，怪物减血
                if(CollisionManager.testPos(bullet.position, enemy.position, 30)){
                    enemy.getChildByName('blood').getComponent(cc.ProgressBar).progress-=0.2
                    //音效
                    this.current = cc.audioEngine.play(this.audio, false, 1)
                    //怪物死亡
                    if(enemy.getChildByName('blood').getComponent(cc.ProgressBar).progress<0.05){
                        enemy.destroy()
                        GlobalData.enemyVector.pop()
                        //加分数，加子弹
                        this.scoreLabel.string+=1
                        this.powerBar.progress+=0.14
                        if(this.powerBar.progress>1){
                            this.powerBar.progress=1
                        }
                    }
                }
            }
        }
    }
});
