import pino from 'pino'
import config from '@config'

const Logger = name => pino({
    name,
    level: config.log.level,
    transport: {
        target: 'pino-pretty',
        options: {
            // colorize: true,
            ignore: 'pid,hostname,time',
        },
    },
})

const lastArgIsError = args => {
    try {
        return args[args.length - 1] instanceof Error
    } catch (e) {
        return false
    }
}

const argsForError = args => {
    
    if (!lastArgIsError(args))
        return args
    
    const earg = args.pop()
    const newArgs = [...args, earg?.message ?? earg]
    
    if (earg?.stack)
        newArgs.push(earg?.stack)
    
    return newArgs
    
}

const joinArgs = args => {
    
    return args
        .map(it => typeof it === 'string' ? it : JSON.stringify(it, null, 4))
        .join(' ')
    
}

export default name => {
    
    const log = Logger(name)
    
    log.t = (...args) => log.trace(joinArgs(args))
    log.d = (...args) => log.debug(joinArgs(args))
    log.i = (...args) => log.info(joinArgs(args))
    
    log.w = (...args) => log.warn(joinArgs(argsForError(args)))
    log.e = (...args) => log.error(joinArgs(argsForError(args)))
    log.f = (...args) => log.fatal(joinArgs(argsForError(args)))
    
    return log
    
}
