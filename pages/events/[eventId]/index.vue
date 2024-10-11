<script setup lang="ts">
import type {
  EventResponseDto,
  ParticipationResponseDto
} from '~/composables/generated/Api'

definePageMeta({
  name: 'Event'
})

const route = useRoute()
const eventId = computed(() => route.params.eventId)

const event = ref<EventResponseDto>()
const participation = ref<ParticipationResponseDto>()
const loading = ref(true)

const joinButtonLoading = ref(false)

const device = useDevice()

const isAppleMobileDevice = computed(() => device.isMobileOrTablet && device.isIos)

const shareBtn = {
  label: 'Share event',
  icon: 'i-mdi-share-variant',
  click: () => {
    navigator.clipboard.writeText(window.location.href)
    useToast().add({
      title: 'Link copied',
      description: 'The event link has been copied to your clipboard',
      color: 'green'
    })
  },
  color: 'gray'
}

const links = computed(() => {
  if (!event.value) return []
  if (!participation.value || participation.value.status === 'cancelled') {
    if (event.value.type === 'public') return [
      {
        label: 'Join event',
        icon: 'i-mdi-arrow-right',
        click: async () => {
          joinButtonLoading.value = true
          participation.value = await useApi().participation.participationControllerCreateParticipation({
            eventId: eventId.value
          })
          joinButtonLoading.value = false
          useToast().add({
            title: 'Success',
            description: 'You have joined the event',
            color: 'green'
          })
        },
        loading: joinButtonLoading.value
      },
      shareBtn
    ]
    else return [
      {
        label: 'Request to join',
        icon: 'i-mdi-mailbox',
        click: async () => {
          joinButtonLoading.value = true
          participation.value = await useApi().participation.participationControllerRequestParticipation({
            eventId: eventId.value
          })
          joinButtonLoading.value = false
          useToast().add({
            title: 'Success',
            description: 'Your request to join the event has been sent',
            color: 'orange'
          })
        },
        loading: joinButtonLoading.value
      },
      shareBtn
    ]
  }
  if (participation.value.status === 'accepted') return [
    {
      label: 'Leave event',
      icon: 'i-mdi-arrow-left',
      color: 'red',
      click: async () => {
        joinButtonLoading.value = true
        await useApi().participation.participationControllerCancelParticipationRequest({
          eventId: eventId.value,
          participationId: participation.value._id
        })
        participation.value = undefined
        joinButtonLoading.value = false
        useToast().add({
          title: 'Success',
          description: 'You have left the event',
          color: 'red'
        })
      },
      loading: joinButtonLoading.value
    },
    shareBtn
  ]
  if (participation.value.status === 'pending') return [
    {
      label: 'Cancel request',
      icon: 'i-mdi-arrow-left',
      color: 'red',
      click: async () => {
        joinButtonLoading.value = true
        await useApi().participation.participationControllerCancelParticipationRequest({
          eventId: eventId.value,
          participationId: participation.value._id
        })
        participation.value = undefined
        joinButtonLoading.value = false
        useToast().add({
          title: 'Success',
          description: 'Your request to join the event has been cancelled',
          color: 'red'
        })
      },
      loading: joinButtonLoading.value
    },
    shareBtn
  ]
  if (participation.value.status === 'rejected') return [
    shareBtn
  ]
  return [shareBtn]
})

function parseDate(date: Date) {
  return (
    new Date(date).toLocaleDateString({
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    + ' '
    + new Date(date).toLocaleTimeString('en-CA', {
      hour: '2-digit',
      minute: '2-digit'
    })
  )
}

onMounted(async () => {
  try {
    event.value = await useApi().event.eventControllerGetEvent(eventId.value)
    participation.value = await useApi().participation.participationControllerGetParticipation(eventId.value)
    loading.value = false
  } catch (e) {
    console.error(e)
    navigateTo('/discover')
  }
})
</script>

<template>
  <div class="flex-1">
    <UButton
      class="hidden"
      color="red"
    /><!-- preload button -->
    <template v-if="!loading && event">
      <ULandingHero
        :title="event.name"
        :description="event.description"
        :links="links"
      >
        <template #description>
          <div>{{ event.description }}</div>
          <div class="flex justify-center mt-4 gap-2">
            <UBadge
              v-for="(tag, index) in event.tags"
              :key="index"
              :label="tag"
              variant="subtle"
              :ui="{ rounded: 'rounded-full' }"
            />
          </div>
        </template>
        <div class="flex flex-col items-center gap-8">
          <div
            class="flex items-center gap-1 mx-auto text-xl text-gray-500 dark:text-gray-400"
          >
            <UIcon name="i-mdi-calendar-month" />
            <p>
              {{ parseDate(event.startDate) }} - {{ parseDate(event.endDate) }}
            </p>
          </div>
          <ULink
            v-if="participation?.passkitToken && isAppleMobileDevice"
            target="_blank"
            :to="'https://evently-api.docsystem.xyz/participation/apple-passkit/' + participation.passkitToken"
            :external="true"
          >
            <NuxtImg
              src="/Add_to_Apple_Wallet.svg"
              class="h-12 cursor-pointer"
            />
          </ULink>
        </div>
      </ULandingHero>
    </template>
    <template v-else>
      <ULandingHero>
        <template #title>
          <USkeleton class="mx-16 h-20" />
        </template>
        <template #description>
          <div><USkeleton class="mx-32 h-4" /></div>
          <div class="flex justify-center mt-4 gap-2">
            <USkeleton
              v-for="i in 3"
              :key="i"
              class="h-6 w-20 rounded-full"
            />
          </div>
        </template>
        <template #links>
          <div class="flex justify-center gap-4">
            <USkeleton class="h-10 w-28" />
            <USkeleton class="h-10 w-28" />
          </div>
        </template>
      </ULandingHero>
    </template>
  </div>
</template>

<style scoped></style>
