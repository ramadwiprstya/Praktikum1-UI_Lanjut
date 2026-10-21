<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEvents } from '@/composables/useEvents'
import EventCard from '@/components/event/EventCard.vue'
import SearchBar from '@/components/event/SearchBar.vue'
import CategoryFilter from '@/components/event/CategoryFilter.vue'
import AppButton from '@/components/ui/AppButton.vue'

const router = useRouter()

const { activeEvents } = useEvents()

const searchQuery = ref('')
const selectedCategory = ref('All')

const categories = [
  'All',
  'Workshop',
  'Meetup',
  'Competition',
  'Seminar',
  'Conference'
]

const filteredEvents = computed(() => {
  return activeEvents.value.filter((event) => {
    const keyword = searchQuery.value.toLowerCase()

    const matchSearch =
      event.title.toLowerCase().includes(keyword) ||
      event.loc.toLowerCase().includes(keyword)

    const matchCategory =
      selectedCategory.value === 'All' ||
      event.cat === selectedCategory.value

    return matchSearch && matchCategory
  })
})

const handleViewDetail = (id) => {
  router.push(`/browse/events/${id}`)
}
</script>

<template>
  <div class="event-list-page">
    <div class="header-section">
      <h2>Upcoming Events</h2>

      <p class="section-desc">
        Discover workshops, seminars, tech meetups, and competitions near you.
      </p>
    </div>

    <div class="filters-section">
      <SearchBar v-model="searchQuery" />

      <CategoryFilter
        :categories="categories"
        v-model="selectedCategory"
      />
    </div>

    <div
      v-if="filteredEvents.length > 0"
      class="event-grid"
    >
      <EventCard
        v-for="event in filteredEvents"
        :key="event.id"
        :event="event"
        @view-detail="handleViewDetail"
      />
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">📭</div>

      <h3>No Events Found</h3>

      <p>
        {{
          activeEvents.length === 0
            ? 'There are currently no active events. Be the first to publish a new event!'
            : 'No events match your search or selected category. Try another keyword or category.'
        }}
      </p>

      <AppButton
        v-if="activeEvents.length === 0"
        variant="primary"
        @click="router.push('/dashboard/events')"
      >
        Create New Event
      </AppButton>

      <button
        v-else
        class="btn-reset"
        @click="searchQuery = ''; selectedCategory = 'All'"
      >
        Reset Filters
      </button>
    </div>
  </div>
</template>

<style scoped>
.event-list-page {
  max-width: 1200px;
  margin: 0 auto;
}

.header-section {
  margin-bottom: var(--space-8);
}

.header-section h2 {
  font-size: 2.2rem;
  margin-bottom: var(--space-2);
  color: var(--text-main);
}

.section-desc {
  color: var(--text-muted);
  font-size: 1.1rem;
}

.filters-section {
  margin-bottom: var(--space-6);
}

.event-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-6);
}

.empty-state {
  text-align: center;
  padding: var(--space-12) var(--space-4);
  background: var(--bg-light);
  border: 1px solid var(--border-color);
  border-radius: var(--space-4);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: var(--space-3);
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: var(--space-2);
}

.empty-state p {
  color: var(--text-muted);
  margin-bottom: var(--space-6);
}

.btn-reset {
  padding: var(--space-3) var(--space-4);
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  background: white;
  color: var(--primary);
  border: 1px solid var(--primary);
}

.btn-reset:hover {
  background: rgba(102, 68, 255, 0.08);
}
</style>
