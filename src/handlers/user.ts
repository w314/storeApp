import express from 'express'
// import type and model class
import { User, UserStore } from '../models/user'

const store = new UserStore();

const create = async (_req: express.Request, res: express.Response) => {
    
    const user = {
        username : _req.body.username,
        password : _req.body.password
    }
    try {
        const newUser = await store.create(user)
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}