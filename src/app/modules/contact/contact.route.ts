// contact.route.ts
import { Router } from 'express';
import auth from '../../middlewares/auth';
import { contactController } from './contact.controller';

const route = Router();

route.post('/',  contactController.createContact);
route.post('/contact-us', contactController.contactUs);
route.get('/', contactController.getAllContact);
route.get('/admin', contactController.getAdminStat);
route.get('/:contactId', contactController.getSingleContact);
route.patch('/:contactId',  contactController.updateContact);
route.delete('/:contactId',  contactController.deleteContact);

export const contactRoute = route;
