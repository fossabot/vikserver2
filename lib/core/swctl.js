"use-strict";
class Swctl{
    constructor(a){
        this.in=a;
        navigator.serviceWorker.register(a.sw, {scope: a.scope}).then(b=>{
            this.sw=b;
        });
    }
    setSync(a){
        return navigator.serviceWorker.ready.then(b=>{
            return b.sync.register(a||"test");
        });
    }
}
window.Swctl=Swctl;
