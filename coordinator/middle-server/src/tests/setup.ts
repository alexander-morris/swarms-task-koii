/// <reference types="jest" />

import { beforeAll, afterAll, afterEach } from '@jest/globals';
import mongoose from 'mongoose';

beforeAll(async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.MONGODB_URI = 'mongodb://localhost:27017/middle-server-test';
  
  // Connect to test database
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
});

afterAll(async () => {
  // Only attempt cleanup if connected
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
}, 20000); // Increase timeout to 20 seconds

afterEach(async () => {
  // Only clear collections if connected
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
}); 