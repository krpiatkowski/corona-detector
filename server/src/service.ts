import * as GoogleTrends from "google-trends-api";
import * as moment from "moment";
import { findLineByLeastSquares } from "./math"
import * as fetch from "node-fetch";
import * as iso3361 from "iso-3166-2"



const startTime = moment().subtract(1, 'days').toDate();
const keywords =  ["coronavirus", "corona virus", "covid-19"];


export class Service {
    public async get(latLong?:{lat: number, long: number}) {        
        console.info(`Latitude ${latLong.lat}, Longitude ${latLong.long}`);
        let region = undefined;
        if(latLong) {
           region = await this.lookUp(latLong);
        }
        console.info(`Region is ${region ?? "Worldwide"}`)
        
        const data = await this.fetchData(region);
        const fittedData = findLineByLeastSquares(data);
        if(fittedData.length > 0) {
            const first = fittedData[0];
            const last = fittedData[fittedData.length-1];
            return {score: last.y - first.y, region: iso3361.subdivision(region)};
        } else {
            return {region: iso3361.subdivision(region)};
        }
    }

    private async lookUp(latLong: {lat: number, long: number}) {
        const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latLong.lat}&longitude=${latLong.long}&localityLanguage=en`, {});
        const json = await response.json();

        let info = {order: -1, isoCode: undefined};        
        for(const a of json.localityInfo.administrative) {
            info =  a.order > info.order && a.order <= 4 && a.isoCode ? a : info
        }

        return info.isoCode;
    }

    private async fetchData(geo: string) {
        const result = await GoogleTrends.interestOverTime({keyword: keywords, startTime,  geo, granularTimeResolution: true})
        const json = JSON.parse(result);
        
        return json.default.timelineData.
        filter(r => r.hasData).
        map((r) => ({
            x: Number(r.time), 
            y: r.value.reduce((a, c) => a + c) / keywords.length 
        }))       
    }
}
