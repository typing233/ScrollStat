import { createStory } from './models'

const STORAGE_KEY = 'scrollstat_stories'

export const storage = {
  getStories: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  },

  saveStories: (stories) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories))
  },

  getStory: (id) => {
    const stories = storage.getStories()
    return stories.find(s => s.id === id)
  },

  createStory: (title, description = '') => {
    const stories = storage.getStories()
    const newStory = createStory(title, description)
    stories.push(newStory)
    storage.saveStories(stories)
    return newStory
  },

  updateStory: (id, updates) => {
    const stories = storage.getStories()
    const index = stories.findIndex(s => s.id === id)
    if (index !== -1) {
      stories[index] = {
        ...stories[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      storage.saveStories(stories)
      return stories[index]
    }
    return null
  },

  deleteStory: (id) => {
    const stories = storage.getStories()
    const filtered = stories.filter(s => s.id !== id)
    storage.saveStories(filtered)
  },

  addDataset: (storyId, dataset) => {
    const story = storage.getStory(storyId)
    if (story) {
      story.datasets.push(dataset)
      storage.updateStory(storyId, { datasets: story.datasets })
      return dataset
    }
    return null
  },

  removeDataset: (storyId, datasetId) => {
    const story = storage.getStory(storyId)
    if (story) {
      story.datasets = story.datasets.filter(d => d.id !== datasetId)
      storage.updateStory(storyId, { datasets: story.datasets })
    }
  },

  addNode: (storyId, node) => {
    const story = storage.getStory(storyId)
    if (story) {
      story.nodes.push(node)
      story.nodes.sort((a, b) => a.position - b.position)
      storage.updateStory(storyId, { nodes: story.nodes })
      return node
    }
    return null
  },

  updateNode: (storyId, nodeId, updates) => {
    const story = storage.getStory(storyId)
    if (story) {
      const nodeIndex = story.nodes.findIndex(n => n.id === nodeId)
      if (nodeIndex !== -1) {
        story.nodes[nodeIndex] = {
          ...story.nodes[nodeIndex],
          ...updates
        }
        storage.updateStory(storyId, { nodes: story.nodes })
        return story.nodes[nodeIndex]
      }
    }
    return null
  },

  removeNode: (storyId, nodeId) => {
    const story = storage.getStory(storyId)
    if (story) {
      story.nodes = story.nodes.filter(n => n.id !== nodeId)
      storage.updateStory(storyId, { nodes: story.nodes })
    }
  }
}
