/**
 * 
 * 
 */

 document.addEventListener('DOMContentLoaded',()=>{
     let useremail = document.getElementById('useremail').splitIntoLabels();
     useremail.changePlaceholder('Hinzufügen');
    console.log( useremail);
     useremail.addCallbackToCloseButtons((e) => console.log(e+' clicked'));
     /* useremail.addCallbackToInputEnter((e) => {
         document.body.insertAdjacentHTML('afterbegin','<div>'+e+'</div>')
     }); */

     let username = document.getElementById('username').splitIntoLabels();
     username.changePlaceholder('PLZ');
     username.changeTitle('PLZ Format:12345!');
    console.log( username);
     username.addCallbackToCloseButtons((e) => console.log(e+' 2 clicked'));
     username.changePattern('\\d{5}');
 });