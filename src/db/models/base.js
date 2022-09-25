import { Model } from 'objection'
import dayjs from 'dayjs'

export class BaseModel extends Model {
    
    static get useLimitInFirst() {
        
        return true
        
    }
    
    async $beforeInsert(context) {
        
        await super.$beforeInsert(context)
        
        const timestamp = dayjs().unix()
        
        this.created_at = timestamp
        this.updated_at = timestamp
        
    }
    
    async $beforeUpdate(opt, context) {
        
        await super.$beforeUpdate(opt, context)
        
        this.updated_at = dayjs().unix()
        
    }
    
}
