# Update Middle Server Tests

## Overview
This document outlines the plan to update the deprecated unit tests in the middle server to use the new swarms APIs.

## Tasks

- [ ] **Update Controller Tests**
  - [ ] Rewrite `createFetchAddPRTest.ts` to use `/api/swarm/jobs` endpoints.
  - [ ] Rewrite `createToDoTest.ts` to use `/api/swarm/jobs` endpoints.

- [ ] **Update Utility Tests**
  - [ ] Update `signTest.ts` to use the new signature verification function signature.

## Progress
- [x] Controller tests updated.
- [x] Utility tests updated. 