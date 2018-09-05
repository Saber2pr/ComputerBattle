var AnimationMediator = require("AnimationMediator")
var BulletPrefab = require("BulletPrefab")
var GlobalData = require("GlobalData")

var EnemyFactory = {
	enemySpriteList:null,
	enemyType:null,
	enemyPool:null,
	bulletType:null,
	bulletPool:null,

	initSource(spriteList, enemyType, bulletType){
		this.enemySpriteList = spriteList
		this.enemyType = enemyType
		this.enemyPool = new cc.NodePool()
		this.bulletType = bulletType,
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
		//enemy.getComponent(cc.Sprite) = this.enemySpriteList[parseInt((this.enemySpriteList.length-1)*cc.random0To1())]
		cc.log("num:"+parseInt((this.enemySpriteList.length-1)*cc.random0To1()))
		return enemy
	},

	createBullets(parentNode, that){
        var bulletPrefab = new BulletPrefab(this.bulletType)
        cc.log("root"+bulletPrefab)
		var bullet = this.getTypeNodeFromPool(this.bulletType, this.bulletPool)
		cc.log("createBullet"+bullet)
        AnimationMediator.fireOnce(bullet, 1, that)
		bullet.parent = parentNode
        bullet.setPosition(0, 0)
		return bullet
	},

	getTypeNodeFromPool(typeNode, pool){
//		return pool.size()>0?pool.get():cc.instantiate(typeNode)
	    return cc.instantiate(typeNode)
    }
}

module.exports = EnemyFactory
