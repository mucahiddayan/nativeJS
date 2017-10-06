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
    __imagePositions = {
        rain : [5,3],//'-75px -310px',
        showers:[3,3],//'-250px -310px',
        partlyCloudy:[5,2], //'-75px -390px',
        mostlyCloudy:[5,2],//'-75px -390px',
        mostlySunny:[4,5],//'-157px -127px',
        scatteredShowers:[2,4],// '-350px -220px',
        sunny : [5,5],// '-67px -127px',
        thunderstorms : [2,1],// '-350px -475px'
        
    },
    __imageSrc = 'images/weathericons.svg',
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
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __defaultDisplaySettings;
        console.log(getUrl());
        if(sendQuery()){
            sendQuery().then(res=>{
                if(res.query.results == null){console.warn(`No results for "${__city}"`);return;}
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
        try{
            var temp = json.query.results.channel;
        }catch(e){
            console.warn(e);
            return;
        }
        return {
            astronomy   : temp.astronomy,
            atmosphere  : temp.atmosphere,
            temp        : fahrenheitToCelcius(temp.item.condition.temp),
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
    var forecast = function(forecast){
        var box = boxStart('forecast');
        for(var day in forecast){
            if(day <= __forecastLimit){
                box += `<div class="forecast-item">
                ${getImage(forecast[day].text)}           
                <div class="forecast-day">${forecast[day].day}</div>
                <div class="forecast-date">${forecast[day].date}</div>
                <div class="forecast-high">${forecast[day].high}</div>
                <div class="forecast-low">${forecast[day].low}</div>
                </div>`;
            }
        }
        box += boxEnd();
        return box;
    }
    
    var astronomy = function(astronomy){
        var box = boxStart('astronomy');
        box+= `<div class="sunrise">
        ${getImage('sunrise')}
        <div id="text">${astronomy.sunrise}</div>
        </div>
        <div class="sunset">
        <div id="img">${getImage('sunset')}</div>
        <div id="text">${astronomy.sunset}</div>
        </div>`;
        box+= boxEnd();
        return box;
    }
    
    var atmosphere = function(){

    }

    var getImage = function(id){
        var pos = __imagePositions[id.toCamelCase()];
        if(typeof pos == 'undefined'){
            console.warn(`There is no image for ${id.toCamelCase()}`);
            pos = [4,1];
        }
        
        return `<div title="${id}" class="weather-icon" style="background:url('${__imageSrc}') ${getImgPosition(pos)};width:80px;height:80px;"></div>`;
    }

    var getImgPosition = function(pos){
        var start = {x:160,y:135}
        return `${(pos[0]-1)*95+start.x}px ${(pos[1]-1)*87+start.y}px`;
    }
    
    var boxStart = function(id){
        return `<div id="${id}-wrapper"><div id="${id}">`;
    }
    
    var boxEnd = function(){
        return '</div></div>';
    }
    
    var toDisplay = function(obj,values){
        for(let o in __defaultDisplaySettings){
            var text;
            switch(o){
                case 'forecast':
                text = forecast(values[o]);
                break;
                case 'atmosphere':
                text = atmosphere(values[o]);
                break;
                case 'astronomy':
                text = astronomy(values[o]);
                break;
                default:
                text = '';
                break;
            }
            if(document.querySelector(obj[o]))document.querySelector(obj[o]).innerHTML = text;                      
        }
    }
}