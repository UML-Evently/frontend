<script setup lang="ts">
import type { FormError } from '#ui/types'

definePageMeta({
  name: 'Inscription',
  layout: 'auth',
  middleware: 'no-auth'
})

function onSubmit(data: { username: string, email: string, password: string, password_confirmation: string }) {
  if (!validate(data).length) {
    loading.value = true
    useApi().auth.authControllerSignUp({ username: data.username, email: data.email, password: data.password }).then((success) => {
      if (success) {
        useUserStore().login(data.username, data.password).then(() => {
          navigateTo('/discover')
        })
      } else {
        error.value = 'Invalid username or password'
      }
    }).catch((e) => {
      error.value = e.error.message
    }).finally(() => {
      loading.value = false
    })
  } else {
    error.value = 'Please fill in the required fields'
  }
}

const validate = (state: { username: string, email: string, password: string, password_confirmation: string }) => {
  const errors: FormError[] = []
  if (!state.username) errors.push({ path: 'username', message: 'Username is required' })
  if (!state.email) errors.push({ path: 'email', message: 'Email is required' })
  if (!state.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.push({ path: 'email', message: 'Invalid email address' })
  if (!state.password) errors.push({ path: 'password', message: 'Password is required' })
  if ((state.password) && ((state.password.length < 8) || (state.password === state.password.toLowerCase()) || (state.password === state.password.toUpperCase()) || (!state.password.match(/[0-9]+/g)))) errors.push({ path: 'password', message: 'Your password doesn\'t meet the security requirements' })
  if (state.password !== state.password_confirmation) {
    errors.push({ path: 'password', message: 'Passwords do not match' })
    errors.push({ path: 'password_confirmation', message: 'Passwords do not match' })
  }
  if (!state.password_confirmation) errors.push({ path: 'password_confirmation', message: 'Password is required' })
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
    type: 'email',
    name: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    color: 'gray'
  },
  {
    type: 'password',
    name: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    color: 'gray'
  },
  {
    type: 'password',
    name: 'password_confirmation',
    label: 'Confirm Password',
    placeholder: 'Confirm your password',
    color: 'gray'
  }
]

const loading = ref(false)
</script>

<template>
  <div class="flex-1 flex flex-col items-center justify-center w-full">
    <UAuthForm
      title="Sign up"
      align="bottom"
      :fields="fields"
      :loading="loading"
      :validate="validate"
      :ui="{ base: 'text-center', footer: 'text-center' }"
      :submit-button="{ label: 'Sign up' }"
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
        />
      </template>
      <template #description>
        Already have an account? <NuxtLink
          to="/auth/login"
          class="text-primary font-medium"
        >Sign in</NuxtLink>.
      </template>
      <template #footer>
        <div>
          <p>Your password should be at least:</p>
          <ul>
            <li>8 characters long</li>
            <li>contain 1 uppercase letter</li>
            <li>contain 1 lowercase letter</li>
            <li>contain 1 number</li>
          </ul>
        </div>
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
