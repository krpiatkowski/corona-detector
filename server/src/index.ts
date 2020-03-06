import * as express from 'express'

import { Service } from "./service";


const service = new Service();

const port = 8800
const app = express()

app.get('/', async (req, res) => {
    try {
        const response = await service.get(req.query.lat && req.query.long ? {lat: Number(req.query.lat), long: Number(req.query.long)} : undefined);
        res.send(response)    
    } catch {
        res.send({score: 0, error: true})
    }
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))