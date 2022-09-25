import { constants } from 'fs'
import * as fsAsync from 'fs/promises'

export const randomNumber = (from, to) =>
    Math.floor(Math.random() * (to - from + 1) + from)

export const _omit = (obj, keys) =>
    Object.keys(obj).reduce((acc, it) => {
        if (typeof keys === 'string' && it === keys)
            return acc
        else if (keys.includes(it))
            return acc
        else
            return { ...acc, [it]: obj[it] }
    }, {})

export const _includeOnly = (obj, keys) =>
    Object.keys(obj).reduce((acc, it) => {
        if (typeof keys === 'string' && it === keys)
            return { ...acc, [it]: obj[it] }
        else if (keys.includes(it))
            return { ...acc, [it]: obj[it] }
        else
            return acc
    }, {})

export const omit = (obj, keys, invert = false) =>
    invert ? _includeOnly(obj, keys) : _omit(obj, keys)

export const existsAsync = dir =>
    fsAsync.access(dir, constants.F_OK)
        .then(() => true)
        .catch(() => false)
