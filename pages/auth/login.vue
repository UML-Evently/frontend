<script setup lang="ts">
import type { FormError } from '#ui/types'

definePageMeta({
  name: 'Connexion',
  layout: 'auth',
  middleware: 'no-auth'
})

function onSubmit(data: { username: string, password: string }) {
  useUserStore().login(data.username, data.password).then((success) => {
    if (success) {
      navigateTo('/discover')
    } else {
      error.value = 'Invalid username or password'
    }
  })
}

const validate = (state: { username: string, password: string }) => {
  const errors: FormError[] = []
  if (!state.username) errors.push({ path: 'username', message: 'Username is required' })
  if (!state.password) errors.push({ path: 'password', message: 'Password is required' })
  return errors
}

const error = ref<string | null>(null)

const fields = [
  {
    type: 'text',
    name: 'username',
    label: 'Username',
    placeholder: 'Enter your username',
    color: 'gray'
  },
  {
    type: 'password',
    name: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    color: 'gray'
  }
]

const loading = ref(false)
</script>

<template>
  <div class="flex-1 flex flex-col items-center justify-center w-full">
    <UAuthForm
      title="Sign in"
      align="top"
      :fields="fields"
      :loading="loading"
      :validate="validate"
      :ui="{ base: 'text-center', footer: 'text-center' }"
      :submit-button="{ label: 'Sign in' }"
      @submit="onSubmit"
    >
      <template #validation>
        <UAlert
          v-if="error"
          color="red"
          variant="subtle"
          title="Error"
          :description="error"
          icon="i-heroicons-x-circle"
          class="mb-4"
        />
      </template>
      <template #description>
        Don't have an account? <NuxtLink
          to="/auth/register"
          class="text-primary font-medium"
        >Sign up</NuxtLink>.
      </template>
      <template #icon>
        <UColorModeImage
          light="/logo_black.png"
          dark="/logo_white.png"
          class="w-20 h-20 rounded-full mx-auto"
        />
      </template>
    </UAuthForm>
  </div>
</template>

<style scoped>

</style>
