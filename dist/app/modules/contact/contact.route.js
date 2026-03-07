"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactRoute = void 0;
// contact.route.ts
const express_1 = require("express");
const contact_controller_1 = require("./contact.controller");
const route = (0, express_1.Router)();
route.post('/', contact_controller_1.contactController.createContact);
route.post('/contact-us', contact_controller_1.contactController.contactUs);
route.get('/', contact_controller_1.contactController.getAllContact);
route.get('/admin', contact_controller_1.contactController.getAdminStat);
route.get('/:contactId', contact_controller_1.contactController.getSingleContact);
route.patch('/:contactId', contact_controller_1.contactController.updateContact);
route.delete('/:contactId', contact_controller_1.contactController.deleteContact);
exports.contactRoute = route;
