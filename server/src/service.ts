import * as GoogleTrends from "google-trends-api";
import * as moment from "moment";
import { findLineByLeastSquares } from "./math"


const startTime = moment().subtract(1, 'days').toDate();
const keyword =  "coronavirus"


export class Service {
    public async get(geo) {
        const data = await this.fetchData(geo);
        const fittedData = findLineByLeastSquares(data);
        if(fittedData.length > 0) {
            const first = fittedData[0];
            const last = fittedData[fittedData.length-1];
            return {score: last.y - first.y};
        } else {
            return {score: 0};
        }
    }

    private async fetchData(geo) {
        const result = await GoogleTrends.interestOverTime({keyword, startTime,  geo, granularTimeResolution: true})
        const json = JSON.parse(result);
        return json.default.timelineData.filter(r => r.hasData).map((r) => ({x: Number(r.time), y: r.value[0]}))       
    }
}
