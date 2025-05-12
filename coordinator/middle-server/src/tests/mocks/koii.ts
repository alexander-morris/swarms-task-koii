export const getTaskStateInfo = async () => {
  return {
    success: true,
    data: {
      stake_list: {
        mockStakingKey1: true,
        mockStakingKey2: true
      }
    }
  };
};

// Mock nacl for testing
const mockNacl = {
  sign: {
    detached: (message: Uint8Array, secretKey: Uint8Array) => new Uint8Array(64),
    open: (signedMessage: Uint8Array, publicKey: Uint8Array) => new Uint8Array(32)
  }
};

export const Keypair = {
  generate: () => ({
    publicKey: {
      toBytes: () => new Uint8Array(32)
    },
    secretKey: new Uint8Array(64)
  })
};

// Export mock nacl for testing
export const nacl = mockNacl; 