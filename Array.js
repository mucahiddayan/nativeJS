Array.prototype.uniqMerge = function(...arrs){
    var temp = [].concat(this,...arrs),
        arr = [];
        console.log(temp);
    temp.forEach(e=>{        
        if(arr.indexOf(e) == -1){
            arr.push(e);
        }
    });
    return arr;
}