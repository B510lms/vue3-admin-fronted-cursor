<template>
  <div class="not-found">
    <img class="not-found__img" src="@/assets/images/404.png" alt="404" />
    <h1 class="not-found__title">页面走丢了</h1>
    <p class="not-found__desc">抱歉，你访问的页面不存在或已被移除。</p>
    <el-button type="primary" size="large" @click="$router.push('/')">返回首页</el-button>
  </div>
</template>

<style scoped lang="scss">
.not-found {
  width: 100%;
  height: 100%;
  display: flex;
  padding: 24px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 14px;
  background: var(--app-bg-color);

  &__img {
    width: min(560px, 88vw);
    max-height: 58vh;
    object-fit: contain;
    user-select: none;
  }

  &__title {
    font-size: 30px;
    line-height: 1.2;
    color: var(--app-text-color);
    font-weight: 700;
    margin: 0;
  }

  &__desc {
    margin: 0 0 8px;
    color: var(--el-text-color-secondary);
    font-size: 14px;
  }
}
</style>
