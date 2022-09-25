import Logger from '@utils/logger'
import express from 'express'
import * as models from '@models'

const log = Logger('routes/debug')
const router = express.Router()

const nukeTable = async table => {
    log.i('NUKE', table)
    const Model = models[table]
    return await Model.query().delete()
}

const nuke = async (req, res) => {
    
    const keys = Object.keys(models)
    const result = await Promise.all(keys.map(it => nukeTable(it)))
    
    res.json(result)
    
}

router.post('/', nuke)

export default app => app.use('/nuke', router)
