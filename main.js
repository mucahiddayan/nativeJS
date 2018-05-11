/**
 * 
 * 
 */

 document.addEventListener('DOMContentLoaded',()=>{
     let test1 = document.getElementById('test1').splitIntoLabels();
     test1.changePlaceholder('Hinzufügen');
    console.log( test1);
     test1.addCallbackToCloseButtons((e) => console.log(e+' clicked'));

     let test2 = document.getElementById('test2').splitIntoLabels();
     test2.changePlaceholder('Hinzufügen');
    console.log( test2);
     test2.addCallbackToCloseButtons((e) => console.log(e+' 2 clicked'));
 });