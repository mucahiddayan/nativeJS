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
    
    __icons = {
        
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
    
    this.setImgSize = function(imgSize){
        __imgSize = imgSize;
    }
    
    this.setImgSrc = function(imgSrc){
        __imageSrc = imgSrc;
    }
    
    this.setIconHeight = function(iconHeight){
        __iconHeight = iconHeight;
    }
    
    this.setIconWidth = function(iconWidth){
        __iconWidth = iconWidth;
    }
    this.setStartPos = function(startPos){
        __iconStartPos = Object.assign(__iconStartPos,startPos);
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
                box += forecasts('forecast',forecast[day],"yahoo-"+forecast[day].code,forecast[day].text,['text','code']);                
            }
        }
        box += boxEnd();
        return box;
    }
    
    var astronomy = function(astronomy){
        var box = boxStart('astronomy');
        box += itemsBox("astronomy",astronomy);
        box+= boxEnd();
        return box;
    }
    
    var atmosphere = function(atmosphere){
        var box = boxStart('atmosphere');
        box += itemsBox("atmosphere",atmosphere);
        
        var text = `${atmosphere.humidity} ${atmosphere.pressure} ${atmosphere.rising} ${atmosphere.visibility}`;
        return text;
    }
    
    var forecasts = function(box,items,icon,iconTitle=icon,exc=[]){
        var itemBox = `<div class="${box}-item"><div class="${box} icon">${getIcon(icon,iconTitle)}</div>`;
        for(let item in items){
            console.log(exc,item,!exc.includes(item));
            if(!exc.includes(item)){
                itemBox += `<div class="${box}-${item} text">${items[item]}</div>`;
            }
        }
        itemBox += `</div>`;
        return itemBox;
    }
    
    var getIcon = function(code,title=code){
        return `<div title="${title}" class="weather-icon"><i class="wi wi-${code}"></i></div>`;
    }
    
    var boxStart = function(id){
        return `<div id="${id}-wrapper"><div id="${id}">`;
    }
    
    var boxEnd = function(){
        return '</div></div>';
    }
    
    var temp = function(temp){
        return temp+'°C';
    }
    
    var toDisplay = function(obj,values){
        for(let o in obj){
            if(obj.length >= __defaultDisplaySettings.length){console.warn('Flew over');return;}
            var text;
            // console.log(o);
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
                case 'temp':
                text = temp(values[o]);
                break;
                default:
                text = '';
                break;
            }
            if(document.querySelector(obj[o])){
                document.querySelector(obj[o]).innerHTML = text;
                // console.log(document.querySelector(obj[o]));
            }                      
        }
    }
}