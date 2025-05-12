// @deprecated
// Updated to use new swarms APIs
import { connectToDatabase } from "../../src/app";
import axios from "axios";
import { Keypair } from "@_koii/web3.js";
import { signData } from "../../src/utils/sign";

async function test() {
  await connectToDatabase();

  const validSwarmSpec = {
    name: "Test Swarm",
    description: "A test swarm",
    agents: [
      {
        agent_name: "Test Agent",
        description: "A test agent",
        model_name: "gpt-4",
        max_tokens: 1000
      }
    ],
    max_loops: 3,
    swarm_type: "test",
    task: "Test task"
  };

  try {
    // Create a new swarm job
    const response = await axios.post("http://localhost:3000/api/swarm/jobs", {
      swarm_spec: validSwarmSpec
    });
    console.log("Swarm job created:", response.data);

    const jobId = response.data.job_id;

    // Update swarm job status
    const statusResponse = await axios.put(`http://localhost:3000/api/swarm/jobs/${jobId}/status`, {
      status: "in_progress",
      progress: 50
    });
    console.log("Swarm job status updated:", statusResponse.data);

    // Submit swarm result
    const resultResponse = await axios.post(`http://localhost:3000/api/swarm/jobs/${jobId}/result`, {
      output: { result: "test output" },
      metadata: { test: "metadata" }
    });
    console.log("Swarm result submitted:", resultResponse.data);

  } catch (error) {
    console.error("Error:", error);
  }
}

test();
