class Modules{
    constructor(modules){
        if(!Array.isArray(modules)){
            throw new Error("The modules var must be an array!");
        }
        this.v=this.load(modules);
        return { modules:modules };
    }
    load(modules){
        var p="";
        for (const key in modules) {
            let name=modules[key].name;
            let m=modules[key];
            if(!p){
                p=`"${name}":"${m}"`;
            }else{
                p=p+`,"${name}":"${m}"`;
            }
        }
        if(modules!==[]){
            return JSON.parse(`{${p}}`);
        }else{
            return {disabled:1};
        }
    }
}
module.exports={Modules};