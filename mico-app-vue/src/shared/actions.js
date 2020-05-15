function emptyAction () {
  console.warn('Current execute action is empty')
}

class Actions {
    actions = {
      onGlobalStateChange: emptyAction,
      setGlobalState: emptyAction
    }

    /**
     * 设置 actions
     */
    setActions (actions) {
      this.actions = actions
    }

    /**
     *  映射
     */
    onGlobalStateChange (...args) {
      return this.actions.onGlobalStateChange(...args)
    }

    /**
     *  映射
     */
    setGlobalState (...args) {
      return this.actions.setGlobalState(...args)
    }
}

const actions = new Actions()
export default actions
