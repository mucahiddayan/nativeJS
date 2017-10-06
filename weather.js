class Weather{
    
    constructor(){
        this.results = [];
        this.result;
        this.apiUrl =  `https://query.yahooapis.com/v1/public/yql?q=`;
        this.city;
        this.countryCode;
        this.locationSet = false;
    }
    
    getUrl(){
        let query   = `select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="${this.city},${this.countryCode}")`;            
        query   = encodeURIComponent(query);
        let url     = this.apiUrl + query + `&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`;
        return url;
    }

    sendQuery(){
        if(!this.locationSet){console.warn('You have to set the location first');return;} // if location is not set yet, user will be warnt
        fetch(this.getUrl()).then(res=>{
            try{
                return res.json();
            }catch(e){
                console.warn(e);
            }
        }).then(res=>{
            this.results.push(res);
            this.result = res;
            console.log(res);
        }).catch(e=>console.warn(e));
    }
    
    setLocation(city='Berlin',countryCode='de'){
        this.city = city;
        this.countryCode = countryCode;
        this.locationSet = true;
        return this;     
    }

    getWeather(){
        if(!this.locationSet){console.warn('You have to set the location first');return;} // if location is not set yet, user will be warnt
        this.sendQuery();
        return `High: ${this.fahrenheitToCelcius(this.result.query.results.channel.item.forecast[0].high)}°C 
        Low: ${this.fahrenheitToCelcius(this.result.query.results.channel.item.forecast[0].low)}°C
                 ${this.result.query.results.channel.item.condition.text}`;
    }
    
    getResult(){
        return this.result;
    }
    
   
    fahrenheitToCelcius(f){
        return (f-32) * 5/9;
    }
}