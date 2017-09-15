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
        for(let o of entries){
            if(c === 0){
                query += '?';    
            }
            if(Array.isArray(o[1])){
                for(let [i,v] of o[1].entries()){
                    query += `${encode(o[0])}`;
                    query += typeof v !== 'undefined' && v !== null && v.length ? `=${encode(v)}`:'';
                    query += i<o[1].length-1?'&':'';
                }
            }else{
                query += `${encode(o[0])}`;
                query += typeof o[1] !== 'undefined' && o[1] !== null && o[1].length ? `=${encode(o[1])}`:'';
            }            
            if(c < entries.length-1 ){
                query += '&';
            }
            c++;        
        }
        return query;
    }

    /**
     * returns a query from given array
     * @param {Array} arr 
     * @returns {string}
     */
    arrayToQuery(arr){
        if(!Array.isArray(arr)){
            return;
        }
        var query = '';

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
        if(!query.length){
            return obj;
        }
        var temp = query.split('&').sort(),
        obj = this.arrayToObject(this.decodeURIRecursiv(this.arraySplitter(temp,'=')));    
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
     * returns an Object from given array
     * @param {Array} arr 
     * @param {booelan} strict 
     * @returns {Object}
     */
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
    
    /**
     * returns a search string as an object
     * @returns {Object} 
     *                  asO : as object
     *                  asS : as string
     */
    get(){
        var query = this.getSearchString();
        return {
            asO:this.queryToObject(query),
            asS:query
        };
    }
    
    /**
     * sets a parameters to search string of URL
     * @param {Object} obj
     * @returns {void} 
     */
    set(...obj){
        // if(typeof obj !== 'object'){return;}
        if(Array.isArray(obj)){
            obj = this.arrayToObject(obj);
        }   
        var currentQuery = this.get().asO; 
        console.log(obj);
        var newQueryObject = Object.assign(currentQuery,obj);
        console.log(newQueryObject);
        var newQuery = this.objectToQuery(newQueryObject);
        console.log(newQuery);
        
        if(history.pushState){
            history.pushState(newQueryObject,'',newQuery);
        }    
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

    /**
     * returns an object from given array
     * keys of object = keys of array
     * values of object = null
     * @param {Array} arr 
     */
    arrayToObject(arr){
        var obj = {};
        for(let [i,v] of arr.entries()){
            obj[v] = '';
        }
        return obj;
    }
}