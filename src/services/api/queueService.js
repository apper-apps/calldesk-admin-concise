import queueData from '@/services/mockData/queues.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const queueService = {
  async getAll() {
    await delay(300);
    return [...queueData];
  },

  async getById(id) {
    await delay(200);
    const queue = queueData.find(queue => queue.Id === parseInt(id));
    if (!queue) {
      throw new Error('Queue not found');
    }
    return { ...queue };
  },

  async create(queueData) {
    await delay(500);
    const maxId = Math.max(...queueData.map(queue => queue.Id), 0);
    const newQueue = {
      Id: maxId + 1,
      ...queueData,
      waitingCalls: 0,
      avgWaitTime: 0,
      agents: []
    };
    queueData.push(newQueue);
    return { ...newQueue };
  },

  async update(id, updates) {
    await delay(400);
    const index = queueData.findIndex(queue => queue.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Queue not found');
    }
    queueData[index] = { ...queueData[index], ...updates };
    return { ...queueData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = queueData.findIndex(queue => queue.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Queue not found');
    }
    const deletedQueue = queueData.splice(index, 1)[0];
    return { ...deletedQueue };
  }
};