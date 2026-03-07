"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRoute = void 0;
const express_1 = require("express");
const upload_middleware_1 = require("../../middlewares/upload.middleware");
const upload_controller_1 = require("./upload.controller");
const route = (0, express_1.Router)();
route.post('/', upload_middleware_1.upload.single('image'), upload_controller_1.uploadController.uploadImage);
exports.uploadRoute = route;
