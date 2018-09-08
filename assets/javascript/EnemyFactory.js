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
    	for (let i=0, initCount=5; i < initCount; ++i){
    	    let enemy = cc.instantiate(enemyType)
            enemy.getChildByName('spr').getComponent(cc.Sprite).spriteFrame = EnemyFactory.getRandSpriteFrame()
    	    this.enemyPool.put(enemy)
    	    let bullet = cc.instantiate(bulletType)
            bullet.color = AnimationMediator.randColor()
    	    this.bulletPool.put(bullet)
    	}
    },
    /**
     * 在图层中产生怪物(layer, pos)
     */
    createAmary(layer, pos){
        let _pos = typeof(pos==='undefined')?cc.p(100, 100):pos
    	var enemy = this.getTypeNodeFromPool(this.enemyType, this.enemyPool)
    	enemy.parent = layer
        enemy.position = _pos
    	return enemy
    },
    /**
     * 产生子弹(parentNode, layer)
     */
    createBullet(parentNode, layer){
        var bullet = EnemyFactory.getTypeNodeFromPool(this.bulletType, this.bulletPool)
    	bullet.parent = layer
    	bullet.setPosition(layer.convertToNodeSpace(parentNode.position))
        AnimationMediator.fireOnce(bullet, 100, parentNode.rotation, 1, this.that)
        return bullet
    },
    /**
     * 产生自动索敌子弹(parentNode, layer, vector)
     */
    createBulletToEnemy(parentNode, layer, vector){
    	var bullet = this.getTypeNodeFromPool(this.bulletType, this.bulletPool)
    	bullet.parent = layer
    	bullet.setPosition(layer.convertToNodeSpace(parentNode.position))
        AnimationMediator.fireToTargetOnce(bullet, 0.1, AnimationMediator.getNearestTarget(parentNode, vector), this.that)
        return bullet
    },
    /**
     * 从对象池获取类型
     */
    getTypeNodeFromPool(typeNode, pool){
        return pool.size()>0?pool.get():cc.instantiate(typeNode)
    },
    /**
     * 获取随机精灵
     */
    getRandSpriteFrame(){
        return MathVec.getRandElem(EnemyFactory.enemySpriteList)
    },
    /**
     * 自动产生enemy(enemyVector, layer, pos)
     */
    createAmaryInVectorAuto(enemyVector, layer, pos){
        if(enemyVector.length<1){
            let enemy = EnemyFactory.createAmary(layer, pos)
            enemyVector.push(enemy)            
        }
    }
}

module.exports = EnemyFactory
