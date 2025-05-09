# Middle Server Schema Update Plan

## Current State
- Middle server currently handles basic todo queue and work item distribution
- Uses simple payload structure for work items
- Endpoints:
  - `/summarizer/worker/fetch-todo`
  - `/summarizer/worker/add-todo-status`
  - `/summarizer/worker/add-todo-pr`
  - `/summarizer/worker/add-round-number`

## Target State
- Integrate Swarms-API payload schema
- Support swarm-based task processing
- Maintain backward compatibility with existing endpoints
- Add new endpoints for swarm operations

## Schema Changes

### 1. SwarmSpec Integration
```typescript
interface SwarmSpec {
  name?: string;
  description?: string;
  agents: AgentSpec[];
  max_loops?: number;
  swarm_type?: string;
  rearrange_flow?: string;
  task: string;
  img?: string;
  return_history?: boolean;
  rules?: string;
  schedule?: ScheduleSpec;
}
```

### 2. New Endpoints
- `/summarizer/worker/swarm-completion` - Handle swarm task execution
- `/summarizer/worker/swarm-status` - Track swarm execution status
- `/summarizer/worker/swarm-result` - Retrieve swarm execution results

### 3. Database Schema Updates
- Add new collections for swarm tasks
- Add fields for swarm-specific metadata
- Maintain existing todo queue structure

## Testing Plan

### 1. Unit Tests
- Test SwarmSpec validation
- Test agent configuration handling
- Test swarm type validation
- Test schedule handling

### 2. Integration Tests
- Test swarm task creation
- Test swarm execution flow
- Test result retrieval
- Test error handling

### 3. End-to-End Tests
- Test complete swarm lifecycle
- Test interaction with worker nodes
- Test result submission
- Test audit verification

## Implementation Steps

1. **Schema Update**
   - Add SwarmSpec models
   - Update database schema
   - Add validation logic

2. **Endpoint Implementation**
   - Implement new swarm endpoints
   - Add request/response handlers
   - Implement error handling

3. **Testing**
   - Write unit tests
   - Write integration tests
   - Write end-to-end tests

4. **Documentation**
   - Update API documentation
   - Add example requests/responses
   - Document schema changes

## Migration Strategy
1. Deploy schema changes
2. Deploy new endpoints
3. Update worker nodes
4. Monitor for issues
5. Remove deprecated endpoints (if needed)

## Success Criteria
- All tests pass
- Backward compatibility maintained
- Swarm tasks execute successfully
- Results are properly stored and retrieved
- Error handling works as expected 