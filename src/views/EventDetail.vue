<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEvents } from '@/composables/useEvents'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'

const route = useRoute()
const router = useRouter()

const { getEventById } = useEvents()

const event = computed(() => getEventById(route.params.id))
</script>

<template>
  <div class="event-detail-page">
    <button
      class="btn-back"
      @click="router.push('/browse/events')"
    >
      ← Back to Events
    </button>

    <div v-if="event">
      <div class="detail-header">
        <div class="header-tags">
          <span class="event-tag">{{ event.cat }}</span>

          <span
            v-if="event.done"
            class="status-tag status-ended"
          >
            Event Finished
          </span>

          <span
            v-else
            class="status-tag status-live"
          >
            Open Registration
          </span>
        </div>

        <h1>{{ event.title }}</h1>

        <div class="meta-list">
          <div class="meta-item">
            📅 {{ event.date }}
          </div>

          <div class="meta-item">
            📍 {{ event.loc }}
          </div>

          <div class="meta-item">
            🎟️ Quota: {{ event.quota }} Attendees
          </div>
        </div>
      </div>

      <div class="grid-asymmetric">
        <div class="main-desc">
          <h2>About This Event</h2>

          <p class="description-text">
            {{ event.desc }}
          </p>
        </div>

        <div class="sidebar">
          <AppCard class="ticket-card">
            <h3>Attendee Registration</h3>

            <p class="price">{{ event.price || 'Free' }}</p>

            <p class="ticket-desc">
              {{
                event.done
                  ? 'This event has ended and registration is closed.'
                  : 'Secure your seat now before the quota is full.'
              }}
            </p>

            <AppButton
              v-if="!event.done"
              variant="primary"
              class="btn-register"
              @click="alert('Registration feature is not implemented yet.')"
            >
              Register Now
            </AppButton>

            <AppButton
              v-else
              variant="secondary"
              class="btn-register"
              disabled
            >
              Registration Closed
            </AppButton>

            <p v-if="!event.done" class="spots">
              Only {{ event.quota }} seats available!
            </p>
          </AppCard>
        </div>
      </div>
    </div>

    <AppCard v-else class="not-found-card">
      <div class="not-found-icon">🔎</div>
      <h2>404 - Event Not Found</h2>

      <p>
        The event you are looking for is unavailable
        or has been removed by the organizer.
      </p>

      <AppButton
        variant="primary"
        @click="router.push('/browse/events')"
      >
        Back to Event Catalog
      </AppButton>
    </AppCard>
  </div>
</template>

<style scoped>
.event-detail-page {
  max-width: 1200px;
  margin: 0 auto;
}

.btn-back {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: var(--space-6);
  color: var(--text-muted);
  font-weight: 500;
}

.btn-back:hover {
  color: var(--primary);
}

.detail-header {
  background: var(--bg-light);
  border: 1px solid var(--border-color);
  border-radius: var(--space-4);
  padding: var(--space-12) var(--space-8);
  margin-bottom: var(--space-8);
}

.detail-header h1 {
  font-size: 2.8rem;
  color: var(--text-main);
  margin-bottom: var(--space-4);
  line-height: 1.2;
}

.header-tags {
  display: flex;
  gap: var(--space-3);
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: var(--space-4);
}

.event-tag {
  background: rgba(102, 68, 255, 0.1);
  color: var(--primary);
  padding: var(--space-1) var(--space-4);
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.status-tag {
  padding: var(--space-1) var(--space-3);
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-live {
  background: rgba(46, 204, 113, 0.15);
  color: #219653;
}

.status-ended {
  background: rgba(108, 117, 125, 0.15);
  color: #6c757d;
}

.meta-list {
  display: flex;
  gap: var(--space-6);
  flex-wrap: wrap;
}

.meta-item {
  color: var(--text-muted);
  font-weight: 500;
}

.grid-asymmetric {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-12);
}

.main-desc h2 {
  border-left: 4px solid var(--primary);
  padding-left: var(--space-2);
  margin-bottom: var(--space-4);
}

.description-text {
  color: var(--text-muted);
  line-height: 1.85;
  margin-bottom: var(--space-6);
}

.ticket-card {
  padding: var(--space-8);
}

.ticket-card h3 {
  font-size: 1.5rem;
  margin-bottom: var(--space-2);
}

.price {
  font-size: 2.8rem;
  font-weight: 800;
  color: var(--primary);
  margin-bottom: var(--space-2);
}

.ticket-desc {
  color: var(--text-muted);
  margin-bottom: var(--space-6);
  line-height: 1.5;
}

.btn-register {
  width: 100%;
}

.spots {
  margin-top: var(--space-4);
  color: #e63946;
  font-weight: 600;
  font-size: 0.95rem;
}

.not-found-card {
  text-align: center;
  padding: var(--space-12);
  background: var(--bg-light);
  border-radius: var(--space-4);
  border: 1px solid var(--border-color);
}

.not-found-icon {
  font-size: 3rem;
  margin-bottom: var(--space-4);
}

.not-found-card h2 {
  margin-bottom: var(--space-2);
}

.not-found-card p {
  color: var(--text-muted);
  margin-bottom: var(--space-6);
}

@media (max-width: 900px) {
  .grid-asymmetric {
    grid-template-columns: 1fr;
  }

  .detail-header {
    padding: var(--space-8) var(--space-4);
  }

  .detail-header h1 {
    font-size: 2rem;
  }
}
</style>
