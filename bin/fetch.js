import '@/env'
import '@lib/db'
import config from '@config'
import * as User from '@models'
import { shellExec } from '@utils/utils'

const args = process.argv.slice(2)
const [email, url, data] = args

if (!email?.length) throw new Error('Invalid email')
if (!url?.length) throw new Error('Invalid url')

const main = async () => {

    const user = await User.query().findOne({ email })
    const uri = url.startsWith('/') ? url : `/${url}`
    
    if (!user?.email?.length)
        return console.error('No user with that email found')
    
    if (!user?.token?.length)
        return console.error('@todo User has no token')
    
    const method = data ? '-XPOST' : ''
    
    const cmds = [
        `curl -s ${method} ${config.host}:${config.port}${uri}`,
        `-H 'Content-Type: application/json'`,
    ]
    
    if (!uri.endsWith('signup') && !uri.endsWith('signin'))
        cmds.push(`-H 'Authorization: Bearer ${user.token}'`)
    
    if (data)
        cmds.push(`-d '${data}'`)
    
    const cmd = cmds.join(' ')
    
    try {
        const result = await shellExec(cmd)
        console.log(JSON.stringify(JSON.parse(result), null, 4))
    } catch (e) {
        console.error('FAILED', e)
    }
    
}

main().then(() => process.exit(0))
