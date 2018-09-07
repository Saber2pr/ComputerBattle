var AnimationMediator = require("AnimationMediator")
var GlobalData = require("GlobalData")
var MathVec = require("MathVec")

var EnemyFactory = {
    enemySpriteList:null,
    enemyType:null,
    enemyPool:null,
    bulletType:null,
    bulletPool:null,
    bulletStringList:['var', 'let', 'const', 'function', 'return'],
    that:null,
    
    initSource(enemyType, bulletType, that, spriteList){
        this.that = that
    	this.enemySpriteList = spriteList
    	this.enemyType = enemyType
        this.bulletType = bulletType
    	this.enemyPool = new cc.NodePool()
    	this.bulletPool = new cc.NodePool()
    	for (let i=0, initCount=5; i < initCount; ++i){
    	    let enemy = cc.instantiate(enemyType)
    	    this.enemyPool.put(enemy)
    	    let bullet = cc.instantiate(bulletType)
    	    this.bulletPool.put(bullet)
    	}
    },

    //提取实例
    createAmary(parentNode){
    	var enemy = this.getTypeNodeFromPool(this.enemyType, this.enemyPool)
    	enemy.parent = parentNode
        enemy.getChildByName('spr').getComponent(cc.Sprite).spriteFrame = this.getRandSpriteFrame()
    	return enemy
    },
    
    createLabelBulletToEnemys(parentNode, vector){
    	var bullet = this.getTypeNodeFromPool(this.bulletType, this.bulletPool)
    	bullet.parent = parentNode.parent.parent
    	bullet.setPosition(cc.director.getScene().convertToWorldSpaceAR(MathVec.transformToParentWorld(parentNode)))
        bullet.color = AnimationMediator.randColor()
        bullet.getComponent(cc.Label).string = AnimationMediator.getRandString(EnemyFactory.bulletStringList)
        AnimationMediator.fireToTargetOnce(bullet, 0.5, AnimationMediator.getNearestTarget(parentNode, vector), this.that)
        return bullet
    },
    
    getTypeNodeFromPool(typeNode, pool){
        return pool.size()>0?pool.get():cc.instantiate(typeNode)
    },

    getRandSpriteFrame(){
        return this.enemySpriteList[parseInt((EnemyFactory.enemySpriteList.length)*cc.random0To1())]
    }
}

module.exports = EnemyFactory
