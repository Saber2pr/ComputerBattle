/**
 * > 2018年9月2日15:32:33
 * * 分段管理进度条
 * ```js 
   //在外部这样定义回调函数
    addBarSch:function(){
        BarManager.addBarSch(this.bar, this)
    },
    reduceBarSch:function(){
        BarManager.reduceBarSch(this.bar, this)
    },
   ```  
 * #### By AK-12 @[qq:1029985799@qq.com, gmail:saber2pr@gmail.com]
 */
var BarManager = {
    add:null,
    reduce:null,
    reduceSpeed:0.03,
    pro1:{
        value:0.3,
        color:cc.Color.GREEN,
        speed:0.01
    },
    pro2:{
        value:0.7,
        color:cc.Color.YELLOW,
        speed:0.003
    },
    pro3:{
        value:0.990,
        color:cc.Color.BLUE,
        speed:0.001
    },
    pro4:{
        color:cc.Color.BLACK
    },
    testPro(bar, pro){
        return bar.progress<pro.value
    },
    colorBar(bar){
        this.testPro(bar,this.pro1)?bar.barSprite.node.color=this.pro1.color:
        this.testPro(bar,this.pro2)?bar.barSprite.node.color=this.pro2.color:
        this.testPro(bar,this.pro3)?bar.barSprite.node.color=this.pro3.color:
        bar.barSprite.node.color=this.pro4.color
    },
    addPower(bar){
        this.testPro(bar,this.pro1)?bar.progress+=this.pro1.speed:
        this.testPro(bar,this.pro2)?bar.progress+=this.pro2.speed:
        this.testPro(bar,this.pro3)?bar.progress+=this.pro3.speed:
        bar.progress=1
        this.colorBar(bar)
    },
    reducePower(bar){
        bar.progress>0.1?bar.progress-=this.reduceSpeed:bar.progress=0
        this.colorBar(bar)
    },
    //schedule的回调函数必须有标识(不可以匿名)，否则无法unschedule
    addBarSch(bar, node){
        node.unschedule(this.reduce)
        node.schedule(this.add=function(){
            BarManager.addPower(bar)
        }, 0.01)
    },
    reduceBarSch(bar, node){
        node.unschedule(this.add)
        node.schedule(this.reduce=function(){
            BarManager.reducePower(bar)
        }, 0.01)
    }
}

module.exports = BarManager
