import { useUserStore } from '~/stores/user'

export default defineNuxtRouteMiddleware((to, _from) => {
  const userStore = useUserStore()

  if (!userStore.loggedIn && to.meta.middleware !== 'no-auth') {
    return navigateTo('/auth/login')
  }
})
