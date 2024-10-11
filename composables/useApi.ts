import type { RuntimeConfig } from 'nuxt/schema'
import { Api, type ApiConfig } from '~/composables/generated/Api'
import { useUserStore } from '~/stores/user'

export type FastifyError = {
  status: number
  error: { error: string, message: string }
}

export class ApiError extends Error {
  constructor(public status: number, public override message: string, public error?: { success: boolean, error: string }) {
    super(message)
  }
}

export const useApi = (_runtimeConfig: RuntimeConfig = useRuntimeConfig()) => {
  const userStore = useUserStore()

  const apiConfig: ApiConfig = {
    baseUrl: 'https://evently-api.docsystem.xyz',
    baseApiParams: {
      headers: {
        'Authorization': userStore.apiToken ? `Bearer ${userStore.apiToken}` : '',
        'Content-Type': 'application/json'
      }
    }
  }

  return new Api(apiConfig)
}
