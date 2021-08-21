import { Store } from '@util'
import actions from './actions'
import mutations from './mutations'
import states from './states'

export default new Store('settings', {
  actions,
  mutations,
  states
})
