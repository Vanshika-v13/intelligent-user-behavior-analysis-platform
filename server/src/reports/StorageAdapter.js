/**
 * Storage adapter abstraction for generated report artifacts.
 */
export class StorageAdapter {
  async save(_key, _buffer, _options = {}) {
    return {
      status: 'not_implemented',
      message: 'Storage adapter reserved for a later phase',
    }
  }

  async get(_key) {
    return null
  }

  async delete(_key) {
    return false
  }
}

export default StorageAdapter
