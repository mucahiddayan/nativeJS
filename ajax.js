// import {SearchQuery} from 'searchQuery.js';

class AJAX {
    
    constructor(){
        this.xhttp = new XMLHttpRequest();
        
        let _headers = {
            'Content-Type' : 'application/json'
        };
        this.requestBody = {
            async   : true,
            headers : _headers
        };

        this.response;
        this.searchQuery = new SearchQuery;
    }

    /**
     * 
     * @param {...} args
     * @param - first parameter is either URL String or Request Body Object
     *        - if second parameter exists, it is Request Body Object and first object
     *          must be URL String
     * @param {Object} requestBody - mostly second param
     *        - requestBody can have following properties:
     *          - url: string
     *          - headers: Object
     *          - async: boolean
     *          - data: Object ... will be expanded
     */
    post(...args){
        let url,requestBody = {},headers;        
        if(args.length && typeof args[0] == 'string'){
            url = args[0];
            if(args.length > 1){
                requestBody = args[1];
            }            
        }else if(args.length && typeof args[0] == 'object'){
            requestBody = args[0];
            url = settings.url;
        }

        headers = Object.assign(this.requestBody.headers,requestBody.headers);
        requestBody = Object.assign(this.requestBody,requestBody);

        console.log(headers,requestBody);

        this.xhttp.open('POST',url,requestBody.async);
        if(requestBody.data){
            this.xhttp.send(JSON.stringify(requestBody.data));
            console.log(JSON.stringify(requestBody.data));
        }
        this.setHeaders(headers);
        return this;
    }

    /**
     * 
     * @param {...} args
     * @param - first parameter is either URL String or Request Body Object
     *        - if second parameter exists, it is Request Body Object and first object
     *          must be URL String
     * @param {Object} params - mostly second param
     *        - requestBody can have following properties:
     *          - url: string
     *          - headers: Object
     *          - async: boolean
     *          - data: Object ... will be expanded
     */
    get(...args){
        let url,requestBody = {},headers;        
        if(args.length && typeof args[0] == 'string'){
            url = args[0];
            if(args.length > 1){
                requestBody = args[1];
            }            
        }else if(args.length && typeof args[0] == 'object'){
            requestBody = args[0];
            url = settings.url;
        }

        headers = Object.assign(this.requestBody.headers,requestBody.headers);
        requestBody = Object.assign(this.requestBody,requestBody);

        console.log(headers,requestBody);

        this.xhttp.open('GET',url,requestBody.async);
        if(requestBody.data){
            this.xhttp.send(this.searchQuery.objectToQuery(requestBody.data,false,true));
            console.log(this.searchQuery.objectToQuery(requestBody.data,false,true));
        }
        this.setHeaders(headers);
        return this;
    }

    /**
     * 
     * @param {Object} headers 
     */
    setHeaders(headers){
        for(let header in headers){
            this.xhttp.setRequestHeader(header,headers[header]);
            console.log(header,headers[header]);
        }
    }

    /**
     * 
     * @param {...} callbacks
     * @param - first callback fired allways
     *        - second callback fired if success
     *        - third callback fired if fail 
     */
    done(...callbacks){
        this.xhttp.onload = _ => {
            callbacks[0](this.response);           
        }
    }

    fail(...callbacks){
        this.xhttp.onerror = _ => {
            callbacks[0](this.response);           
        }
    }
}