import { Router } from "express";
import auth from "../../middlewares/auth";
import { processController } from "./process.controller.";

const route = Router()

route.post('/',  processController.createProcess)
route.get('/', processController.getAllProcess)
route.get('/:processId', processController.getSingleProcess)
route.patch('/:processId', processController.updateProcess);
route.delete('/:processId', processController.deleteProcess);
export const processRoute = route