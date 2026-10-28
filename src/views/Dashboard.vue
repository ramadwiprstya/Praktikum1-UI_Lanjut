<script setup>
import { useRouter } from 'vue-router'
import { useEvents } from '@/composables/useEvents'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'

const router = useRouter()

const {
  events,
  totalEvents,
  activeEvents,
  completedEvents
} = useEvents()
</script>

<template>
  <div class="dashboard-overview">
    <div class="dashboard-head">
      <div>
        <h2>Organizer Analytics & Overview</h2>
        <p class="subtitle">
          Monitor real-time statistics and track status across all managed events.
        </p>
      </div>

      <AppButton
        variant="primary"
        @click="router.push('/dashboard/events')"
      >
        Manage Events →
      </AppButton>
    </div>

    <div class="metrics-grid">
      <AppCard class="metric-card">
        <div class="metric-label">Total Events</div>
        <div class="metric-value">{{ totalEvents }}</div>
        <p class="metric-hint">All recorded events</p>
      </AppCard>

      <AppCard class="metric-card">
        <div class="metric-label">Active Events</div>
        <div class="metric-value">{{ activeEvents.length }}</div>
        <p class="metric-hint">Live in public catalog</p>
      </AppCard>

      <AppCard class="metric-card">
        <div class="metric-label">Completed Events</div>
        <div class="metric-value">{{ completedEvents.length }}</div>
        <p class="metric-hint">Archived completed events</p>
      </AppCard>
    </div>

    <AppCard class="table-card">
      <div class="table-header">
        <div>
          <h3>Recent Events Status Overview</h3>
          <p class="table-subtitle">
            Master registry of all events managed across the Gatherly platform.
          </p>
        </div>

        <button
          class="btn-manage-link"
          @click="router.push('/dashboard/events')"
        >
          Open Event Management →
        </button>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Event Title</th>
              <th>Category</th>
              <th>Date & Location</th>
              <th>Quota</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="events.length === 0">
              <td colspan="5" class="empty-table">
                <div class="empty-icon">📅</div>
                <p>No events recorded in the system yet.</p>
                <AppButton
                  variant="primary"
                  @click="router.push('/dashboard/events')"
                >
                  Create First Event
                </AppButton>
              </td>
            </tr>

            <tr
              v-for="item in events"
              :key="item.id"
            >
              <td class="event-name">{{ item.title }}</td>
              <td>{{ item.cat }}</td>
              <td>{{ item.date }} · {{ item.loc }}</td>
              <td>{{ item.quota }} Pax</td>
              <td>
                <span
                  :class="[
                    'status-badge',
                    item.done ? 'status-completed' : 'status-active'
                  ]"
                >
                  {{ item.done ? 'Completed' : 'Active' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </AppCard>
  </div>
</template>

<style scoped>
.dashboard-overview {
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-8);
  flex-wrap: wrap;
  gap: var(--space-4);
}

.dashboard-head h2 {
  font-size: 2rem;
  color: var(--text-main);
  margin-bottom: var(--space-1);
}

.subtitle {
  color: var(--text-muted);
  font-size: 1rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.metric-card {
  padding: var(--space-6);
}

.metric-label {
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: var(--space-2);
}

.metric-value {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-main);
}

.metric-hint {
  color: var(--text-muted);
  margin-bottom: 0;
}

.table-card {
  padding: var(--space-6);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
  flex-wrap: wrap;
}

.table-header h3 {
  font-size: 1.3rem;
  color: var(--text-main);
  margin-bottom: var(--space-1);
}

.table-subtitle {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.btn-manage-link {
  background: none;
  border: none;
  color: var(--primary);
  cursor: pointer;
  font-weight: 600;
}

.btn-manage-link:hover {
  text-decoration: underline;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
}

.data-table th,
.data-table td {
  padding: var(--space-3) var(--space-4);
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.data-table th {
  background: var(--bg-light);
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
}

.event-name {
  font-weight: 600;
  color: var(--text-main);
}

.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-active {
  background: rgba(46, 204, 113, 0.15);
  color: #219653;
}

.status-completed {
  background: rgba(108, 117, 125, 0.15);
  color: #6c757d;
}

.empty-table {
  text-align: center !important;
  padding: var(--space-12) var(--space-4) !important;
  background: var(--bg-light);
}

.empty-icon {
  font-size: 2rem;
  margin-bottom: var(--space-2);
}

.empty-table p {
  color: var(--text-muted);
  margin-bottom: var(--space-4);
}

@media (max-width: 768px) {
  .dashboard-head {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
