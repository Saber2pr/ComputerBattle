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
        wall:cc.Node,
        noticeLabel:cc.Label,
        scoreLabel:cc.Label,
        timeLabel:cc.Label,
        heroBloodLabel:cc.Label,
        bulletLabel:cc.Label,
        ideaLabel:cc.Label,
        levelLabel:cc.Label,
        //ui
        ///layout
        pauseLayout:cc.Layout,
        pauseBtn:cc.Button,
        backBtn:cc.Button,
        //ctrl
        basic:cc.Sprite,
        touch:cc.Sprite,
        powerBtn:cc.Button,
        //hero
        hero:cc.Node,
        heroBlood:cc.ProgressBar,
        powerBar:cc.ProgressBar,
        ideaBar:cc.ProgressBar,
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
    enemyNum:null,
    enemySpeed:null,
    timeStep:null,
    bulletNum:null,
    //计数器
    count:null,
    nextCount:null,
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
        this.enemyNum=1
        //count
        this.count=0
        //GlobalDataInit
        GlobalData.enemyVector = []
        GlobalData.bulletVector = []
        MoveCtrllor.init(this.basic, this.touch)
        EnemyFactory.initSource(this.enemyType, this.bulletType, this, this.enemySpriteList)
        // 启用碰撞  
        //cc.director.getPhysicsManager().enabled = true
        //cc.director.getPhysicsManager().gravity = cc.v2(0, 0)
    },

    start () {
        //初始化按钮
        this.buttonInit()
        //初始化定时器
        this.scheduleInit()
    },
    scheduleInit(){
        this.schedule(function(){
            if(this.enemyLock){
                this.timeLabel.string-=1
                if(this.timeLabel.string<0){
                    this.timeStep+=10
                    this.timeLabel.string=this.timeStep
                    this.enemySpeed+=0.5
                    this.levelLabel.string+=1
                    this.enemyNum+=2
                }
            }
        }, 1)
    },
    buttonInit(){
        this.pauseBtn.node.on("click", function(){
            this.current = cc.audioEngine.play(this.audio, false, 1)
            this.pauseIn()
        }, this)
        this.backBtn.node.on("click", function(){
            this.current = cc.audioEngine.play(this.audio, false, 1)
            this.pauseOut()            
            cc.director.loadScene("StartScene")
        }, this)
        //发射按键
        this.powerBtn.node.on("click",function(){
            //如果有怪物
            if(GlobalData.enemyVector.length>0){
                //武器在背景下发射子弹
                var bullet = EnemyFactory.createBulletToEnemy(this.backgroundLayer.convertToNodeSpace(this.weapon), this.backgroundLayer, GlobalData.enemyVector)    
            }else{
                var bullet = EnemyFactory.createBullet(this.weapon, this.backgroundLayer)
            }
            //弹药减少
            this.powerBar.progress-=1/this.bulletNum
            //保存子弹数据
            GlobalData.bulletVector.push(bullet)
        }, this)
    },
    pauseIn(){
        if(this.pauseLayout.node.y>-300 && !cc.director.isPaused()){
            var pauseState = this.pauseLayout.node.getComponent(cc.Animation).play()
            this.scheduleOnce(function(){
                cc.director.pause()
            }, pauseState.duration)
        }else{
            cc.director.resume()
            this.pauseLayout.node.y+=694
        }
    },
    pauseOut(){
        cc.director.resume()
        this.pauseLayout.node.y+=694
    },
    update (dt) {     
        //同步数据
        this.synData()
        //匹配子弹和怪物
        this.collisionHandle()
        //武器自动转向
        this.guideVisual()
        //进入战斗区域
        this.enterDangerArea()
        //静止一秒后减少智力,恢复子弹
        this.heroStayRecover()
        //产生怪物
        this.appearEnemy()
        //怪物行动
        this.enemyAction()
        //人物血量为0或弹药用尽或智力为0，load游戏结果
        this.judgeGameStatus()
    },
    synData(){
        //同步子弹数量
        this.bulletLabel.string = parseInt(this.powerBar.progress*this.bulletNum)
        //同步智力值    
        this.ideaLabel.string = parseInt(this.ideaBar.progress*100)  
        //同步wall
        //this.wall.position = this.backgroundLayer.position
        
        //cc.log(this.wall.position)
        //cc.log(MathVec.getPosNegative(this.backgroundLayer.position))
    },
    collisionHandle(){
        for(var bullet of GlobalData.bulletVector){
            for(var i=0; i<GlobalData.enemyVector.length; i++){
                var enemy = GlobalData.enemyVector[i]
                //子弹撞到怪物，怪物减血
                if(CollisionManager.testPos(bullet.position, enemy.position, 30)){
                    enemy.getChildByName('blood').getComponent(cc.ProgressBar).progress-=0.2
                    //音效
                    this.current = cc.audioEngine.play(this.audio, false, 1)
                    //怪物死亡
                    if(enemy.getChildByName('blood').getComponent(cc.ProgressBar).progress<0.05){
                        enemy.destroy()
                        //删除记录
                        GlobalData.enemyVector.splice(i, 1)
                        i-=1
                        //加分数
                        this.scoreLabel.string+=1
                    }
                }
            }
        }
    },
    guideVisual(){
        MoveCtrllor.getStatus()===true?this.weapon.rotation = -MathVec.transformAngle(MoveCtrllor.getMoveAngle()):
        this.weapon.rotation = -MathVec.transformAngle(MoveCtrllor.getLastAngle())
        AnimationMediator.faceTargetByAngle(this.weapon.rotation, this.hero.getChildByName('spr'))
        MoveCtrllor.updateCamera(this.backgroundLayer)
    },
    guideHeroByEnemy(enemy){
        AnimationMediator.faceTargetToX(MathVec.getPosNegative(this.backgroundLayer.position), this.hero.getChildByName('spr'), enemy)
    },
    enterDangerArea(){
        if(this.backgroundLayer.x<300){
            //移除指示
            this.noticeLabel.node.removeFromParent(false)
            this.enemyLock=true
        }
    },
    heroStayRecover(){
        if(this.count>60){
            this.ideaBar.progress-=0.005
            this.powerBar.progress+=0.005
            if(this.powerBar.progress>1){
                this.powerBar.progress=1
            }
        }
    },
    appearEnemy(){
        if(this.enemyLock){            
            //开始计数
            this.count+=1
            if(MoveCtrllor.getStatus()===true){
                this.count=0
                if(this.ideaBar.progress<=1){
                    this.ideaBar.progress+=0.005
                }
            }
            EnemyFactory.createAmaryInVectorAuto(GlobalData.enemyVector, this.backgroundLayer, this.enemyNum, MathVec.getRandPos(cc.p(600, 480*0.66), cc.p(-300, -240*0.66)))
            //武器锁定最近目标
            AnimationMediator.faceToNearestTarget(this.weapon, MathVec.getPosNegative(this.backgroundLayer.position), GlobalData.enemyVector)
        }
    },
    judgeGameStatus(){
        if(this.heroBlood.progress<0.01 || this.bulletLabel.string<0 || this.ideaBar.progress<0.01){
            GlobalData.score = this.scoreLabel.string
            GlobalData.level = this.levelLabel.string
            cc.director.loadScene("OverScene")
        }
    },
    enemyAction(){
        for(var enemy of GlobalData.enemyVector){
            //enemy追踪角色
            AnimationMediator.moveFollowTarget(enemy, MathVec.getPosNegative(this.backgroundLayer.position), this.enemySpeed)
            //backgroundLayer和enemy的坐标原点都是编辑器里的(0, 0)
            //由于摄像机移动，backgroundLayer的坐标为负数
            this.guideHeroByEnemy(enemy)
            //人物撞到怪物减血
            if(CollisionManager.testPos(MathVec.getPosNegative(this.backgroundLayer.position), enemy.position, 10)){
                this.heroBlood.progress -= 0.005
                this.heroBloodLabel.string=parseInt(this.heroBlood.progress*100)
            }
        }
    },
});
