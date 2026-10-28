<template>
  <AppCard class="event-card-wrapper">
    <div class="event-body">
      <div class="event-meta">
        <span class="event-date">{{ event.date }}</span>
        <span class="event-category">{{ event.cat }}</span>
      </div>

      <!-- LENCANA "REGISTERED" PADA KATALOG UTAMA -->
      <div class="registration-status-slot">
        <span v-if="isRegistered" class="badge-registered">REGISTERED</span>
      </div>

      <h3 class="event-title">{{ event.title }}</h3>
      <p class="event-loc">{{ event.loc }}</p>
      <p class="event-desc">{{ event.desc }}</p>
      <div class="card-footer">
        <button class="btn-link" @click="$emit('view-detail', event.id)">
          View Event Details &rarr;
        </button>
      </div>
    </div>
  </AppCard>
</template>

<script setup>
import AppCard from '@/components/ui/AppCard.vue';

defineProps({
  event: {
    type: Object,
    required: true
  },
  isRegistered: {
    type: Boolean,
    default: false
  }
});

defineEmits(['view-detail']);
</script>

<style scoped>
.event-card-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.event-body {
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.event-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
  gap: var(--space-2);
}

.event-date {
  background: rgba(102, 68, 255, 0.1);
  color: var(--primary);
  padding: var(--space-1) var(--space-2);
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
}

.event-category {
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;
}

/* REGISTRATION STATUS SLOT - menjaga perataan tinggi card di grid */
.registration-status-slot {
  min-height: 24px;
  display: flex;
  align-items: center;
  margin-bottom: var(--space-2);
}

.badge-registered {
  display: inline-flex;
  align-items: center;
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #3b82f6;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1.2;
}

.event-title {
  margin-bottom: var(--space-2);
  font-size: 1.4rem;
  color: var(--text-main);
}

.event-loc {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin-bottom: var(--space-4);
}

.event-desc {
  color: var(--text-muted);
  line-height: 1.6;
  font-size: 0.95rem;
  margin-bottom: var(--space-6);
  flex-grow: 1;
}

.card-footer {
  border-top: 1px solid var(--border-color);
  padding-top: var(--space-4);
}

.btn-link {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-main);
  font-weight: 600;
  text-decoration: none;
  font-size: 1rem;
  padding: 0;
}

.btn-link:hover {
  color: var(--primary);
}
</style>
