<script setup lang="ts">
interface AIModel {
  name: string
  url: string
  logo: string
  border?: boolean
  padding?: number
}

const { list } = defineProps<{
  list: AIModel[]
}>()
</script>

<template>
  <ul class="ai-models">
    <li v-for="item in list" :key="item.url" class="ai-model">
      <a :href="item.url" target="_blank" rel="noopener noreferrer" class="ai-model-link no-icon">
        <span
          class="logo" :class="{ border: item.border }" :style="{
            padding: item.padding ? `${item.padding}px` : undefined,
          }"
        >
          <img class="no-view" :src="item.logo" :alt="`${item.name} logo`" loading="lazy">
        </span>
        <span>{{ item.name }}</span>
      </a>
    </li>
  </ul>
</template>

<style scoped>
.ai-models {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 24px 14px;
  padding: 0;
  margin-top: 48px;
  list-style: none;
}

.ai-model {
  width: 90px;
  height: 100%;
  margin: auto;
  text-align: center;
}

@media (min-width: 640px) {
  .ai-models {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }

  .ai-model {
    width: 100px;
  }
}

.ai-model-link {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.ai-model-link .logo {
  display: block;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  overflow: hidden;
  background: var(--vp-c-bg);
  border-radius: 10px;
}

.ai-model-link .logo.border {
  border: 1px solid var(--vp-c-divider);
}

.ai-model-link .logo img {
  width: 100%;
}
</style>
