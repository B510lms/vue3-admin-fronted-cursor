<template>
  <main class="main">
    <RouterView />
  </main>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.main {
  flex: 1;
  padding: 20px;
  background-color: var(--app-bg-color);
  overflow: auto;
}
</style>
