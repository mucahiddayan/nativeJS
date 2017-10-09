let Apixu = function(API_KEY){
    if(typeof API_KEY == 'undefined'){
        throw new Error('Api Key is not set! \nex: var apixu = new Apixu(API_KEY)');
    }
    var
    // __apiURL = 'https://api.apixu.com/v1/current.json?',
    __apiURL = 'https://api.apixu.com/v1/forecast.json?',
    __apiKey = API_KEY,
    /* 'c6df1e406f204a32926120907170910' */

    __defaultDisplayOptions = {
        feelslike_c: '#feelslike_c',
        feelslike_f: '#feelslike_f',
        humidity: '#humidity',        
        precip_in: '#precip_in',
        precip_mm: '#precip_mm',
        pressure_in: '#pressure_in',
        pressure_mb: '#pressure_mb',
        temp_c: '#temp_c',
        temp_f: '#temp_f',
        vis_km: '#vis_km',
        vis_miles: '#vis_miles',
        wind_degree: '#wind_degree',
        wind_dir: '#wind_dir',
        wind_kph: '#wind_kph',
        wind_mph: '#wind_mph',
    },

    __URL,
    __isLocationSet = false,
    __intervalTime = 0,
    __interval,

    end; // variables end

    // <--------------------------------------- PUBLIC FUNCTIONS

    /**
     * set the Location
     * @param {string} location - Default: Berlin
     */
    this.setLocation = function(location = 'Berlin'){
        __URL = `${__apiURL}key=${__apiKey}&q=${location}`;
        __isLocationSet = true;
        return this;
    }

    /**
     * @param {number} time - in minutes 
     */
    this.updateIn = function(time){
        __intervalTime = time * 1000 * 60;
        return this;
    }

    this.display = function(options = __defaultDisplayOptions){
        var init = function(){
            sendQuery().then(res=>{
                if(res.error){
                    console.warn(res.error.message);return;
                }
                __display(res,options);
            }).catch(er=>console.warn(er));
        }
        try{
            if(__intervalTime > 0){
                init();
                __interval = setInterval(_=>init(),__intervalTime);
            }else{
                init();
            }
            
        }catch(e){
            console.warn(e.name,e.message);
        }

    }

    // PUBLIC FUNCTIONS END ----------------------------------->
    //##########################################################
    // <-------------------------------------- PRIVATE FUNCTIONS
    var LocationUnsetError = function(msg=''){
        this.message = msg;
        this.name = 'LocationUnsetError';
    }

    var OverageError = function(msg=''){
        this.message = msg;
        this.name = 'OverageError';
    }

    var __display = function(values,options){
        console.log(values,options);
        var text = `<img src="https:${values.current.condition.icon}"/>`;
        for(let o in options){
            if(options.length > values.length){
                throw new OverageError('There is more display object than values to display');
            }
            var value = values.current[o];
            text += `<div class="${o}-item item" title="${o}">
                        <div class="${o}-item-icon">${getIcon(o)}</div>
                        <div class="${o}-item-text">${value}</div>
                        </div>`;

            var displayElement = document.querySelector(options[o]);
            if(displayElement){
                displayElement.innerHTML = text;
            }
        }
    }

    var getIcon = function(code,title=code){
        return `<i class="wi wi-${code}" title="${title}"></i>`;
    }

    var sendQuery = function(){
        if(!__isLocationSet){
            throw new LocationUnsetError("Location has to be set to send request!");
        }
        return fetch(__URL).then(res=>{
            try{
                return res.json();
            }catch(e){
                console.warn(e);
            }
        });
    }

    // PRIVATE FUNCTIONS END ---------------------------------->
}