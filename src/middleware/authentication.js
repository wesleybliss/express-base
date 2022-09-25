import Logger from '@utils/logger'
import { User } from '@models'
import { verifyJwt } from '@utils/crypto'

const log = Logger('middleware/authentication')

const publicRoutes = [
    
    // @todo DEBUG
    { method: 'POST', url: '/nuke' },
    
    { method: 'GET', url: '/' },
    { method: 'POST', url: '/setup' },
    { method: 'POST', url: '/signup' },
    { method: 'POST', url: '/signin' },
]

const isPublicRoute = req => {
    
    if (req.headers?.admin === 'true')
        return true
    
    const match = publicRoutes.find(it => (
        it.method === req.method &&
        it.url === req.url
    ))?.url
    
    const isPublic = match?.length > 0
    const allPublicRoutes = publicRoutes.map(it => it.url).join(', ')
    
    // log.d('isPublicRoute', req.url, 'vs [' + allPublicRoutes + ']', { isPublic })
    log.d(`(${isPublic ? 'public' : 'private'}) ${req.url}`)
    
    return isPublic
    
}

export default async (req, res, next) => {
    
    try {
        req.user = await User.findOneByToken(req.token, [...User.publicFields, 'token'])
        log.i('Req.user', req.user?.email)
    } catch (e) {
        log.w('Req.user not found', req.token)
        req.user = null
    }
    
    log.i('email', req.user?.email)
    
    if (isPublicRoute(req))
        return next()
    
    if (!req.user?.token?.length) {
        log.w('missing token')
        return res.status(401).json({ error: 'Unauthorized' })
    }
    
    try {
        
        await verifyJwt(req.user.token)
        next()
        
    } catch (e) {
        
        // @todo handle refresh token flow?
        if (e?.message.includes('jwt expired')) {
            log.w('expired token')
            return res.status(401).json({ error: 'Authorization expired'})
        }
        
        log.w('failed token verification')
        res.status(401).json({ error: 'Unauthorized' })
        
    }
    
}
