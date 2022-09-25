
const timestamps = t => {
    
    t.integer('created_at').notNullable()
    t.integer('updated_at').notNullable()
    
}

const createUsers = async (knex) => {
    
    await knex.schema.createTable('users', t => {
        t.increments('id', { primaryKey: true })
        timestamps(t)
        t.string('email').notNullable()
        t.string('password').notNullable()
        t.string('token')
    })
    
    await knex.schema.alterTable('users', t => {
        t.unique('email')
    })
    
}

const createInvites = async (knex) => {
    
    await knex.schema.createTable('invites', t => {
        t.increments('id', { primaryKey: true })
        timestamps(t)
        t.integer('inviter_id').notNullable()
        t.string('invitee_email').notNullable()
        t.string('token')
        
        t.foreign('inviter_id')
            .references('users.id')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
    })
    
    await knex.schema.alterTable('invites', t => {
        t.unique('invitee_email')
    })
    
}

const createProjects = async (knex) => {
    
    await knex.schema.createTable('projects', t => {
        t.increments('id', { primaryKey: true })
        timestamps(t)
        t.integer('user_id').notNullable()
        t.text('name').notNullable()
        
        t.foreign('user_id')
            .references('users.id')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
    })
    
}

const createProjectAppKey = async (knex) => {
    
    await knex.schema.createTable('app_keys', t => {
        t.increments('id', { primaryKey: true })
        timestamps(t)
        t.integer('project_id').notNullable()
        t.text('name').notNullable()
        t.text('key').notNullable()
        // @todo enabled?
        
        t.foreign('project_id')
            .references('projects.id')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
    })
    
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    
    const fns = [
        createUsers,
        createInvites,
        createProjects,
        createProjectAppKey,
    ]
    
    for (let i in fns) {
        await fns[i](knex)
    }
    
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    
    const tables = [
        'app_keys',
        'projects',
        'invites',
        'users',
    ]
    
    await Promise.all(
        tables.map(table => {
            return knex.schema.dropTableIfExists(table)
        })
    )
    
};
