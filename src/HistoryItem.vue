<script setup>
const props = defineProps(['info'])
// Объявляем, что этот компонент может генерировать событие 'remove'
const emit = defineEmits(['remove'])
</script>

<template>
  <li class="history-item">
    <b>{{ props.info.action }}</b>: результат {{ props.info.value }}
    <button @click="emit('remove')" class="delete-btn">x</button>
  </li>
</template>

<style scoped>
/* Добавим немного стиля для кнопки удаления */
.delete-btn {
  margin-left: 10px;
  background: none;
  border: 1px solid #ff4d4d;
  color: #ff4d4d;
  cursor: pointer;
  border-radius: 3px;
  padding: 0 5px;
}



</style>