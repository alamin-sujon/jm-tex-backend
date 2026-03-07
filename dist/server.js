"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./app/config"));
const promises_1 = __importDefault(require("node:dns/promises"));
const admin_seeder_1 = require("./app/seeder/admin.seeder");
const upload_1 = require("./app/utils/upload");
let server;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            promises_1.default.setServers(['1.1.1.1', '8.8.8.8']);
            // ✅ connect DB first
            yield mongoose_1.default.connect(config_1.default.db_url);
            console.log('Mongodb connected successfully');
            // ✅ cPanel requires process.env.PORT
            const port = Number(process.env.PORT) || Number(config_1.default.port) || 3000;
            server = app_1.default.listen(port, '0.0.0.0', () => {
                console.log('Server running at port:', port);
            });
            // (optional) don’t block startup
            (0, admin_seeder_1.adminSeeder)().catch(console.error);
            (0, upload_1.initCloudinary)();
        }
        catch (error) {
            console.log({ error });
        }
    });
}
main();
process.on('unhandledRejection', () => {
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
});
process.on('uncaughtException', () => {
    process.exit(1);
});
