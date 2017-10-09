var Weather = function(){
    /**
    * __@var - private variable prefix
    * 
    */
    var
    __this = this,    
    __apiUrl = `https://query.yahooapis.com/v1/public/yql?q=`,
    
    __isLocationSet = false,
    __city,
    __countryCode,
    __defaultDisplaySettings = {
        atmosphere  : '#atmosphere',
        astronomy   : '#astronomy',
        temp        : '#temp',
        forecast    : '#forecast',
        wind        : '#wind',      
    },

    __runs = {
        atmosphere  : __atmosphere,
        astronomy   : __astronomy,
        temp        : __temp,
        forecast    : __forecasts,
        wind        : __wind,      
    },
       
    __forecastLimit = 10,
    __results = [],
    __result;
    
    var getUrl = function(){
        let query   = `select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="${__city},${__countryCode}")`;            
        query   = encodeURIComponent(query);
        let url     = __apiUrl + query + `&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`;
        return url;
    }
    
    var sendQuery = function(callback){
        if(!__isLocationSet){console.warn('You have to set the location first');return false;} // if location is not set yet, user will be warnt
        return fetch(getUrl()).then(res=>{
            try{
                return res.json();
            }catch(e){
                console.warn(e);
            }
        });
    }    
    
    var fahrenheitToCelcius = function(f,round=1){
        return ((f-32) * 5/9).toFixed(round);
    }
    
    //****************PUBLIC FUNCTIONS****************//    
    this.setLocation = function(city= 'Berlin',countryCode = 'de'){
        __city = city;
        __countryCode = countryCode;
        __isLocationSet = true;
        
        return this;     
    }
          
    this.setApiUrl = function(url){
        __apiUrl = url;
    }
    
    this.setForecastLimit = function(limit){
        __forecastLimit = limit;
    }
    
    this.display = function(options = __defaultDisplaySettings){        
        console.log(getUrl());
        console.log(options);
        if(sendQuery()){
            sendQuery().then(res=>{
                if(res.query.results == null){console.warn(`No results for "${__city}"`);return;}
                var values = extractWeatherInformations(res);
                console.log(values);
                console.log(res);               
                __display(options,values);
            });
        }
    }
    
    this.getQuery = function(){
        sendQuery().then(e=>console.log(e));
    }
    
    var extractWeatherInformations = function(json){
        try{
            var temp = json.query.results.channel;
        }catch(e){
            console.warn(e);
            return;
        }
        return {
            astronomy   : temp.astronomy,
            atmosphere  : temp.atmosphere,
            temp        : {value:temp.item.condition.temp,code:temp.item.condition.code,text:temp.item.condition.text},
            forecast    : temp.item.forecast,
            wind        : temp.wind
        };
    }
    
    String.prototype.toCamelCase = function(){
        return /\s/.test(this)?this.split(' ').reduce((f,s)=>f[0].toLowerCase()+f.substr(1,f.length-1)+s[0].toUpperCase()+s.substr(1,s.length-1)):this.toLowerCase();
    }
    
    /**
    * 
    * @param {object<forecast>[]} forecast 
    */
    var __forecasts = function(forecasts){
        var box = boxStart('forecast');
        for(var forecast in forecasts){
            if(forecast <= __forecastLimit){
                box += __forecast(forecasts[forecast]);        
            }
        }
        box += boxEnd();
        return box;
    }

    var __forecast = function(forecast){
        var box = `<div class="forecast-item">
                    <h2 title="${forecast.date}">${forecast.day}</h2>
                    <div id="forecast-icon">${getIcon(`yahoo-${forecast.code}`,forecast.text)}</div>
                    <div id="forecast-heigh" title="High">${fahrenheitToCelcius(forecast.high)}°C</div>
                    <div id="forecast-low" title="Low">${fahrenheitToCelcius(forecast.low)}°C</div>
                   </div>`;
        return box;
    }

    var __atmosphere = function(atmosphere){
        console.log(atmosphere);
    }

    var __astronomy = function(astronomy){
        console.log(astronomy);
    }

    var __temp = function(temp){
        console.log(temp);
    }

    var __wind = function(wind){
        console.log(wind);
    }
    
    /**
     * 
     * @param {string} code 
     * @param {string} title 
     * wi wi-wind from-DIRECTION-deg
     * wi wi-yahoo-CODE
     * wi wi-NAME
     */
    var getIcon = function(code,title=code){
        return `<div title="${title}" class="weather-icon"><i class="wi wi-${code}"></i></div>`;
    }
    
    var boxStart = function(id){
        return `<div id="${id}-wrapper"><div id="${id}">`;
    }
    
    var boxEnd = function(){
        return '</div></div>';
    }    
    

    /**
     * 
     * @param {Object} displays - name : CSS Selector - where the value has to be displayed on 
     * @param {Object} values   - name : values - values to be displayed 
     */
    var __display = function(displays,values){
        for(let o in displays){
            if(displays.length >= __defaultDisplaySettings.length){console.warn('Flew over');return;}
            var text = '';
            switch(o){
                case 'forecast':
                text = __forecasts(values[o]);
            }
            // text = __runs[o](values[o]);
            if(document.querySelector(displays[o])){
                document.querySelector(displays[o]).innerHTML = text;
                // console.log(document.querySelector(displays[o]));
            }                      
        }
    }
}