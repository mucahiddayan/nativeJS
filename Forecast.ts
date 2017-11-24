/**
 * @author Mücahid Dayan
 * @version 1.0.0
 * 'c6df1e406f204a32926120907170910'
 * 'https://api.apixu.com/v1/forecast.json?'
 */

class Forecast {
    constructor(private forecast: any) { }

    getForecastsInHours() {
        return this.forecast.forecast.forecastday[0].hour;
    }

    getCurrentForecast() {
        return this.forecast.current;
    }


}

class ForecastView {
    apiURL: string;
    constructor(private apiKey: string, private location: string = 'Berlin') {
        this.apiURL = 'https://api.apixu.com/v1/forecast.json?';
    }

    setLocation(location: string): ForecastView {
        this.location = location;
        return this;
    }

    async getWeather(): Promise<Response> {
        return await fetch(`${this.apiURL}key=${this.apiKey}&q=${this.location}`);
    }

    init(cssSelector?: string): void {
        if (cssSelector) {
            let screen = document.querySelector(cssSelector);
        }
        this.getWeather()
            .then(result => result.json())
            .then(result => {
                let currentForecast = new Forecast(result).getCurrentForecast();
                console.log(currentForecast);
            })
            .catch(error=>console.warn(error));
    }
}

var fcv = new ForecastView('c6df1e406f204a32926120907170910');
fcv.setLocation('Berlin').init();