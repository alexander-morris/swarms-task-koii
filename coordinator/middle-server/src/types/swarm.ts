import { Request } from "express";

export enum SwarmStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled"
}

export interface AgentSpec {
  agent_name: string;
  description: string;
  model_name: string;
  max_tokens: number;
  temperature?: number;
  top_p?: number;
  system_prompt?: string;
}

export interface ScheduleSpec {
  type: "sequential" | "parallel";
  max_parallel?: number;
}

export interface SwarmSpec {
  name: string;
  description: string;
  agents: AgentSpec[];
  max_loops: number;
  swarm_type: string;
  task: string;
  schedule?: ScheduleSpec;
}

export interface SwarmJob {
  job_id: string;
  status: SwarmStatus;
  swarm_spec: SwarmSpec;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

export interface SwarmStatusUpdate {
  status: SwarmStatus;
  progress: number;
  error?: string;
}

export interface SwarmResult {
  job_id: string;
  status: SwarmStatus;
  output: Record<string, any>;
  completed_at: string;
  metadata?: Record<string, any>;
}

// Request types
export interface CreateSwarmJobRequest extends Request {
  body: {
    swarm_spec: SwarmSpec;
    metadata?: Record<string, any>;
  };
}

export interface UpdateSwarmStatusRequest extends Request {
  params: {
    jobId: string;
  };
  body: {
    status: "pending" | "in_progress" | "completed" | "failed";
    progress?: number;
    error?: string;
  };
}

export interface StoreSwarmResultRequest extends Request {
  params: {
    jobId: string;
  };
  body: {
    output: any;
    metadata?: Record<string, any>;
  };
}

export interface GetSwarmJobRequest extends Request {
  params: {
    jobId: string;
  };
}

export interface GetSwarmResultRequest extends Request {
  params: {
    jobId: string;
  };
}

export interface ListSwarmJobsRequest extends Request {
  query: {
    status?: SwarmStatus;
    limit?: string;
    skip?: string;
  };
} 