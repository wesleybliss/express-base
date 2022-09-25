import '@/env'
import '@db'
import * as User from '@models'

const args = process.argv.slice(2)
const [email, password] = args

if (!email?.length) throw new Error('Invalid email')
if (!password?.length) throw new Error('Invalid password')

const main = async () => {
    
    const user = await User.create(email, password)
    
    console.log(user)
    
    process.exit(0)
    
}

main()
