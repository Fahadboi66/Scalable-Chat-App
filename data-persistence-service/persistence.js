import dotenv from 'dotenv';
dotenv.config();
import { startPersistenceService } from './services/persistenceService.js';


async function start() {
  await startPersistenceService();
  console.log('Persistence service running');
}

start();