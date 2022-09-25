import Logger from '@utils/logger'
import express from 'express'
import { AppKey, Project } from '@models'
import { v4 as uuidv4 } from 'uuid'

const log = Logger('routes/appKeys')
const router = express.Router()

export const create = async (req, res) => {
    
    const { projectId } = req.params
    const { name } = req.body
    
    if (!projectId)
        return res.status(400).json({ error: 'Invalid project ID' })
    
    if (!name?.length)
        return res.status(400).json({ error: 'Invalid name' })
    
    try {
        
        const project = await Project.query().findById(projectId)
        
        if (!project)
            return res.status(404).json({ error: 'Project not found' })
        
        const result = await AppKey.query().insert({
            project_id: project.id,
            name,
            key: uuidv4(),
        })
        
        res.json({
            data: result,
        })
        
    } catch (e) {
        
        console.error(e)
        
        res.status(500).json({ error: e.message })
        
    }
    
}

export const read = async (req, res) => {
    
    try {
        
        const { projectId } = req.params
        const { id } = req.params
        
        const result = await AppKey.query().findOne({ id, project_id: projectId })
        
        res.json({
            data: result,
        })
        
    } catch (e) {
        
        res.status(500).json({ Error: e.message })
        
    }
    
}

export const update = async (req, res) => {
    
    return res.sendStatus(405)
    
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
        
        const { projectId } = req.params
        
        const result = await AppKey.query()
            .select(...AppKey.publicFields)
            .where({ project_id: projectId })
            .orderBy(`${AppKey.tableName}.updated_at`)
        
        res.json({
            data: result,
        })
        
    } catch (e) {
        
        console.error(e)
        
        res.status(500).json({ error: e.message })
        
    }
    
}

export const del = async (req, res) => {
    
    try {
        
        const { id } = req.params
        
        await AppKey.query().deleteById(id)
        
        res.json({
            success: true,
            message: 'App key deleted',
        })
        
    } catch (e) {
        
        console.warn('Failed to delete app key', e)
        
        res.status(500).json({ error: 'Failed to delete app key' })
        
    }
    
}

router.post('/', create)
router.get('/:id', read)
router.put('/:id', update)
router.get('/', list)
router.delete('/:id', del)

export default app => app.use('/appkeys', router)
