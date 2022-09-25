const { Model } = require('objection')
import { BaseModel } from './base'
import User from './user'
import { AppKey } from './appKey'

export class Project extends BaseModel {
    
    static get tableName() {
        return 'projects'
    }
    
    static get relationMappings() {
        return {
            owner: {
                relation: Model.HasOneRelation,
                modelClass: User,
                join: {
                    from: 'projects.user_id',
                    to: 'users.id',
                },
            },
            appKeys: {
                relation: Model.HasManyRelation,
                modelClass: AppKey,
                join: {
                    from: 'projects.id',
                    to: 'app_keys.project_id',
                },
            },
        }
    }
    
    static get publicFields() {
        return ['id', 'created_at', 'updated_at', 'user_id', 'name'].map(it => `${this.tableName}.${it}`)
    }
    
}
