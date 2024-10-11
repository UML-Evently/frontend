import { defineStore } from 'pinia'
import type { UserResponseDto } from '~/composables/generated/Api'

export const useUserStore = defineStore({
  id: 'user',
  state: () => {
    return {
      loggedIn: false,
      apiToken: null,
      userInfo: null
    } as {
      loggedIn: boolean
      apiToken: string | null
      userInfo: UserResponseDto | null
    }
  },
  persist: true,
  actions: {
    async login(username: string, password: string) {
      try {
        const { token } = await useApi().auth.authControllerSignIn({
          username,
          password
        })
        this.setLoggedIn(true)
        this.setApiToken(token)
        const userInfo = await useApi().user.userControllerGetUserInfos()
        this.setUserInfo(userInfo)
        return true
      } catch (e) {
        console.error(e)
        return false
      }
    },
    logout() {
      this.setUserInfo(null)
      this.setLoggedIn(false)
      this.setApiToken(null)
    },
    setUserInfo(userInfo: UserResponseDto | null) {
      this.userInfo = userInfo
    },
    setLoggedIn(loggedIn: boolean) {
      this.loggedIn = loggedIn
    },
    setApiToken(apiToken: string | null) {
      this.apiToken = apiToken
    },
    async updateUserInfo() {
      const userInfo = await useApi().user.userControllerGetUserInfos()
      this.setUserInfo(userInfo)
    }
  }
})
