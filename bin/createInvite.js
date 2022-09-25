import '@/env'
import '@db'
import { User } from '@models'
import { Invite } from '@models'

const args = process.argv.slice(2)
const [inviterEmail, inviteeEmail] = args

if (!inviterEmail?.length) throw new Error('Invalid inviter email')
if (!inviteeEmail?.length) throw new Error('Invalid invitee email')

const main = async () => {
    
    const inviter = await User.findOneByEmail(inviterEmail, ['id', 'email'])
    
    if (!inviter?.email?.length)
        return console.error('Inviter email not found', inviterEmail)
    
    const invite = await Invite.create(inviter.id, inviteeEmail)
    
    console.log(invite)
    
}

main().then(() => process.exit(0))
