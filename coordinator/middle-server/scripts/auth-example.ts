import { Keypair } from "@_koii/web3.js";
import { signData } from "../src/utils/sign";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function makeAuthenticatedRequest() {
  // Generate a new keypair (in production, you would use your actual keypair)
  const keypair = Keypair.generate();
  
  // Create the payload
  const payload = {
    taskId: "example-task-123",
    timestamp: Date.now(),
    action: "create_swarm"
  };

  try {
    // Sign the payload
    const signature = await signData(keypair, payload);
    const publicKey = keypair.publicKey.toBase58();

    // Prepare the request
    const swarmSpec = {
      name: "Example Swarm",
      description: "An example swarm",
      agents: [
        {
          agent_name: "Example Agent",
          description: "An example agent",
          model_name: "gpt-4",
          max_tokens: 1000
        }
      ],
      max_loops: 3,
      swarm_type: "example",
      task: "Example task"
    };

    // Make the authenticated request
    const response = await axios.post(
      "http://localhost:3000/api/swarm/jobs",
      { swarm_spec: swarmSpec },
      {
        headers: {
          "Authorization": `Bearer ${process.env.SWARMS_ADMIN_KEY}`,
          "X-Signature": signature,
          "X-Public-Key": publicKey,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Request successful!");
    console.log("Response:", response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Request failed:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    } else {
      console.error("Error:", error);
    }
  }
}

// Run the example
makeAuthenticatedRequest().catch(console.error); 