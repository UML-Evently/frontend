<script setup lang="ts">
const userStore = useUserStore()

const links = computed(() => {
  const l = []
  if (userStore.loggedIn) {
    l.push({
      label: 'Discover',
      to: '/discover'
    })
    l.push({
      label: 'Account',
      to: '/account'
    })
    l.push({
      label: 'My Events',
      to: '/my-events'
    })
  } else {
    l.push({
      label: 'Home',
      to: '/'
    })
  }
  return l
})

function logout() {
  userStore.logout()
  navigateTo('/')
}
</script>

<template>
  <UHeader
    title="Evently"
    :links="links"
  >
    <template #right>
      <template v-if="userStore.loggedIn">
        <UButton
          label="Log out"
          icon="mdi-logout"
          color="white"
          @click="logout"
        />
      </template>
      <template v-else>
        <UButton
          to="/auth/login"
          label="Sign in"
          icon="mdi-login"
          color="white"
        />
        <UButton
          to="/auth/register"
          label="Sign up"
          icon="mdi-account-plus"
        />
      </template>
    </template>
  </UHeader>
</template>

<style scoped>

</style>
