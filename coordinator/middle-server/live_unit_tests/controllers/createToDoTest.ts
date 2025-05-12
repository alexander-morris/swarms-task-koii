// @deprecated
// Updated to use new swarms APIs
import { connectToDatabase } from "../../src/app";
import axios from "axios";

async function main() {
  await connectToDatabase();

  const validSwarmSpec = {
    name: "Sample Swarm",
    description: "A sample swarm for testing",
    agents: [
      {
        agent_name: "Sample Agent",
        description: "A sample agent",
        model_name: "gpt-4",
        max_tokens: 1000
      }
    ],
    max_loops: 3,
    swarm_type: "test",
    task: "Sample task"
  };

  try {
    const response = await axios.post("http://localhost:3000/api/swarm/jobs", {
      swarm_spec: validSwarmSpec
    });
    console.log("Swarm job created:", response.data);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
