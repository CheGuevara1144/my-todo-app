<script setup>
import { ref, computed, onMounted } from 'vue'; // Добавь onMounted
import { todos, newTask, addTask, removeTodo, count } from '../store.js';

const filter = ref('all');
const taskInput = ref(null); // Создаем ссылку для инпута

// Эта функция сработает сразу, как только страница "Задачи" откроется
onMounted(() => {
  taskInput.value?.focus(); 
});

const filteredTodos = computed(() => {
  if (filter.value === 'active') return todos.value.filter(t => !t.done);
  if (filter.value === 'done') return todos.value.filter(t => t.done);
  return todos.value;
});
</script>

<template>
<div class="flex justify-between items-end mb-6">
  <div>
    <h1 class="text-3xl font-black text-white">Мои задачи</h1>
    <p class="text-slate-500 text-sm font-medium">У вас {{ filteredTodos.length }} задач на сегодня</p>
  </div>
  <div class="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20">
    <span>{{ todos.filter(t => t.done).length }} / {{ todos.length }} готово</span>
  </div>

</div>
  <div class="space-y-6">
    <div class="flex gap-2">
      <input ref="taskInput" v-model="newTask" @keyup.enter="addTask" class="flex-1 bg-slate-900 border border-slate-600 rounded-xl px-4 py-3" placeholder="Что запланируем?">
      <button @click="addTask" class="bg-emerald-500 text-slate-900 font-bold px-6 rounded-xl">+</button>
    </div>
    
    <div class="flex bg-slate-900/50 p-1 rounded-lg">
      <button @click="filter = 'all'" :class="filter === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400'" class="flex-1 py-1 rounded-md text-sm">Все</button>
      <button @click="filter = 'active'" :class="filter === 'active' ? 'bg-slate-700 text-white' : 'text-slate-400'" class="flex-1 py-1 rounded-md text-sm">Активные</button>
      <button @click="filter = 'done'" :class="filter === 'done' ? 'bg-slate-700 text-white' : 'text-slate-400'" class="flex-1 py-1 rounded-md text-sm">Готово</button>
    </div>

    <TransitionGroup 
  name="list" 
  tag="ul" 
  class="space-y-2"
>
  <li 
    v-for="todo in filteredTodos" 
    :key="todo.id" 
    class="flex items-center gap-3 bg-slate-800/40 p-3 rounded-xl border border-slate-700/50"
  >
    <input 
  type="checkbox" 
  v-model="todo.done" 
  @change="count++" 
  class="w-5 h-5 accent-emerald-500"
>
    <span :class="{'line-through text-slate-500': todo.done}" class="flex-1 text-slate-200">
      {{ todo.text }}
    </span>
    <button @click="removeTodo(todo.id)" class="text-slate-500 hover:text-red-400">
      ✕
    </button>
  </li>
</TransitionGroup>
<div v-if="todos.length === 0" class="text-center py-16">
  <div class="text-6xl mb-4 animate-bounce">✨</div>
  <h3 class="text-slate-300 font-bold text-xl mb-1">Все дела сделаны!</h3>
  <p class="text-slate-500 text-sm">Добавьте новую задачу выше,<br>чтобы начать день продуктивно.</p>
</div>

<div v-if="todos.length === 0" class="text-center py-16">
  <div class="text-6xl mb-4 animate-bounce">✨</div>
  <h3 class="text-slate-300 font-bold text-xl mb-1">Все дела сделаны!</h3>
  <p class="text-slate-500 text-sm">Добавьте новую задачу выше,<br>чтобы начать день продуктивно.</p>
</div>
  </div>
</template>

<style scoped>
/* Плавность для всех изменений */
.list-enter-active,
.list-leave-active,
.list-move {
  transition: all 0.4s ease;
}

/* Состояние при появлении (выплывает справа) */
.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

/* Состояние при удалении (улетает влево) */
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Чтобы удаляемый элемент не "прыгал", а плавно исчезал */
.list-leave-active {
  position: absolute;
  width: 100%;
}
</style>
