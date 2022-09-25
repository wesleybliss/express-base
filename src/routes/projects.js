import Logger from '@utils/logger'
import express from 'express'
import { Project } from '@models'

const log = Logger('routes/projects')
const router = express.Router()

export const create = async (req, res) => {
    
    const {
        name,
    } = req.body
    
    if (!name?.length)
        return res.status(400).json({ error: 'Invalid name' })
    
    try {
        
        const result = await Project.query().insert({ user_id: req.user.id, name })
        
        res.json({
            data: result,
        })
        
    } catch (e) {
        
        log.e(e)
        
        res.status(500).json({ error: e.message })
        
    }
    
}

export const read = async (req, res) => {
    
    try {
        
        const { id } = req.params
        
        const result = await Project.query()
            .withGraphFetched('appKeys')
            .findOne({ id })
        
        res.json({
            data: result,
        })
        
    } catch (e) {
        
        res.status(500).json({ Error: e.message })
        
    }
    
}

export const update = async (req, res) => {
    
    try {
        
        const { id } = req.params
        const { name } = req.body
        
        const project = await Project.query().findOne({ id })
        
        if (!project)
            return res.status(404).json({ error: 'Project not found' })
        
        const result = await project.$query().patchAndFetch({
            name,
        })
        
        res.json({
            data: result,
        })
        
    } catch (e) {
        
        res.status(500).json({ Error: e.message })
        
    }
    
}

export const list = async (req, res) => {
    
    try {
        
        const projects = await Project.query()
            .select(...Project.publicFields)
            // .joinRelated('appKeys')
            // .leftJoinRelated('appKeys')
            .withGraphFetched('appKeys')
            .orderBy(`${Project.tableName}.updated_at`)
        
        res.json({
            data: projects,
        })
        
    } catch (e) {
        
        console.error(e)
        
        res.status(500).json({ error: e.message })
        
    }
    
}

export const del = async (req, res) => {
    
    try {
        
        const { id } = req.params
        
        await Project.query().deleteById(id)
        
        res.json({
            success: true,
            message: 'Project deleted',
        })
        
    } catch (e) {
        
        console.warn('Failed to delete project', e)
        
        res.status(500).json({ error: 'Failed to delete project' })
        
    }
    
}

router.post('/', create)
router.get('/:id', read)
router.put('/:id', update)
router.get('/', list)
router.delete('/:id', del)

export default app => app.use('/projects', router)
