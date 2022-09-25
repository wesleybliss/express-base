import * as path from 'path'
import { EnvType, env } from '@utils/env'

const config = {
    host: env('HOST', EnvType.String),
    port: env('PORT', EnvType.Int),
    root: path.resolve(__dirname, '..'),
    log: {
        level: env('LOG_LEVEL', EnvType.String),
        events: {
            requests: env('LOG_REQUESTS', EnvType.Boolean, false, true),
        },
    },
    cors: {
        logRequests: env('CORS_LOG_REQUESTS', EnvType.Boolean),
        allowUndefined: env('CORS_ALLOW_UNDEFINED', EnvType.Boolean),
        whitelist: {
            enabled: env('CORS_WHITELIST_ENABLED', EnvType.Boolean),
            file: env('CORS_WHITELIST_FILE', EnvType.String),
        },
    },
    security: {
        tokenSecret: env('TOKEN_SECRET', EnvType.String),
    },
    database: {
        type: env('DB_TYPE', EnvType.EnumString, true, {
            strict: true,
            values: ['sqlite', 'postgres'],
        }),
        sqliteFile: env('SQLITE_FILE', EnvType.String, false),
        host: env('DB_HOST', EnvType.String, false),
        port: env('DB_PORT', EnvType.Int, false),
        user: env('DB_USER', EnvType.String, false),
        password: env('DB_PASSWORD', EnvType.String, false),
        database: env('DB_DATABASE', EnvType.String, false),
        timestampFormat: 'YYYY-MM-DDTHH:mm:ssZ',
    },
    misc: {
        signupInviteRequired: env('SIGNUP_INVITE_REQUIRED', EnvType.Boolean, false),
    },
}

// Post initialization tasks

// If SQLite selected, a file must be specified
if (config.database.type === 'sqlite') {
    
    if (!config.database.sqliteFile?.length)
        throw new Error('Database type set to SQLite, but no SQLITE_FILE value given')
    
} else {
    
    if (!parseInt(config.database.port, 10))
        throw new Error('Invalid database port')
    
    ['host', 'user', 'password', 'database'].forEach(it => {
        if (!config.database[it]?.length)
            throw new Error(`Invalid database value for "${it}`)
    })
    
}

export default config
