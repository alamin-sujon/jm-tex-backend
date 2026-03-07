"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const upload_route_1 = require("../modules/upload/upload.route");
const product_route_1 = require("../modules/product/product.route");
const banner_route_1 = require("../modules/banner/banner.route");
const process_route_1 = require("../modules/process/process.route");
const contact_route_1 = require("../modules/contact/contact.route");
const route = (0, express_1.Router)();
const modules = [
    {
        path: '/user',
        route: user_route_1.userRoute,
    },
    {
        path: '/upload',
        route: upload_route_1.uploadRoute,
    },
    {
        path: '/cap',
        route: product_route_1.productRoute,
    },
    {
        path: '/banner',
        route: banner_route_1.bannerRoute,
    },
    {
        path: '/process',
        route: process_route_1.processRoute,
    },
    {
        path: '/contact',
        route: contact_route_1.contactRoute,
    },
];
modules.map((el) => route.use(el.path, el.route));
exports.default = route;
