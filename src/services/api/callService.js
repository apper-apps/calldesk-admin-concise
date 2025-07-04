import callData from '@/services/mockData/calls.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const callService = {
  async getAll() {
    await delay(300);
    return [...callData];
  },

  async getById(id) {
    await delay(200);
    const call = callData.find(call => call.Id === parseInt(id));
    if (!call) {
      throw new Error('Call not found');
    }
    return { ...call };
  },

async create(newCallData) {
    await delay(500);
    const maxId = Math.max(...callData.map(call => call.Id), 0);
    const newCall = {
      Id: maxId + 1,
      ...newCallData,
      timestamp: new Date().toISOString()
    };
    callData.push(newCall);
    return { ...newCall };
  },

  async update(id, updates) {
    await delay(400);
    const index = callData.findIndex(call => call.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Call not found');
    }
    callData[index] = { ...callData[index], ...updates };
    return { ...callData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = callData.findIndex(call => call.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Call not found');
    }
    const deletedCall = callData.splice(index, 1)[0];
    return { ...deletedCall };
  }
};