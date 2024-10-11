<script setup lang="ts">
definePageMeta({
  name: 'My Account'
})

const userStore = useUserStore()

const createTagOpen = ref(false)
const newTag = ref('')

const changePasswordOpen = ref(false)
const currentPassword = ref('')
const newPassword = ref('')
const newPasswordConfirmation = ref('')
const changePasswordLoading = ref(false)

const tags = ref<string[]>([])
const participations = await useApi().participation.participationControllerGetAllUserParticipations()

const newEmail = ref(userStore.userInfo.email)
const showSaveEmail = ref(false)

tags.value = userStore.userInfo.preferences

async function deleteTag(tag: string) {
  tags.value = tags.value.filter(t => t !== tag)
  await useApi().user.userControllerUpdatePreferences({
    preferences: tags.value
  })
  await userStore.updateUserInfo()
}

async function saveNewTag() {
  if (newTag.value) {
    tags.value.push(newTag.value.toLowerCase())
    newTag.value = ''
    createTagOpen.value = false
    await useApi().user.userControllerUpdatePreferences({
      preferences: tags.value
    })
    await userStore.updateUserInfo()
  }
}

async function changePasswordCallback() {
  if (!currentPassword.value || !newPassword.value || !newPasswordConfirmation.value) {
    useToast().add({
      title: 'Error',
      description: 'Please fill all fields',
      color: 'red'
    })
    return
  }
  if (newPassword.value !== newPasswordConfirmation.value) {
    useToast().add({
      title: 'Error',
      description: 'Passwords do not match',
      color: 'red'
    })
    return
  }
  changePasswordLoading.value = true
  try {
    const { success } = await useApi().user.userControllerUpdatePassword({
      oldPassword: currentPassword.value,
      newPassword: newPassword.value
    })
    if (success) {
      useToast().add({
        title: 'Success',
        description: 'Password changed successfully',
        color: 'green'
      })
      changePasswordOpen.value = false
      currentPassword.value = ''
      newPassword.value = ''
      newPasswordConfirmation.value = ''
      changePasswordLoading.value = false
      useUserStore().logout()
      navigateTo('/auth/login')
    }
  } catch (e) {
    useToast().add({
      title: 'Error',
      description: e.error.message,
      color: 'red'
    })
    changePasswordLoading.value = false
  }
}

async function updateEmail() {
  try {
    await useApi().user.userControllerUpdateEmail({
      email: newEmail.value
    })
    showSaveEmail.value = false
    await userStore.updateUserInfo()
    useToast().add({
      title: 'Success',
      description: 'Email updated successfully',
      color: 'green'
    })
  } catch (e) {
    useToast().add({
      title: 'Error',
      description: e.error.message,
      color: 'red'
    })
  }
}

async function deleteAccount() {
  const { success } = await useApi().user.userControllerDeleteAccount()
  if (success) {
    useToast().add({
      title: 'Success',
      description: 'Account deleted successfully',
      color: 'green'
    })
    useUserStore().logout()
    navigateTo('/')
  }
}

onMounted(() => {
  userStore.updateUserInfo().then(() => {
    tags.value = userStore.userInfo.preferences
  })
})
</script>

<template>
  <div class="flex-1 py-4 flex flex-col items-center">
    <UAvatar
      size="3xl"
      :alt="userStore.userInfo.username"
    />
    <div class="w-full md:w-1/2 mx-auto mt-8">
      <UDashboardSection
        title="Username"
        description="Your username is used to authenticate you on the website"
      >
        <template #links>
          <p class="font-semibold mx-2">
            {{ userStore.userInfo.username }}
          </p>
        </template>
      </UDashboardSection>
      <UDashboardSection
        title="Email"
        description="Your email is used to send you notifications and updates"
      >
        <template #links>
          <UButtonGroup>
            <UInput
              v-model="newEmail"
              placeholder="Enter your email"
              class="w-72"
              @change="showSaveEmail = (newEmail !== userStore.userInfo.email)"
            />
            <UButton
              v-if="showSaveEmail"
              leading-icon="i-mdi-check"
              color="gray"
              @click="updateEmail()"
            />
          </UButtonGroup>
        </template>
      </UDashboardSection>
      <UDashboardSection
        title="Password"
        description="Change your password"
      >
        <template #links>
          <UButton
            icon="i-mdi-lock"
            color="white"
            @click="changePasswordOpen = true"
          >
            Change password
          </UButton>
        </template>
      </UDashboardSection>
      <UDashboardSection
        title="Theme"
        description="Customize the theme of the app"
      >
        <template #links>
          <UColorModeSelect />
        </template>
      </UDashboardSection>
      <UDashboardSection title="Tags">
        <template #description>
          <p>Your event tags preferences</p>
          <p>Click on a tag to remove it.</p>
        </template>
        <div class="flex items-center gap-2 flex-wrap">
          <UBadge
            v-for="(badge, index) in tags"
            :key="index"
            :label="badge"
            variant="subtle"
            class="cursor-pointer"
            @click="deleteTag(badge)"
          />
          <UButton
            icon="i-mdi-add"
            variant="soft"
            size="xs"
            @click="createTagOpen = true"
          />
        </div>
      </UDashboardSection>
      <UDashboardSection
        title="My participations"
        description="Find what events you're in!"
      >
        <ULandingGrid>
          <ParticipationCard
            v-for="participation in participations"
            :key="participation.id"
            :participation="participation"
          />
        </ULandingGrid>
      </UDashboardSection>
      <UDashboardSection
        title="Delete account"
        description="Delete your account permanently"
      >
        <template #links>
          <UButton
            icon="i-mdi-delete"
            color="red"
            @click="deleteAccount()"
          >
            Delete account
          </UButton>
        </template>
      </UDashboardSection>
    </div>
    <UDashboardModal
      v-model="createTagOpen"
      title="Add a tag"
      description="Add a new tag to your preferences"
      icon="i-mdi-add"
    >
      <UForm @submit.prevent="saveNewTag()">
        <UInput
          v-model="newTag"
          placeholder="Enter a tag"
        />
        <UButton
          type="submit"
          leading-icon="i-mdi-add"
          color="green"
          class="mt-4"
        >
          Add
        </UButton>
      </UForm>
    </UDashboardModal>
    <UDashboardModal
      v-model="changePasswordOpen"
      title="Change password"
      description="Change your password"
      icon="i-mdi-lock"
    >
      <UForm @submit.prevent="changePasswordCallback()">
        <UFormGroup label="Current password">
          <UInput
            v-model="currentPassword"
            placeholder="Current password"
            type="password"
          />
        </UFormGroup>
        <UFormGroup label="New password">
          <UInput
            v-model="newPassword"
            placeholder="New password"
            type="password"
          />
        </UFormGroup>
        <UFormGroup label="Confirm new password">
          <UInput
            v-model="newPasswordConfirmation"
            placeholder="Confirm new password"
            type="password"
          />
        </UFormGroup>
        <UButton
          type="submit"
          leading-icon="i-mdi-lock"
          color="green"
          class="mt-4"
          :loading="changePasswordLoading"
        >
          Change password
        </UButton>
      </UForm>
    </UDashboardModal>
  </div>
</template>

<style scoped></style>
