import { TASK_ID, namespaceWrapper } from "@_koii/namespace-wrapper";
import "dotenv/config";
import os from "os";

const imageUrl = "docker.io/hermanyiqunliang/summarizer-agent:0.5";

function getHostIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      // Skip over internal (i.e., 127.0.0.1) and non-IPv4 addresses
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  throw new Error("Unable to determine host IP address");
}

async function createPodSpec(): Promise<string> {
  const basePath = await namespaceWrapper.getBasePath();

  const podSpec = `apiVersion: v1
kind: Pod
metadata:
  name: 247-builder-test
spec:
  containers:
    - name: user-${TASK_ID}
      image: ${imageUrl}
      env:
      - name: GITHUB_TOKEN
        value: "${process.env.GITHUB_TOKEN}"
      - name: GITHUB_USERNAME
        value: "${process.env.GITHUB_USERNAME}"
      - name: ANTHROPIC_API_KEY
        value: "${process.env.ANTHROPIC_API_KEY}"
      volumeMounts:
        - name: builder-data
          mountPath: /data
  volumes:
    - name: builder-data
      hostPath:
        path: ${basePath}/orca/data
        type: DirectoryOrCreate
  hostAliases:
  - ip: "${getHostIP()}"
    hostnames:
    - "host.docker.internal"
`;
  return podSpec;
}

export async function getConfig(): Promise<{
  imageURL: string;
  customPodSpec: string;
  rootCA: string | null;
  timeout: number;
}> {
  return {
    imageURL: imageUrl,
    customPodSpec: await createPodSpec(),
    rootCA: null,
    timeout: 900000,
  };
}
