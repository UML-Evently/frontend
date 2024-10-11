<script setup lang="ts">
definePageMeta({
  name: 'Event Participants'
})

const route = useRoute()
const event = ref(await useApi().event.eventControllerGetEvent(route.params.eventId))
const participants = ref([])
const loading = ref(true)

const acceptButtonsLoading = ref<Record<string, boolean>>({})
const rejectButtonsLoading = ref<Record<string, boolean>>({})

const STATUS_TEXTS = {
  accepted: 'Accepted',
  cancelled: 'Cancelled',
  pending: 'Pending',
  rejected: 'Rejected'
}

const STATUS_COLORS = {
  accepted: 'green',
  cancelled: 'red',
  pending: 'orange',
  rejected: 'red'
}

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

async function acceptParticipant(participant) {
  acceptButtonsLoading.value[participant.user._id] = true
  await useApi().participation.participationControllerAcceptParticipationRequest({
    eventId: route.params.eventId,
    participationId: participant._id
  })
  participants.value = participants.value.map((p) => {
    if (p._id === participant._id) {
      p.status = 'accepted'
    }
    return p
  })
  acceptButtonsLoading.value[participant.user._id] = false
}

async function rejectParticipant(participant) {
  rejectButtonsLoading.value[participant.user._id] = true
  await useApi().participation.participationControllerRejectParticipationRequest({
    eventId: route.params.eventId,
    participationId: participant._id
  })
  participants.value = participants.value.map((p) => {
    if (p._id === participant._id) {
      p.status = 'rejected'
    }
    return p
  })
  rejectButtonsLoading.value[participant.user._id] = false
}

onMounted(() => {
  useApi().participation.participationControllerGetEventParticipations(route.params.eventId).then((data) => {
    participants.value = data
    loading.value = false
  })
})
</script>

<template>
  <div class="flex flex-col items-center">
    <p class="text-3xl font-bold mt-4">
      {{ event.name }}
    </p>
    <p class="text-lg font-medium text-gray-600 dark:text-gray-400 mt-2">
      Participants
    </p>
    <UTable
      class="w-full max-w-screen-xl mt-8"
      :loading="loading"
      :rows="participants"
      :columns="[
        { key: 'user.username', label: 'Username' },
        { key: 'email', label: 'Email' },
        { key: 'createdAt', label: 'Joined At' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Actions' }
      ]"
    >
      <template #email-data="{ row }">
        <ULink
          :to="'mailto:' + row.user.email"
          :external="true"
          class="text-blue-500 font-medium"
        >
          {{ row.user?.email }}
        </ULink>
      </template>
      <template #createdAt-data="{ row }">
        {{ parseDate(row.createdAt) }}
      </template>
      <template #status-data="{ row }">
        <UBadge
          :label="STATUS_TEXTS[row.status]"
          :color="STATUS_COLORS[row.status]"
        />
      </template>
      <template #actions-data="{ row }">
        <UButtonGroup>
          <UButton
            v-if="row.status === 'pending' || row.status === 'rejected'"
            color="green"
            icon="i-mdi-check"
            :loading="acceptButtonsLoading[row.user._id]"
            @click="acceptParticipant(row)"
          />
          <UButton
            v-if="row.status === 'pending'"
            color="red"
            icon="i-mdi-close"
            :loading="rejectButtonsLoading[row.user._id]"
            @click="rejectParticipant(row)"
          />
        </UButtonGroup>
      </template>
    </UTable>
  </div>
</template>

<style scoped>
/* Add any necessary styles here */
</style>
