import config from '@config'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const bcryptHash = async (password) => {
    
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(password, salt)
    
    return hashed
    
}

export const bcryptCompare = async (password, hash) => {
    
    return await bcrypt.compare(password, hash)
    
}

export const signJwt = data => new Promise((resolve, reject) => {
    
    jwt.sign(
        data,
        config.security.tokenSecret,
        { expiresIn: '30d' },
        (err, value) => {
            if (err) reject(err)
            else resolve(value)
        },
    )
    
})

export const verifyJwt = token => new Promise((resolve, reject) => {
    
    jwt.verify(
        token,
        config.security.tokenSecret,
        (err, decoded) => {
            if (err) reject(err)
            else resolve(decoded)
        },
    )
    
})
