import Logger from '@utils/logger'
import express from 'express'
import { User } from '@models'
import { omit } from '@utils'

const log = Logger('routes/users')
const router = express.Router()

const signup = async (req, res) => {
    
    try {
        
        const { email, password } = req.body
        
        if (!email?.length || !password?.length) {
            log.w('Invalid or missing credentials', { email, password })
            return res.status(400).json({ error: 'Invalid or missing credentials' })
        }
        
        const existingUser = await User.query()
            .select('id', 'email', 'password')
            .where({ email })
        
        if (existingUser?.email === email) {
            
            const isValid = await User.validateCredentials(password, existingUser.password)
            
            if (!isValid)
                return res.status(401).json({ error: 'Invalid credentials for existing user' })
            
            const user = await User.updateToken(existingUser.id, existingUser.email)
            
            return res.json({
                data: omit(user, ['password']),
            })
            
        }
        
        const user = await User.create(email, password)
        const data = await User.updateToken(user.id, user.email, [...User.publicFields, 'token'])
        
        res.json({
            data,
        })
        
    } catch (e) {
        
        log.e('routes/signup', e)
        
        res.status(500).json({ error: 'System error' })
        
    }
    
}

const signin = async (req, res) => {
    
    try {
        
        const { email, password } = req.body
        
        if (!email?.length || !password?.length)
            return res.status(401).json({ error: 'Invalid credentials' })
        
        const existingUser = await User.findOneByCredentials(email, password, ['id', 'email', 'password'])
        
        if (!existingUser?.email?.length || !existingUser?.password?.length) {
            log.w('User does not exist', { email, password })
            return res.status(401).json({ error: 'Unauthorized' })
        }
        
        const user = await User.updateToken(
            existingUser.id,
            existingUser.email,
            [...User.publicFields, 'token'],
        )
        
        return res.json({
            data: user,
        })
        
    } catch (e) {
        
        log.e('routes/signin', e)
        
        res.status(500).json({ error: 'System error' })
        
    }
    
}

const setup = async (req, res) => {
    
    try {
        
        const total = (await User.query().count('id', { as: 'value' }))[0].value
        
        if (total > 0)
            return res.status(401).json({ error: 'Already initialized' })
        
        return await signup(req, res)
        
    } catch (e) {
        
        log.e('setup', e)
        
        res.status(500).json({ error: 'Setup failed' })
        
    }
    
}

const readUser = async (req, res) => {
    
    try {
        
        const id = req.params?.id || req.user?.id
        
        // If the requested user is the currently logged in user,
        // return a more full profile
        const fields = (id === req.user?.id)
            ? [...User.publicFields, 'email']
            : User.publicFields
        
        const user = await User.query().select(...fields).where({ id })
        
        res.json({
            data: user,
        })
        
    } catch (e) {
        
        log.e('readUser', e)
        
        res.status(500).json({ error: 'Could not find user' })
        
    }
    
}

router.get('/', readUser)
router.get('/:id', readUser)

export const usersRouter = router

export default app => {
    
    app.post('/setup', setup)
    app.post('/signup', signup)
    app.post('/signin', signin)
    
    app.use('/users', router)
    
}
