/**
* author Mücahid Dayan <mucahid@dayan.one>
* date 29.08.2017 Berlin
*/
class SearchQuery{
    objectToQuery(obj,strict = false){
        var encode = strict?encodeURIComponent:encodeURI;
        if(typeof obj !== 'object')return;
        var query = '';
        var c =0;
        var entries = Object.entries(obj);
        for(let o of entries){
            if(c === 0){
                query += '?';    
            }
            if(Array.isArray(o[1])){
                for(let [i,v] of o[1].entries()){
                    query += `${encode(o[0])}=${encode(v)}`;
                    query += i<o[1].length-1?'&':'';
                }
            }else{
                query += `${encode(o[0])}=${encode(o[1])}`;
            }            
            if(c < entries.length-1 ){
                query += '&';
            }
            c++;        
        }
        return query;
    }

    getSearchString(){
        let wlh = window.location.href,
            search= '';
        if(/#/.test(wlh)){
            search = wlh.substring(wlh.indexOf('#')+1);
        }
        if(/\?/.test(wlh)){
            search = wlh.substring(wlh.indexOf('?')+1);
        }
        return search;
    }
    
    queryToObject(query){
        var obj = {};
        if(!query.length){
            return obj;
        }
        var temp = query.split('&').sort(),
        obj = this.arrayToObject(this.decodeURIRecursiv(this.arraySplitter(temp,'=')));    
        return obj;
    }
    
    arraySplitter(arr,splitter=''){
        var result = [];
        for(let i of arr){
            result.push(i.split(splitter));
        }
        return result;
    }

    decodeURIRecursiv(arr){
        var newArr = [];
        if(Array.isArray(arr)){
            for(let [i,v] of arr.entries()){
                newArr[i] = [];
                newArr[i][0] = decodeURIComponent(v[0]);
                newArr[i][1] = decodeURIComponent(v[1]);
            }
        }else{
            newArr = decodeURIComponent(arr);
        }
        return newArr;
    }
    
    arrayToObject(arr,strict=true){
        var obj = {},
        keyArr = [],
        valArr = [],
        c=0;
        
        arr = arr.sort();
        
        for(let i of arr){
            // 0 : key , 1 : value
            if(!keyArr.includes(i[0])){
                if(c>0){valArr = [];c=0;}
                c++;               
                keyArr.push(i[0]);
            }
            if(strict){
                if(!valArr.includes(i[1])){
                    valArr.push(i[1]);
                } 
            }else{
                valArr.push(i[1]);
            }
            obj[i[0]] = valArr.length>1?valArr:valArr[0];
        }
        return obj;
    }
    
    
    get(){
        var query = this.getSearchString();
        return this.queryToObject(query);
    }
    
    set(obj){
        if(typeof obj !== 'object'){return;}
        var currentQuery = this.get(); 
        var newQueryObject = Object.assign(currentQuery,obj);
        var newQuery = this.objectToQuery(newQueryObject);
        
        if(history.pushState){
            history.pushState(newQueryObject,'',newQuery);
        }    
    }
    
    delete(){
        if(history.pushState){
            var uri = window.location.toString();
            window.history.replaceState({},'',uri.substring(0, uri.indexOf("?")));
        }  
    }
}