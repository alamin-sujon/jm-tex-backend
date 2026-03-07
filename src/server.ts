import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import { Server } from 'http';
import dns from 'node:dns/promises';
import { adminSeeder } from './app/seeder/admin.seeder';
import { initCloudinary } from './app/utils/upload';

let server: Server;

async function main() {
  try {
    dns.setServers(['1.1.1.1', '8.8.8.8']);

    // ✅ connect DB first
    await mongoose.connect(config.db_url as string);
    console.log('Mongodb connected successfully');

    // ✅ cPanel requires process.env.PORT
    const port = Number(process.env.PORT) || Number(config.port) || 3000;

    server = app.listen(port, '0.0.0.0', () => {
      console.log('Server running at port:', port);
    });

    // (optional) don’t block startup
    adminSeeder().catch(console.error);
    initCloudinary();
  } catch (error) {
    console.log({ error });
  }
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
