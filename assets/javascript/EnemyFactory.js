var AnimationMediator = require("AnimationMediator")
var GlobalData = require("GlobalData")
var MathVec = require("MathVec")

var EnemyFactory = {
    enemySpriteList:null,
    enemyType:null,
    enemyPool:null,
    bulletType:null,
    bulletPool:null,
    that:null,
    /**
     * 初始化资源(enemyType, bulletType, that, spriteList)
     */
    initSource(enemyType, bulletType, that, spriteList){
        this.that = that
        this.enemySpriteList = spriteList
        this.enemyType = enemyType
        this.bulletType = bulletType
        this.enemyPool = new cc.NodePool()
        this.bulletPool = new cc.NodePool()
    	EnemyFactory.fillPool()
    },
    /**
     * 填充对象池
     */
    fillPool(){
        for (let i=0, initCount=5; i < initCount; ++i){
    	    let enemy = cc.instantiate(EnemyFactory.enemyType)
            enemy.getChildByName('spr').getComponent(cc.Sprite).spriteFrame = EnemyFactory.getRandSpriteFrame()
    	    this.enemyPool.put(enemy)
    	    let bullet = cc.instantiate(EnemyFactory.bulletType)
            bullet.color = AnimationMediator.randColor()
    	    this.bulletPool.put(bullet)
    	}
    },
    /**
     * 在图层中产生怪物(layer, pos)
     */
    createAmary(layer, pos){
        let _pos = pos==='undefined'?cc.p(100, 100):pos
    	var enemy = this.getTypeNodeFromPool(this.enemyPool)
    	enemy.parent = layer
        enemy.position = _pos
    	return enemy
    },
    /**
     * 产生子弹(parentNode, layer)
     */
    createBullet(parentNode, layer){
        var bullet = EnemyFactory.getTypeNodeFromPool(this.bulletPool)
        bullet.active=false
    	bullet.parent = parentNode.parent
        bullet.scaleX=1
        bullet.scaleY=1
    	bullet.setPosition(0, 0)
        AnimationMediator.fireOnce(bullet, 500, MathVec.transformAngleToRad(-parentNode.rotation), 0.2, this.that)
        cc.log(parentNode.rotation)
        return bullet
    },
    /**
     * 产生自动索敌子弹(parentNode, layer, vector)
     */
    createBulletToEnemy(parentNode, layer, vector){
    	var bullet = this.getTypeNodeFromPool(this.bulletPool)
    	bullet.parent = layer
    	bullet.setPosition(parentNode)
        AnimationMediator.fireToTargetOnce(bullet, 0.1, AnimationMediator.getNearestTarget(parentNode, vector), this.that)
        return bullet
    },
    /**
     * 从对象池获取类型
     */
    getTypeNodeFromPool(pool){
        if(pool.size()>0){
            return pool.get()
        }else{
            EnemyFactory.fillPool()
            return pool.get()
        }
    },
    /**
     * 获取随机精灵
     */
    getRandSpriteFrame(){
        return MathVec.getRandElem(EnemyFactory.enemySpriteList)
    },
    /**
     * 自动产生enemy(enemyVector, layer, num, pos)
     */
    createAmaryInVectorAuto(enemyVector, layer, num, pos){
        if(enemyVector.length<num){
            enemyVector.push(EnemyFactory.createAmary(layer, pos))          
        }
    }
}

module.exports = EnemyFactory
