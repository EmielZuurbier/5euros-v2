import { WorkerStore } from '@util'

const workerPath = window.__appData__.worker
const workerStore = new WorkerStore(workerPath)

export { workerStore }
