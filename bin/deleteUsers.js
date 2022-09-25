import '@/env'
import '@db'
import { User } from '@models'

const main = async () => {
    
    await User.query()
        .delete()
    
}

main().then(() => process.exit(0))
