import '@/env'
import '@db'
import { User } from '@models'

const args = process.argv.slice(2)

const getLimit = () => {
    try {
        const limit = parseInt(args[0] || 10) || 10
        if (!limit || limit < 1)
            return 10
        return limit
    } catch (e) {
        console.error(e)
        return 10
    }
}

const main = async () => {
    
    const limit = getLimit()
    const users = await User.query()
        .select(...User.publicFields, 'password')
        .offset(0)
        .limit(limit)
        .orderBy(`${User.tableName}.updated_at`)
    
    console.log(users)
    
}

main().then(() => process.exit(0))
