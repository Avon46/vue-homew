<template>
    <section class="base-section">
        <header v-if="$slots.title || $slots.actions" class="base-section__header">
            <div class="base-section__title">
                <slot name="title" />
            </div>

            <div v-if="$slots.actions" class="base-section__actions">
                <slot name="actions" />
            </div>
        </header>

        <div class="base-section__content">
            <slot />
        </div>
    </section>
</template>

<style scoped>
.base-section {
    max-width: 1100px;
    margin: 0 auto;
    padding: 28px;
    border-radius: 16px;
    background: white;
    box-shadow: 0 8px 30px rgb(15 23 42 / 6%);
}

.base-section__header {
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
}

.base-section__actions {
    flex-shrink: 0;
}

.base-section__content {
    width: 100%;
}
</style>