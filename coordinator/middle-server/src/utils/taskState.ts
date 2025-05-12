import { BYPASS_TASK_STATE_CHECK } from "../config/constant";
import NodeCache from "node-cache";

interface TaskStateInfo {
  success: boolean;
  data: {
    stake_list: Record<string, boolean>;
  };
}

// Mock getTaskStateInfo function
async function getTaskStateInfo(connection: any, taskId: string): Promise<TaskStateInfo> {
  return {
    success: true,
    data: {
      stake_list: {
        mockStakingKey1: true,
        mockStakingKey2: true
      }
    }
  };
}

const cache = new NodeCache({ stdTTL: 60 * 5 }); // 5 minutes TTL

export async function isValidStakingKey(taskId: string, stakingKey: string): Promise<boolean> {
  if (BYPASS_TASK_STATE_CHECK) {
    return true;
  }

  try {
    const cacheKey = `${taskId}-${stakingKey}`;
    const cachedResult = cache.get<boolean>(cacheKey);
    if (cachedResult !== undefined) {
      return cachedResult;
    }

    const taskState = await getTaskStateInfo(null, taskId);
    if (!taskState.success || !taskState.data) {
      return false;
    }

    const stakeListKeys = Object.keys(taskState.data.stake_list);
    const isValid = stakeListKeys.includes(stakingKey);
    cache.set(cacheKey, isValid);
    return isValid;
  } catch (error) {
    console.error("Error checking staking key:", error);
    return false;
  }
}

// async function test() {
//   const stakeListKeys = await getTaskState("H5CKDzSi2qWs7y7JGMX8sGvAZnWcUDx8k1mCMVWyJf1M");
//   console.log(stakeListKeys);
//   console.log(1)
//     const stakeList = await getTaskState("H5CKDzSi2qWs7y7JGMX8sGvAZnWcUDx8k1mCMVWyJf1M");
//     console.log(stakeList);
//     console.log(2)
// }
// test();
