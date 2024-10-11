<script setup lang="ts">
import type { ParticipationResponseDto } from '~/composables/generated/Api'

const props = defineProps<{
  participation: ParticipationResponseDto
}>()

const { participation } = toRefs(props)

const STATUS_TEXTS = {
  accepted: 'Accepted',
  cancelled: 'Cancelled',
  pending: 'Pending',
  rejected: 'Rejected'
}

const STATUS_ICONS = {
  accepted: 'i-mdi-check',
  cancelled: 'i-mdi-close',
  pending: 'i-mdi-clock',
  rejected: 'i-mdi-close'
}

const event = await useApi().event.eventControllerGetEvent(participation.value.event._id)
</script>

<template>
  <ULandingCard
    class="col-span-4"
    :title="event.name"
    :description="event.description"
    :to="`/events/${event._id}`"
  >
    <div class="flex items-center gap-1">
      <UIcon :name="STATUS_ICONS[participation.status]" />
      <p>{{ STATUS_TEXTS[participation.status] }}</p>
    </div>
  </ULandingCard>
</template>

<style scoped>

</style>
