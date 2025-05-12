import { Schema, model, Document } from "mongoose";
import { SwarmStatus, SwarmSpec, SwarmJob, SwarmResult } from "../types/swarm";

interface ISwarmJob extends Document {
  job_id: string;
  status: SwarmStatus;
  swarm_spec: SwarmSpec;
  created_at: Date;
  updated_at: Date;
  metadata?: Record<string, any>;
}

interface ISwarmStatus extends Document {
  job_id: string;
  status: SwarmStatus;
  progress: number;
  started_at: Date;
  updated_at: Date;
  error?: string;
}

interface ISwarmResult extends Document {
  job_id: string;
  status: SwarmStatus;
  output: Record<string, any>;
  completed_at: Date;
  metadata?: Record<string, any>;
}

const SwarmJobSchema = new Schema<ISwarmJob>({
  job_id: { type: String, required: true, unique: true },
  status: { type: String, enum: Object.values(SwarmStatus), required: true },
  swarm_spec: { type: Schema.Types.Mixed, required: true },
  metadata: { type: Schema.Types.Mixed }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const SwarmStatusSchema = new Schema<ISwarmStatus>({
  job_id: { type: String, required: true, unique: true },
  status: { type: String, enum: Object.values(SwarmStatus), required: true },
  progress: { type: Number, required: true, min: 0, max: 1 },
  started_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
  error: { type: String }
});

const SwarmResultSchema = new Schema<ISwarmResult>({
  job_id: { type: String, required: true, unique: true },
  status: { type: String, enum: Object.values(SwarmStatus), required: true },
  output: { type: Schema.Types.Mixed, required: true },
  completed_at: { type: Date, required: true },
  metadata: { type: Schema.Types.Mixed }
});

// Indexes
SwarmJobSchema.index({ status: 1 });
SwarmStatusSchema.index({ job_id: 1 });
SwarmResultSchema.index({ job_id: 1 });

export const SwarmJobModel = model<ISwarmJob>("SwarmJob", SwarmJobSchema);
export const SwarmStatusModel = model<ISwarmStatus>("SwarmStatus", SwarmStatusSchema);
export const SwarmResultModel = model<ISwarmResult>("SwarmResult", SwarmResultSchema); 