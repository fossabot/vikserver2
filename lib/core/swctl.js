"use-strict";
class Swctl{
    constructor(a){
        this.in=a;
        navigator.serviceWorker.register(a.sw, {scope: a.scope}).then(b=>{
            this.sw=b;
        });
    }
    setSync(a){
        navigator.serviceWorker.ready.then(b=>{
            b.sync.register(a||"test");
        });
    }
}
window.Swctl=Swctl;
