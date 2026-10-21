<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useEvents } from '@/composables/useEvents'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppModal from '@/components/ui/AppModal.vue'

const router = useRouter()

const {
  activeEvents,
  completedEvents,
  createEvent,
  completeEvent,
  deleteEvent
} = useEvents()

const currentTab = ref('active')
const isModalOpen = ref(false)
const selectedEvent = ref(null)
const modalAction = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const form = reactive({
  title: '',
  cat: 'Workshop',
  date: '',
  loc: '',
  quota: 100,
  price: 'Free',
  desc: ''
})

const handleOpenCompleteModal = (event) => {
  selectedEvent.value = event
  modalAction.value = 'complete'
  isModalOpen.value = true
}

const handleOpenDeleteModal = (event) => {
  selectedEvent.value = event
  modalAction.value = 'delete'
  isModalOpen.value = true
}

const handleConfirmModal = () => {
  if (!selectedEvent.value) return

  if (modalAction.value === 'complete') {
    completeEvent(selectedEvent.value.id)
  } else if (modalAction.value === 'delete') {
    deleteEvent(selectedEvent.value.id)
  }

  isModalOpen.value = false
  selectedEvent.value = null
}

const handleCancelModal = () => {
  isModalOpen.value = false
  selectedEvent.value = null
}

const formatEventDate = (dateTime) => {
  if (!dateTime) return ''

  const dateObj = new Date(dateTime)

  if (Number.isNaN(dateObj.getTime())) return dateTime

  const datePart = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  })

  const timePart = dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })

  return `${datePart}, ${timePart}`
}

const handleSubmitEvent = () => {
  if (
    !form.title.trim() ||
    !form.date ||
    !form.loc.trim() ||
    !form.desc.trim()
  ) {
    errorMessage.value = 'Please fill in all required fields.'
    successMessage.value = ''
    return
  }

  createEvent({
    title: form.title.trim(),
    cat: form.cat,
    date: formatEventDate(form.date),
    loc: form.loc.trim(),
    quota: form.quota,
    price: form.price,
    desc: form.desc.trim()
  })

  Object.assign(form, {
    title: '',
    cat: 'Workshop',
    date: '',
    loc: '',
    quota: 100,
    price: 'Free',
    desc: ''
  })

  errorMessage.value = ''
  successMessage.value = 'Event published successfully!'

  setTimeout(() => {
    successMessage.value = ''
    currentTab.value = 'active'
  }, 1000)
}
</script>

<template>
  <div class="event-management-page">
    <div class="page-header">
      <div>
        <h2>Event Management Control</h2>
        <p class="subtitle">
          Manage event lifecycle, publish new events, and archive completed ones.
        </p>
      </div>

      <AppButton
        variant="primary"
        @click="currentTab = 'create'"
      >
        + Create New Event
      </AppButton>
    </div>

    <div class="tabs-container">
      <button
        :class="['tab-btn', { active: currentTab === 'active' }]"
        @click="currentTab = 'active'"
      >
        Active Events ({{ activeEvents.length }})
      </button>

      <button
        :class="['tab-btn', { active: currentTab === 'create' }]"
        @click="currentTab = 'create'"
      >
        Create Event
      </button>

      <button
        :class="['tab-btn', { active: currentTab === 'completed' }]"
        @click="currentTab = 'completed'"
      >
        Completed Events ({{ completedEvents.length }})
      </button>
    </div>

    <!-- TAB ACTIVE EVENTS -->
    <div v-if="currentTab === 'active'">
      <div v-if="activeEvents.length > 0" class="events-grid">
        <AppCard
          v-for="item in activeEvents"
          :key="item.id"
          class="organizer-event-card"
        >
          <div class="card-header">
            <span class="category-badge">{{ item.cat }}</span>
            <span class="status-badge status-active">Active</span>
          </div>

          <h3 class="event-title">{{ item.title }}</h3>

          <p class="event-meta">
            📅 {{ item.date }} · 📍 {{ item.loc }}
          </p>

          <p class="event-meta">🎟️ {{ item.quota }} attendees</p>

          <p class="event-desc">{{ item.desc }}</p>

          <div class="card-actions">
            <button
              class="btn-action btn-view"
              @click="router.push(`/browse/events/${item.id}`)"
            >
              View Details
            </button>

            <button
              class="btn-action btn-complete"
              @click="handleOpenCompleteModal(item)"
            >
              Complete Event
            </button>

            <button
              class="btn-action btn-delete"
              @click="handleOpenDeleteModal(item)"
            >
              Delete
            </button>
          </div>
        </AppCard>
      </div>

      <AppCard v-else class="empty-state">
        <div class="empty-icon">📅</div>
        <h3>No Active Events</h3>
        <p>
          All events have ended or none have been created yet.
          Please create a new event.
        </p>

        <AppButton
          variant="primary"
          @click="currentTab = 'create'"
        >
          Create Event Now
        </AppButton>
      </AppCard>
    </div>

    <!-- TAB CREATE EVENT -->
    <div v-else-if="currentTab === 'create'" class="create-event-section">
      <AppCard class="create-card">
        <div class="create-header">
          <h3>Publish a New Event</h3>
          <p>
            Information entered here will be instantly published
            to the Gatherly public catalog.
          </p>
        </div>

        <p v-if="errorMessage" class="alert-error">
          {{ errorMessage }}
        </p>

        <p v-if="successMessage" class="alert-success">
          {{ successMessage }}
        </p>

        <form @submit.prevent="handleSubmitEvent">
          <div class="form-group">
            <label for="event-title">Event Title *</label>
            <input
              id="event-title"
              v-model="form.title"
              type="text"
              class="form-input"
              placeholder="e.g. Vue.js Mastery Workshop"
            />
          </div>

          <div class="form-group">
            <label for="event-category">Event Category *</label>
            <select
              id="event-category"
              v-model="form.cat"
              class="form-input"
            >
              <option value="Workshop">Workshop</option>
              <option value="Meetup">Meetup</option>
              <option value="Competition">Competition</option>
              <option value="Seminar">Seminar</option>
              <option value="Conference">Conference</option>
            </select>
          </div>

          <div class="form-group">
            <label for="event-date">Date & Time *</label>
            <input
              id="event-date"
              v-model="form.date"
              type="datetime-local"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="event-location">Event Location *</label>
            <input
              id="event-location"
              v-model="form.loc"
              type="text"
              class="form-input"
              placeholder="e.g. Jakarta Convention Center"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="event-quota">Attendee Quota</label>
              <input
                id="event-quota"
                v-model.number="form.quota"
                type="number"
                min="1"
                class="form-input"
                placeholder="100"
              />
            </div>

            <div class="form-group">
              <label for="event-price">Ticket Price</label>
              <input
                id="event-price"
                v-model="form.price"
                type="text"
                class="form-input"
                placeholder="Free / Rp 50.000"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="event-description">Event Description *</label>
            <textarea
              id="event-description"
              v-model="form.desc"
              rows="4"
              class="form-input"
              placeholder="Describe your event..."
            ></textarea>
          </div>

          <div class="form-actions">
            <AppButton variant="primary">
              Publish Event Now
            </AppButton>
          </div>
        </form>
      </AppCard>
    </div>

    <!-- TAB COMPLETED EVENTS -->
    <div v-else-if="currentTab === 'completed'">
      <div v-if="completedEvents.length > 0" class="events-grid">
        <AppCard
          v-for="item in completedEvents"
          :key="item.id"
          class="organizer-event-card card-completed"
        >
          <div class="card-header">
            <span class="category-badge">{{ item.cat }}</span>
            <span class="status-badge status-completed">Completed</span>
          </div>

          <h3 class="event-title">{{ item.title }}</h3>

          <p class="event-meta">
            📅 {{ item.date }} · 📍 {{ item.loc }}
          </p>

          <p class="event-desc">{{ item.desc }}</p>

          <div class="completed-notice">
            This event has been completed. Registration is closed.
          </div>

          <div class="card-actions">
            <button
              class="btn-action btn-view"
              @click="router.push(`/browse/events/${item.id}`)"
            >
              View Details
            </button>

            <button
              class="btn-action btn-delete"
              @click="handleOpenDeleteModal(item)"
            >
              Delete
            </button>
          </div>
        </AppCard>
      </div>

      <AppCard v-else class="empty-state">
        <div class="empty-icon">🏁</div>
        <h3>No Completed Events</h3>
        <p>Completed events will appear here.</p>
      </AppCard>
    </div>

    <AppModal
      :is-open="isModalOpen"
      :title="modalAction === 'complete' ? 'Complete Event?' : 'Delete Event?'"
      :message="
        modalAction === 'complete'
          ? 'This event will be marked as completed and removed from the public catalog. This action cannot be undone.'
          : 'Are you sure you want to permanently delete this event? This action cannot be undone.'
      "
      :confirm-text="modalAction === 'complete' ? 'Complete Event' : 'Delete Event'"
      cancel-text="Cancel"
      @confirm="handleConfirmModal"
      @close="handleCancelModal"
    />
  </div>
</template>

<style scoped>
.event-management-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-8);
  flex-wrap: wrap;
  gap: var(--space-4);
}

.page-header h2 {
  font-size: 2rem;
  color: var(--text-main);
  margin-bottom: var(--space-1);
}

.subtitle {
  color: var(--text-muted);
  font-size: 1rem;
}

.tabs-container {
  display: flex;
  gap: var(--space-3);
  border-bottom: 2px solid var(--border-color);
  margin-bottom: var(--space-8);
  padding-bottom: var(--space-2);
  flex-wrap: wrap;
}

.tab-btn {
  background: transparent;
  border: none;
  padding: var(--space-3) var(--space-6);
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.25s;
}

.tab-btn:hover {
  background-color: rgba(102, 68, 255, 0.08);
  color: var(--primary);
}

.tab-btn.active {
  background-color: var(--primary);
  color: white;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-12);
}

.organizer-event-card {
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
  gap: var(--space-2);
}

.category-badge,
.status-badge {
  padding: 4px 10px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
}

.category-badge {
  background: rgba(102, 68, 255, 0.1);
  color: var(--primary);
}

.status-active {
  background: rgba(46, 204, 113, 0.15);
  color: #219653;
}

.status-completed {
  background: rgba(108, 117, 125, 0.15);
  color: #6c757d;
}

.event-title {
  font-size: 1.3rem;
  color: var(--text-main);
  margin-bottom: var(--space-2);
}

.event-meta {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: var(--space-3);
}

.event-desc {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: var(--space-6);
  flex-grow: 1;
}

.card-completed {
  opacity: 0.85;
  background-color: #f8f9fa;
}

.completed-notice {
  background: #e9ecef;
  color: #6c757d;
  padding: var(--space-3);
  border-radius: 6px;
  font-size: 0.85rem;
  margin-bottom: var(--space-4);
}

.card-actions {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-color);
}

.btn-action {
  flex: 1;
  padding: var(--space-2) var(--space-3);
  border-radius: 6px;
  border: 1px solid var(--border-color);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  background: var(--bg-light);
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-view {
  color: var(--primary);
}

.btn-view:hover {
  background: rgba(102, 68, 255, 0.08);
  border-color: var(--primary);
}

.btn-complete {
  color: #16875d;
  border-color: rgba(22, 135, 93, 0.3);
}

.btn-complete:hover {
  background: #16875d;
  color: white;
}

.btn-delete {
  color: #e63946;
  border-color: rgba(230, 57, 70, 0.3);
}

.btn-delete:hover {
  background: #e63946;
  color: white;
}

.empty-state {
  text-align: center;
  padding: var(--space-12);
  background: var(--bg-light);
  border: 1px solid var(--border-color);
  border-radius: var(--space-4);
  margin-bottom: var(--space-12);
}

.empty-icon {
  font-size: 2.5rem;
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

.create-event-section {
  max-width: 800px;
  margin: 0 auto var(--space-12);
}

.create-card {
  padding: var(--space-8);
}

.create-header {
  margin-bottom: var(--space-6);
}

.create-header h3 {
  font-size: 1.5rem;
  margin-bottom: var(--space-1);
}

.create-header p {
  color: var(--text-muted);
  margin-bottom: 0;
}

.alert-error {
  background: #fff0f0;
  color: #c92a36;
  border: 1px solid #ffc9c9;
  padding: var(--space-3) var(--space-4);
  border-radius: 8px;
  margin-bottom: var(--space-6);
}

.alert-success {
  background: #e6fcf5;
  color: #087f5b;
  border: 1px solid #96f2d7;
  padding: var(--space-3) var(--space-4);
  border-radius: 8px;
  margin-bottom: var(--space-6);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
}

.form-group label {
  font-weight: 600;
  color: var(--text-main);
  font-size: 0.95rem;
}

.form-input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  color: var(--text-main);
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
}

.form-row {
  display: flex;
  gap: var(--space-5);
}

.form-row .form-group {
  flex: 1;
  min-width: 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-color);
}

@media (max-width: 768px) {
  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .create-card {
    padding: var(--space-4);
  }
}
</style>
