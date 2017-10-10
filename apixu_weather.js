let Apixu = function(API_KEY){
    if(typeof API_KEY == 'undefined'){
        throw new Error('Api Key is not set! \nex: var apixu = new Apixu(API_KEY)');
    }
    var
    // __apiURL = 'https://api.apixu.com/v1/current.json?',
    __apiURL = 'https://api.apixu.com/v1/forecast.json?',
    __apiKey = API_KEY,
    /* 'c6df1e406f204a32926120907170910' */
    
    __icons = {
        precipitation: 'raindrop',
        pressure: 'barometer',
        wind:'small-craft-advisory',        
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
    
    this.display = function(options = __icons){
        var init = function(){
            sendQuery().then(res=>{
                if(res.error){
                    console.warn(res.error.message);return;
                }
                __display(res);
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
    
    var __display = function(values){
        console.log(values);
        var displayElement = document.createElement('div');
        displayElement.id = 'forecast-display';
        
        var    
        value = values.current,    
        img = `<img src="https:${values.current.condition.icon}"/>`,
        box = `<div id="forecast-wrapper">
        <div id="forecast">
        <div id="icon">${img}</div>
        <div id="temp" data-f="${value.temp_f}" data-c="${value.temp_c}" title="Temperature ${__temp}">${value.temp_c}</div>
        <div id="feelslike" data-f="${value.feelslike_f}" data-c="${value.feelslike_c}" title="Feelslike">${value.feelslike_c}</div>
        <div id="precipitation-wrapper">
        <div id="precipitation-icon" title="Precipitation">${getIcon('raindrop')}</div>
        <div id="precipitation" data-in="${value.precip_in}" data-mm="${value.precip_mm}" title="${__precip}">${value.precip_mm}</div>
        </div>
        <div id="pressure-wrapper">
        <div id="pressure-icon" title="Pressure">${getIcon('barometer')}</div>
        <div id="pressure" data-in="${value.pressure_in}" data-mb="${value.pressure_mb}" title="Pressure ${__pressure}">${value.pressure_mb}</div>
        </div>
        <div id="vis" data-km="${value.vis_km}" data-miles="${value.vis_miles}">${value.vis_km}</div>
        <div id="wind-wrapper">
        <div id="wind-icon" title="Wind/${__wind}">${getIcon('wind from-'+value.wind_degree+'-deg',value.wind_dir)}</div>
        <div id="wind" data-kph="${value.wind_kph}" data-mph="${value.wind_mph}">${value.wind_kph}</div>
        </div>
        </div>
        </div>`; // forecast wrapper ends


        
        if(displayElement){
            displayElement.innerHTML = box;
        }
        
        if(document.getElementById('forecast-display') == null){
            document.body.appendChild(displayElement);
        }else{
            document.getElementById('forecast-display').innerHTML = box;
        }

        decorate();
        
    }
    

    var __precip = 'in',
    __pressure = 'in',
    __wind = 'kph',
    __vis = 'km',
    __temp = 'C';
    
    var decorate = function(){
        var toggleFeelslike = function(el){
            console.log(this.dataset);
        }
        document.getElementById('feelslike').addEventListener('click',toggleFeelslike);

        var togglePrecip = function(el){
            console.log(this.dataset);
        }
        document.getElementById('precipitation').addEventListener('click',togglePrecip);

        var togglePressure = function(el){
            console.log(this.dataset);
        }
        document.getElementById('pressure').addEventListener('click',togglePrecip);

        var toggleTemp = function(el){
            console.log(this.dataset);
        }
        document.getElementById('temp').addEventListener('click',toggleTemp);

        var toggleVis = function(el){
            console.log(this.dataset);
        }
        document.getElementById('vis').addEventListener('click',toggleVis);

        document.getElementById('wind').addEventListener('click',toggleWind);
        var toggleWind = function(el){
            console.log(el.dataset);
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
