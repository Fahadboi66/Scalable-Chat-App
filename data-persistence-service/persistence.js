import dotenv from 'dotenv';
import { startPersistenceService } from './services/persistenceService.js';

dotenv.config();

async function start() {
  await startPersistenceService();
  console.log('Persistence service running');
}

start();