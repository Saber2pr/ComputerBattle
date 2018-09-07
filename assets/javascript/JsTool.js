window.JsTool = {
     obj2string (o) { 
        var r=[]; 
        if(typeof o=="string"){ 
            return "\""+o.replace(/([\'\"\\])/g,"\\$1").replace(/(\n)/g,"\\n").replace(/(\r)/g,"\\r").replace(/(\t)/g,"\\t")+"\""; 
        } 
        if(typeof(o)==="object"){ 
            if(!o.sort){ 
                for(var i in o){ 
                r.push(i+":"+this.obj2string(o[i])); 
                } 
                if(!!document.all&&!/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)){ 
                    r.push("toString:"+o.toString.toString()); 
                } 
                r="{"+r.join()+"}"; 
            }else{ 
                for(var i=0;i<o.length;i++){ 
                r.push(obj2string(o[i])) 
                } 
                r="["+r.join()+"]"; 
            } 
            return r; 
        } 
        return o.toString(); 
    },
    writeObj(obj){ 
        var description = ""; 
        for(var i in obj){ 
            var property=obj[i]; 
            description+=i+" = "+property+"\n"; 
        } 
        console.log(description) 
    } 
}
