import { getOrcaClient } from "@_koii/task-manager/extensions";
import { namespaceWrapper, TASK_ID } from "@_koii/namespace-wrapper";
import "dotenv/config";
import { status, middleServerUrl } from "../utils/constant";
import * as dotenv from "dotenv";

dotenv.config(); 