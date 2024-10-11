<script setup lang="ts">
import type { EventResponseDto } from '~/composables/generated/Api'

definePageMeta({
  name: 'My Events'
})

const createEventModal = ref(false)
const createEventModalType = ref('create')
const createEventLoading = ref(false)
const eventsDeletingLoading = ref<Record<string, boolean>>({})

const editedEventId = ref<string | null>(null)
const newEventName = ref('')
const newEventDescription = ref('')
const newEventStartDate = ref('')
const newEventEndDate = ref('')
const newEventIsPublic = ref(false)
const newEventTagsString = ref<string>('')
const newEventTags = computed(() => newEventTagsString.value.split(',').map(tag => tag.toLowerCase().trim()))

const events = ref(await useApi().event.eventControllerGetAllUserEvents())

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

async function createNewEvent() {
  createEventLoading.value = true
  await useApi().event.eventControllerCreateEvent({
    name: newEventName.value,
    description: newEventDescription.value,
    startDate: newEventStartDate.value,
    endDate: newEventEndDate.value,
    type: newEventIsPublic.value ? 'public' : 'invite-only',
    tags: newEventTags.value
  })
  events.value = await useApi().event.eventControllerGetAllUserEvents()
  createEventModal.value = false
  newEventName.value = ''
  newEventDescription.value = ''
  newEventStartDate.value = ''
  newEventEndDate.value = ''
  newEventTagsString.value = ''
  newEventIsPublic.value = false
  createEventLoading.value = false
  useToast().add({
    title: 'Success',
    description: 'Event created successfully',
    color: 'green'
  })
}

async function editEvent() {
  createEventLoading.value = true
  await useApi().event.eventControllerEditEvent(editedEventId.value, {
    name: newEventName.value,
    description: newEventDescription.value,
    startDate: newEventStartDate.value,
    endDate: newEventEndDate.value,
    type: newEventIsPublic.value ? 'public' : 'invite-only',
    tags: newEventTags.value
  })
  events.value = await useApi().event.eventControllerGetAllUserEvents()
  createEventModal.value = false
  createEventModalType.value = 'create'
  editedEventId.value = null
  newEventName.value = ''
  newEventDescription.value = ''
  newEventStartDate.value = ''
  newEventEndDate.value = ''
  newEventTagsString.value = ''
  newEventIsPublic.value = false
  createEventLoading.value = false
  useToast().add({
    title: 'Success',
    description: 'Event edited successfully',
    color: 'green'
  })
}

function editEventModal(event: EventResponseDto) {
  editedEventId.value = event._id
  newEventName.value = event.name
  newEventDescription.value = event.description
  newEventStartDate.value = event.startDate
  newEventEndDate.value = event.endDate
  newEventTagsString.value = event.tags.join(', ')
  newEventIsPublic.value = event.type === 'public'
  createEventModal.value = true
  createEventModalType.value = 'edit'
}
</script>

<template>
  <div class="flex flex-col items-center">
    <h1 class="text-3xl font-bold mt-4">
      My Events
    </h1>
    <ULandingGrid class="mt-8">
      <UDashboardCard
        v-for="event in events"
        :key="event.id"
        :title="event.name"
        :description="event.description"
        class="col-span-4"
        :links="[
          {
            icon: 'i-mdi-eye',
            to: `/events/${event._id}`,
            color: 'gray'
          },
          {
            icon: 'i-mdi-people',
            to: `/events/${event._id}/participants`,
            color: 'green'
          },
          {
            icon: 'i-mdi-pencil',
            click: () => editEventModal(event),
            color: 'blue'
          },
          {
            icon: 'i-mdi-trash-can',
            click: async () => {
              eventsDeletingLoading[event._id] = true
              await useApi().event.eventControllerDeleteEvent(event._id);
              events = await useApi().event.eventControllerGetAllUserEvents();
              eventsDeletingLoading[event._id] = false
              useToast().add({
                title: 'Success',
                description: 'Event deleted successfully',
                color: 'red'
              })
            },
            color: 'red',
            loading: eventsDeletingLoading[event._id]
          }
        ]"
      >
        <div class="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <UIcon name="i-mdi-calendar-month" />
          <p>
            {{ parseDate(event.startDate) }} - {{ parseDate(event.endDate) }}
          </p>
        </div>
      </UDashboardCard>
      <UDashboardCard
        icon="i-mdi-plus"
        title="Create Event"
        description="Create a new event"
        class="col-span-4 cursor-pointer"
        @click="createEventModal = true"
      />
    </ULandingGrid>
    <UDashboardModal
      v-model="createEventModal"
      :title="createEventModalType === 'create' ? 'Create Event' : 'Edit Event'"
      :description="createEventModalType === 'create' ? 'Create a new event' : 'Edit an event'"
    >
      <UForm
        class="w-full flex flex-col gap-2"
        @submit.prevent="createEventModalType === 'create' ? createNewEvent() : editEvent()"
      >
        <UFormGroup label="Name">
          <UInput
            v-model="newEventName"
            placeholder="Name"
          />
        </UFormGroup>
        <UFormGroup label="Description">
          <UTextarea
            v-model="newEventDescription"
            placeholder="Description"
          />
        </UFormGroup>
        <UFormGroup label="Start Date">
          <UInput
            v-model="newEventStartDate"
            type="datetime-local"
          />
        </UFormGroup>
        <UFormGroup label="End Date">
          <UInput
            v-model="newEventEndDate"
            type="datetime-local"
          />
        </UFormGroup>
        <UFormGroup
          label="Tags"
          description="Enter tags separated by comma"
        >
          <UInput
            v-model="newEventTagsString"
            placeholder="tag1, tag2, tag3"
          />
        </UFormGroup>
        <UFormGroup label="Public">
          <UCheckbox v-model="newEventIsPublic" />
        </UFormGroup>
        <div class="flex flex-col items-center mt-2">
          <template v-if="createEventModalType === 'create'">
            <UButton
              type="submit"
              color="green"
              label="Create"
              leading-icon="i-mdi-check"
              :loading="createEventLoading"
            />
          </template>
          <template v-else>
            <UButton
              type="submit"
              color="blue"
              label="Edit"
              leading-icon="i-mdi-check"
              :loading="createEventLoading"
            />
          </template>
        </div>
      </UForm>
    </UDashboardModal>
  </div>
</template>

<style scoped>

</style>
