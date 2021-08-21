import actions from './actions'

/**
 * Listen to the onmessage event of the web worker and return a proper response.
 * @listens	onmessage
 * @param	{Event}
 * @returns	{void}
 */
self.onmessage = async ({ data }) => {
  const { action, payload } = data

  if (typeof actions[action] === 'undefined') {
    postMessage({
      action: 'error',
      payload: 'Action in worker is not defined'
    })

    return
  }

  const currentAction = actions[action]
  const result = await currentAction(payload)
  postMessage({
    action: action,
    payload: result
  })
}
