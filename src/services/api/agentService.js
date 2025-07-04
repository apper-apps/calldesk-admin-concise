import agentData from '@/services/mockData/agents.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const agentService = {
  async getAll() {
    await delay(300);
    return [...agentData];
  },

  async getById(id) {
    await delay(200);
    const agent = agentData.find(agent => agent.Id === parseInt(id));
    if (!agent) {
      throw new Error('Agent not found');
    }
    return { ...agent };
  },

  async create(agentData) {
    await delay(500);
    const maxId = Math.max(...agentData.map(agent => agent.Id), 0);
    const newAgent = {
      Id: maxId + 1,
      ...agentData,
      totalCalls: 0,
      avgHandleTime: 0,
      satisfaction: 0
    };
    agentData.push(newAgent);
    return { ...newAgent };
  },

  async update(id, updates) {
    await delay(400);
    const index = agentData.findIndex(agent => agent.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Agent not found');
    }
    agentData[index] = { ...agentData[index], ...updates };
    return { ...agentData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = agentData.findIndex(agent => agent.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Agent not found');
    }
    const deletedAgent = agentData.splice(index, 1)[0];
    return { ...deletedAgent };
  }
};