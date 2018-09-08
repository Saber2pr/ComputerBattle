var SceneMediator = {
    activeScene:null,
    
    initActiveScene(scene){
        cc.director.loadScene(scene)
         cc.director.getScene()
        
    },

    backtoStartScene(){
        PlayScene.active = false
        cc.director.loadScene("StartScene")
    },
    gotoPlayScene(){
        PlayScene.active = true
        cc.director.loadScene("PlayScene")
    },
    backtoPlayScene(){
        cc.director.loadScene("PlayScene")
    },
    gotoOverScene(){
        cc.director.loadScene("OverScene")
    }
}

module.exports = SceneMediator
