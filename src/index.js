import '@/env'
import '@db'
import logger from '@utils/logger'

const log = logger('index')

const start = async () => {
    
    const app = (await import('./app')).default
    const config = (await import('./config')).default
    
    const { host, port } = config
    const uri = `http://${host}:${port}`
    
    app.listen(port, host, () => {
        log.info(`Listening on ${uri}`)
        log.info(`CORS whitelist ${config.cors.whitelist.enabled ? 'is' : 'is not'} enabled`)
        // log.info(JSON.stringify(config, null, 4))
    })
    
}

start()
