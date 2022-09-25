
export const EnvType = {
    Int: 'Int',
    Float: 'Float',
    String: 'String',
    Boolean: 'Boolean',
}

export const env = (key, type = EnvType.String, required = true, defaultValue = undefined) => {
    
    if (!key)
        throw new Error(`Param "key" is required, given: ${key}`)
    
    if (!type)
        throw new Error(`Param "tyoe" is required, given: ${type}`)
    
    if (!Object.keys(EnvType).includes(type))
        throw new Error(`Invalid type "${type}" - must be one of ${Object.keys(EnvType).join(', ')}`)
    
    let value = process.env[key]
    
    try {
        
        switch (type) {
            case EnvType.Int:
                value = parseInt(value, 10)
                break
            case EnvType.Float:
                value = parseFloat(value)
                break
            case EnvType.Boolean:
                value = value.toLowerCase() === 'true'
                break
        }
        
    } catch (e) {
        
        const message = `Failed to parse environment variable "${key}" as ${type}`
        
        console.error(message, e)
        console.log('Available environment variables', JSON.stringify(Object.keys(process.env).sort(), null, 4))
        throw new Error(message)
        
    }
    
    if (required && typeof value === undefined || value === null)
        throw new Error(`Environment variable ${key} (${type}) is required, given: ${value} (${typeof value})`)
    
    return value === undefined ? defaultValue : value
    
}
