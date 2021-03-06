import Vue from 'vue'
import Vuex from 'vuex'

import { strict, APP_USER, APP_TOKEN } from 'src/app/support/index'
import { get } from 'src/app/infra/storage'

import state from 'src/app/infra/store/schema/state'
import mutations from 'src/app/infra/store/schema/mutations'

import * as actions from 'src/app/infra/store/schema/actions'
import * as getters from 'src/app/infra/store/schema/getters'

import modules from 'src/app/infra/store/schema/modules'

Vue.use(Vuex)

const AppStore = new Vuex.Store({state, mutations, actions, getters, modules, strict})

const user = get(APP_USER)
if (user) {
  // noinspection JSIgnoredPromiseFromCall
  AppStore.dispatch('setAuthUser', user)
}
const token = get(APP_TOKEN)
if (token) {
  // noinspection JSIgnoredPromiseFromCall
  AppStore.dispatch('setAuthToken', token)
}

export default AppStore
