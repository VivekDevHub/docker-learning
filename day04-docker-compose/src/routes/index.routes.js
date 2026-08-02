import { Router } from 'express';


const indexRouter = Router();

/**
 * GET /api
 */
indexRouter.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API' });
})

indexRouter.get("/health", (req, res) => {
    res.json({ status: "OK" });
})

indexRouter.get("/test", (req, res) => {
    res.json({ message: "Test route is working!" });
})

export default indexRouter;