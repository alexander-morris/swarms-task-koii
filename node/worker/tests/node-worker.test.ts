import { describe, beforeAll, afterAll, beforeEach, test, expect } from '@jest/globals';
import { getConfig } from '../src/orcaSettings';
import { task } from '../src/task/1-task';
import { submission } from '../src/task/2-submission';
import { namespaceWrapper } from '@_koii/namespace-wrapper';

// Mock environment variables
process.env.ANTHROPIC_API_KEY = 'test-api-key';
process.env.GITHUB_TOKEN = 'test-github-token';
process.env.GITHUB_USERNAME = 'test-github-username';

// Mock PublicKey class
class MockPublicKey {
  constructor(private key: string) {}
  toBase58() { return this.key; }
  equals(other: any) { return this.key === other.key; }
  toJSON() { return this.key; }
  toBytes() { return new Uint8Array(32); }
  toBuffer() { return Buffer.from(this.key); }
  encode() { return this.key; }
}

// Mock Keypair class
class MockKeypair {
  publicKey: MockPublicKey;
  secretKey: Uint8Array;
  _keypair: any;

  constructor(publicKey: string) {
    this.publicKey = new MockPublicKey(publicKey);
    this.secretKey = new Uint8Array(32);
    this._keypair = { publicKey: this.publicKey, secretKey: this.secretKey };
  }
}

describe('Node Worker Integration Tests', () => {
  let config: Awaited<ReturnType<typeof getConfig>>;

  beforeAll(async () => {
    // Initialize configuration
    config = await getConfig();
  });

  test('Configuration loading', async () => {
    expect(config).toBeDefined();
    expect(config.imageURL).toBeDefined();
    expect(config.customPodSpec).toBeDefined();
    expect(config.timeout).toBeGreaterThan(0);
  });

  test('Task execution', async () => {
    // Mock namespaceWrapper.storeGet
    const mockStoreGet = jest.spyOn(namespaceWrapper, 'storeGet');
    mockStoreGet.mockImplementation(async (key: string) => {
      if (key === 'shouldMakeSubmission') return 'true';
      if (key === 'swarmBountyId') return 'test-bounty-123';
      return null;
    });

    // Execute task
    await expect(task(1)).resolves.not.toThrow();
  });

  test('Submission process', async () => {
    // Mock namespaceWrapper.storeGet
    const mockStoreGet = jest.spyOn(namespaceWrapper, 'storeGet');
    mockStoreGet.mockImplementation(async (key: string) => {
      if (key === 'shouldMakeSubmission') return 'true';
      if (key === 'swarmBountyId') return 'test-bounty-123';
      return null;
    });

    // Mock namespaceWrapper.getSubmitterAccount
    const mockGetSubmitterAccount = jest.spyOn(namespaceWrapper, 'getSubmitterAccount');
    mockGetSubmitterAccount.mockResolvedValue(new MockKeypair('test-staking-key') as any);

    // Mock namespaceWrapper.getMainAccountPubkey
    const mockGetMainAccountPubkey = jest.spyOn(namespaceWrapper, 'getMainAccountPubkey');
    mockGetMainAccountPubkey.mockResolvedValue('test-public-key');

    // Execute submission
    await expect(submission(1)).resolves.not.toThrow();
  });

  test('Pre-run checks', async () => {
    // Mock namespaceWrapper.storeGet
    const mockStoreGet = jest.spyOn(namespaceWrapper, 'storeGet');
    mockStoreGet.mockImplementation(async (key: string) => {
      if (key === 'shouldMakeSubmission') return 'false';
      return null;
    });

    // Execute submission with shouldMakeSubmission set to false
    await expect(submission(1)).resolves.toBeUndefined();
  });

  afterAll(() => {
    // Restore all mocks
    jest.restoreAllMocks();
  });
}); 