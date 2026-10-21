import { ref, computed, watch } from 'vue'

const events = ref(
  JSON.parse(localStorage.getItem('gatherly_events') || '[]')
)

watch(
  events,
  (newEvents) => {
    localStorage.setItem('gatherly_events', JSON.stringify(newEvents))
  },
  { deep: true }
)

export function useEvents() {
  const totalEvents = computed(() => events.value.length)

  const activeEvents = computed(() =>
    events.value.filter((event) => !event.done)
  )

  const completedEvents = computed(() =>
    events.value.filter((event) => event.done)
  )

  const createEvent = (eventData) => {
    const newEvent = {
      id: Date.now(),
      title: eventData.title,
      date: eventData.date,
      loc: eventData.loc,
      cat: eventData.cat,
      quota: Number(eventData.quota) || 100,
      price: eventData.price || 'Free',
      desc: eventData.desc,
      done: false
    }

    events.value.unshift(newEvent)
    return newEvent
  }

  const completeEvent = (id) => {
    const event = events.value.find((item) => item.id === id)

    if (event) {
      event.done = true
    }
  }

  const deleteEvent = (id) => {
    const index = events.value.findIndex((item) => item.id === id)

    if (index !== -1) {
      events.value.splice(index, 1)
    }
  }

  const getEventById = (id) => {
    return events.value.find((item) => item.id === Number(id))
  }

  return {
    events,
    totalEvents,
    activeEvents,
    completedEvents,
    createEvent,
    completeEvent,
    deleteEvent,
    getEventById
  }
}
