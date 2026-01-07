<template>
  <section class="hero-shell">
    <div class="hero-copy">
      <p class="eyebrow">{{ eyebrow }}</p>
      <h1>{{ title }}</h1>
      <p class="subtitle">
        {{ subtitle }}
      </p>
      <div class="hero-actions">
        <a-button
          type="primary"
          size="large"
          shape="round"
          v-if="primaryCta"
          @click="primaryCta.onClick?.()"
        >
          {{ primaryCta.label }}
        </a-button>
        <a-button size="large" shape="round" ghost v-if="secondaryCta">
          {{ secondaryCta.label }}
        </a-button>
      </div>
    </div>
    <div class="hero-visual">
      <slot name="visual" />
    </div>
  </section>
</template>

<script setup lang="ts">
interface CtaProps {
  label: string
  onClick?: () => void
}

defineProps<{
  eyebrow: string
  title: string
  subtitle: string
  primaryCta?: CtaProps
  secondaryCta?: CtaProps
}>()
</script>

<style scoped>
.hero-shell {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 24px 60px rgba(16, 31, 48, 0.08);
  padding: 48px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 40px;
  align-items: center;
}

.hero-copy {
  max-width: 560px;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--swarma-primary);
  font-size: 12px;
  margin-bottom: 12px;
}

h1 {
  font-size: clamp(38px, 4vw, 52px);
  margin: 0 0 12px;
  color: var(--swarma-text-title);
}

.subtitle {
  color: var(--swarma-text-secondary);
  line-height: 1.7;
  margin-bottom: 24px;
  font-size: 16px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.hero-visual {
  min-height: 240px;
  border-radius: 20px;
  background: linear-gradient(135deg, #f5f8ff, #fdfdfd);
  border: 1px solid rgba(24, 144, 255, 0.2);
  padding: 32px;
  position: relative;
  overflow: hidden;
  color: var(--swarma-text-title);
}

@media (max-width: 768px) {
  .hero-shell {
    padding: 32px;
  }
}
</style>

