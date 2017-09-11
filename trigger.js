/**
* author Mücahid Dayan
*/
class Trigger{
    run(element,event,onevent){
        if ("createEvent" in document){
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent(event, false, true);
            e.dispatchEvent(evt);
        }else{
            e.fireEvent(onevent); 
        }
    }
}