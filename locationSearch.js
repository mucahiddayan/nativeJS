export class SearchQuery{
    objectToQuery(obj){
        if(typeof obj !== 'object')return;
        var query = '';
        var c =0;
        var entries = Object.entries(obj);
        for(let o of entries){
            if(c === 0){
                query += '?';    
            }
            query += `${encodeURIComponent(o[0])}=${encodeURIComponent(o[1])}`;
            if(c < entries.length-1 ){
                query += '&';
            }
            c++;        
        }
        return query;
    }
    
    queryToObject(query){
        var obj = {};
        if(query === ''){
            return obj;
        }
        var temp = query.replace('?','').split('&');
        for(let i of temp){
            var atom = i.split('=');
            obj[atom[0]] = typeof atom[1] === 'undefined'?'':atom[1];
        }
        return obj;
    }
    
    get(){
        var query = location.search;
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