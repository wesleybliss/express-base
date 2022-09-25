import Logger from '@utils/logger'
import express from 'express'
import pkg from '@root/package.json'
import { User } from '@models'

const log = Logger('routes/root')
const router = express.Router()

const root = async (req, res) => {
    
    let initialized = false
    
    try {
        const total = (await User.query().count('id', { as: 'value' }))[0].value
        initialized = total > 0
    } catch (e) {
        log.e(e)
    }
    
    res.json({
        [pkg.name]: {
            version: pkg.version,
        },
        initialized,
    })
    
}

router.get('/', root)

export const rootRouter = router

export default app => app.use('/', router)
