export const mapState = stateList => {
  const obj = {}
  for (let i = 0; i < stateList.length; i++) {
    let stateName = stateList[i]
    obj[stateName] = function() {
      return this.$store.state[stateName]
    }
  }
  return obj
}

export const mapGetters = getterList => {
  const obj = {}
  for (let i = 0; i < getterList.length; i++) {
    let getterName = getterList[i]
    obj[getterName] = function() {
      return this.$store.getters[getterName]
    }
  }
  return obj
}

export const mapMutations = mutationList => {
  const obj = {}
  for (let i = 0; i < mutationList.length; i++) {
    let type = mutationList[i]
    obj[type] = function(payload) {
      return this.$store.commit(type, payload)
    }
  }
  return obj
}

export const mapActions = actionList => {
  const obj = {}
  for (let i = 0; i < actionList.length; i++) {
    let type = actionList[i]
    obj[type] = function(payload) {
      return this.$store.dispatch(type, payload)
    }
  }
  return obj
}
