/**
* author Mücahid Dayan
*/
class Trigger{
    fire(element,event){
        if ("createEvent" in document){
            /* var evt = document.createEvent("HTMLEvents");
            evt.initEvent(event, false, true); */
            var evt = new Event(event);
            element.dispatchEvent(evt);
        }else{
            element.fireEvent(`on${event}`); 
        }
    }
}