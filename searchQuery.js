/**
* author Mücahid Dayan <mucahid@dayan.one>
* date 29.08.2017 Berlin
*/
class SearchQuery{
    
    /**
    * returns a query
    * @param {Object} obj 
    * @param {boolean} strict 
    * @returns {string}
    */
    objectToQuery(obj,strict = false){
        var encode = strict?encodeURIComponent:encodeURI;
        if(typeof obj !== 'object')return;
        var query = '';
        var c =0;
        var entries = Object.entries(obj);
        
        var queryItem = function(k,v){
            let query = '';
            query += encode(k);
            query += typeof v !== 'undefined' && v !== null && v.length ? `=${encode(v)}` : '';
            return query;
        }
        for(let o of entries){
            if(c === 0){
                query += '?';    
            }
            if(Array.isArray(o[1])){
                for(let [i,v] of o[1].entries()){
                    query += queryItem(o[0],v);/* `${encode(o[0])}=${encode(v)}` */;
                    query += i<o[1].length-1?'&':'';
                }
            }else{
                query += queryItem(o[0],o[1]);/* `${encode(o[0])}=${encode(o[1])}` */;
            }            
            if(c < entries.length-1 ){
                query += '&';
            }
            c++;        
        }
        return query;
    }
    
    
    
    
    /**
    * returns search string from URL
    * @returns {string}
    */
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
    
    
    /**
    * Returns an Object from given query
    * @param {string} query
    * @returns {Object}
    */
    queryToObject(query){
        var obj = {};
        /*if query empty returns an empty object*/
        if(!query.length){
            return obj;
        }
        var temp = query.split('&').sort(),
        obj = this.twoDimArrToObj(this.decodeURIRecursiv(this.arraySplitter(temp,'=')));    
        return obj;
    }
    
    
    /**
    * returns an array of splitted values of given array
    * @param {Array} arr 
    * @param {string} splitter 
    * @returns {Array}
    */
    arraySplitter(arr,splitter=''){
        var result = [];
        for(let i of arr){
            result.push(i.split(splitter));
        }
        return result;
    }
    
    
    /**
    * returns an array with decoded values
    * @param {Array} arr 
    * @returns {Array}
    */
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
    
    
    /**
    * returns an Object from given two dimensional array
    * arr[i][0] : keys of object  **i** : from For-Loop
    * arr[i][1] : value of object
    * @param {Array[][]} arr 
    * @param {booelan} strict 
    * @returns {Object}
    */
    twoDimArrToObj(arr,strict=true){
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
                    if( i[1] === 'undefined'){
                        valArr.push(null);
                    }else{
                        valArr.push(i[1]);
                    }
                    
                } 
            }else{
                if( i[1] === 'undefined'){
                    valArr.push(null);
                }else{
                    valArr.push(i[1]);
                }
            }
            obj[i[0]] = valArr.length>1?valArr:valArr[0];
        }
        return obj;
    }
    
    /**
    * returns an merged object
    * @param {parameters} mix 
    */
    mixedAssign(...mix){
        var obj = {};	
        for(let [i,v] of mix.entries()){
            console.log(v)
            if(typeof v == 'object' && !Array.isArray(v)){
                
                for( let a in v){
                    obj[a] = v[a];
                }
            }
            if(Array.isArray(v)){
                var temp = this.arrayToObj(v);
                for( let a in temp){
                    obj[a] = temp[a];
                }
            }
            if(typeof v == 'string'){
                obj[v] = '';
            }
        }
        return obj;
    }
    
    
    /**
    * returns an object from given array
    * sets value of object to empty string ''
    * @param {Array[]} arr 
    */
    arrayToObj(arr){
        var obj = {};
        for(let i of arr){
            obj[i] = '';
        }
        return obj;
    }
    
    
    /**
    * returns a search string as an object
    * @returns {Object} 
    *                  asO : as object
    *                  asS : as string
    */
    get(){
        var query = this.getSearchString();
        return this.queryToObject(query);
    }
    
    
    /**
    * sets a parameters to search string of URL
    * @param {Object} obj
    * @returns {void} 
    */
    set(...ob){
        // if(typeof obj !== 'object'){return;}
        var obj = this.mixedAssign(...ob);
        var currentQuery = this.get(); 
        var newQueryObject = Object.assign(currentQuery,obj);
        var newQuery = this.objectToQuery(newQueryObject);
        
        if(history.pushState){
            history.pushState(newQueryObject,'',newQuery);
        }    
    }
    
    /**
    * deletes an etry with given key     * 
    * @param {string} key
    * @returns {Object} new query object    
    */
    delete(key){
        var currentQuery = this.get();
        if(Array.isArray(key)){
            for(let o of key){
                delete currentQuery[o];
            }
        }else{
            delete currentQuery[key];
        }
        this.deleteAll();
        this.set(currentQuery);
        return currentQuery;
    }
    
    /**
    * deletes all search params from URL
    * @returns {void}
    */
    deleteAll(){
        if(history.pushState){
            var uri = window.location.toString();
            window.history.replaceState({},'',uri.substring(0, uri.indexOf("?")));
        }  
    }
    
}