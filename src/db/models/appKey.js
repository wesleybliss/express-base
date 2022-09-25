const { Model } = require('objection')
import { BaseModel } from './base'
import Project from './project'

export class AppKey extends BaseModel {
    
    static get tableName() {
        return 'app_keys'
    }
    
    static get relationMappings() {
        return {
            project: {
                relation: Model.HasOneRelation,
                modelClass: Project,
                join: {
                    from: 'app_keys.project_id',
                    to: 'projects.id',
                },
            },
        }
    }
    
    static get publicFields() {
        return ['id', 'project_id', 'name', 'key'].map(it => `${this.tableName}.${it}`)
    }
    
}
