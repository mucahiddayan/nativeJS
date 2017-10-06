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
    images = {
        rain : '',
        showers:'',
        partlyCloudy: '',
        mostlyCloudy:'',
        scatteredShowers: '',

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
    
    var fahrenheitToCelcius = function(f){
        return (f-32) * 5/9;
    }
    
    //****************PUBLIC FUNCTIONS****************//    
    this.setLocation = function(){
        var city = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Berlin';
        var countryCode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'de';
        __city = city;
        __countryCode = countryCode;
        __isLocationSet = true;
        
        return this;     
    }
    
    this.setForecastLimit = function(limit){
        __forecastLimit = limit;
    }
    
    this.display = function(options){
        var options = arguments.length > 0 && arguments[0] !== undefined ? Object.assign(__defaultDisplaySettings,arguments[0]) : __defaultDisplaySettings;
        console.log(getUrl());
        if(sendQuery()){
            sendQuery().then(res=>{
                var values = extractWeatherInformations(res);
                console.log(values);               
                toDisplay(options,values);
            });
        }
    }

    this.getQuery = function(){
        sendQuery().then(e=>console.log(e));
    }

    var extractWeatherInformations = function(json){
        var temp = json.query.results.channel;
        return {
            astronomy   : temp.astronomy,
            atmosphere  : temp.atmosphere,
            temp        : fahrenheitToCelcius(temp.item.condition.temp),
            forecast    : temp.item.forecast,
            wind        : temp.wind
        };
    }

    var forecast = function(forecast){
        var box  = '<div id="forecast-wrapper"><div id="forecast">';
            for(var day in forecast){
               if(day <= __forecastLimit){
                   box += `<div class="forecast-item">
                                <div class="forecast-img">${forecast[day].text}</div>             
                                <div class="forecast-day">${forecast[day].day}</div>
                                <div class="forecast-date">${forecast[day].date}</div>
                                <div class="forecast-high">${forecast[day].high}</div>
                                <div class="forecast-low">${forecast[day].low}</div>
                           </div>`;
               }
            }
            box += "</div></div>"; // forecast-and wrapper end
    }

    var astronomy = function(){
        
    }

    var toDisplay = function(obj,values){
        var iterate = function(ob){
            var t = '';
            for(let o in ob){
                t += `${ob[o]}`;
            }
            t+='</br>';
            return t;
        }

        for(let o in __defaultDisplaySettings){
            var text = `${o} : `;          
            if(typeof values[o] == 'object' && !Array.isArray(values[o])){                
                text += iterate(values[o]);
            }else if(Array.isArray(values[o])){
                for(i in values[o]){
                    text += iterate(values[o][i]);
                }
            }else{
                text += values[o];
            }
            document.querySelector(obj[o]).innerHTML = text;                      
        }
    }
}