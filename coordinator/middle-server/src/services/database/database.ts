import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Create separate connections for different databases
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017";

// Only create connections if not in test environment
export const builder247DB = process.env.NODE_ENV === 'test' 
  ? mongoose.connection 
  : mongoose.createConnection(`${mongoUri}/builder247`);

export const prometheusDB = process.env.NODE_ENV === 'test'
  ? mongoose.connection
  : mongoose.createConnection(`${mongoUri}/prometheus`);

// Add connection event listeners only in non-test environment
if (process.env.NODE_ENV !== 'test') {
  builder247DB.on("connected", () => {
    console.log("\x1b[32m%s\x1b[0m", "Connected to builder247 database");
  });

  prometheusDB.on("connected", () => {
    console.log("\x1b[32m%s\x1b[0m", "Connected to prometheus database");
  });

  builder247DB.on("error", (err) => {
    console.error("\x1b[31m%s\x1b[0m", "builder247 database connection error:", err);
  });

  prometheusDB.on("error", (err) => {
    console.error("\x1b[31m%s\x1b[0m", "prometheus database connection error:", err);
  });
}

// Export a function to check connection status and wait for connections
export async function checkConnections() {
  if (process.env.NODE_ENV === 'test') {
    return true;
  }

  try {
    await Promise.all([
      builder247DB.asPromise(),
      prometheusDB.asPromise()
    ]);
    return true;
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", "Error connecting to databases:", error);
    return false;
  }
}

// Initialize connections
export const initializeConnections = async () => {
  if (process.env.NODE_ENV === 'test') {
    return true;
  }

  try {
    await checkConnections();
    return true;
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", "Failed to initialize database connections:", error);
    return false;
  }
};
