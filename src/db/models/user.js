import { Model } from 'objection'
import { BaseModel } from './base'
import { Project } from './project'
import * as crypto from '@utils/crypto'
import { omit, } from '@utils'

const defaultFields = ['id', 'email']

export class User extends BaseModel {
    
    static get tableName() {
        return 'users'
    }
    
    static get relationMappings() {
        return {
            projects: {
                relation: Model.HasManyRelation,
                modelClass: Project,
                join: {
                    from: 'users.id',
                    to: 'projects.user_id',
                },
            },
        }
    }
    
    static get publicFields() {
        return defaultFields
    }
    
    static async create(email, password, fields = defaultFields) {
        
        const hashed = await crypto.bcryptHash(password)
        const result = await User.query().insertAndFetch({ email, password: hashed })
        
        return omit(result, fields, true)
        
    }
    
    static async validateCredentials(password, hash) {
        
        const decoded = await bcryptCompare(password, hash)
        
        return decoded === true
        
    }
    
    static async updateToken(id, email, fields = defaultFields) {
        
        const token = await crypto.signJwt({
            id,
            email,
        })
        
        await this.query()
            .patch({ token })
            .findById(id)
        
        return this.query()
            .select(...fields)
            .findById(id)
        
    }
    
    static async findOneByEmail(email, fields = defaultFields) {
        
        return await this.query()
            .select(...fields)
            .findOne({ email })
        
    }
    
    static async findOneByToken(token, fields = defaultFields) {
        
        return await this.query()
            .select(...fields)
            .findOne({ token })
        
    }
    
    static async findOneByCredentials(email, password, fields = defaultFields) {
        
        const user = await this.query()
            .select(...[...fields, 'password'])
            .findOne({ email })
        
        const decoded = await crypto.bcryptCompare(password, user.password)
        
        if (decoded !== true) return null
        
        return fields.includes('password') ? user : omit(user, 'password')
        
    }
    
}
