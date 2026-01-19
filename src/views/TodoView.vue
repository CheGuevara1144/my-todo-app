<script setup>
import { ref, computed, onMounted } from 'vue'; // Добавь onMounted
import { todos, newTask, addTask, removeTodo, count } from '../store.js';

const selectedCategory = ref('🏠 Дом');
const filter = ref('all');
const taskInput = ref(null); // Создаем ссылку для инпута

// Эта функция сработает сразу, как только страница "Задачи" откроется
onMounted(() => {
  taskInput.value?.focus(); 
});
function addNewTodo() {
  if (newTask.value.trim() === '') return;

  // Мы передаем ссылку на инпут (taskInput) и значение категории
  addTask(taskInput, selectedCategory.value); 
  
  newTask.value = ''; // Очищаем поле ввода
  taskInput.value?.focus(); // Возвращаем фокус
}

const filteredTodos = computed(() => {
  let list = [...todos.value]; // Копируем массив, чтобы не менять оригинал напрямую

  // 1. Сначала применяем фильтр (Все / Активные / Готово)
  if (filter.value === 'active') {
    list = list.filter(t => !t.done);
  } else if (filter.value === 'done') {
    list = list.filter(t => t.done);
  }

  // 2. Умная сортировка: невыполненные (false) будут выше выполненных (true)
  // В JS: false (0) идет перед true (1) при обычной сортировке
  return list.sort((a, b) => a.done - b.done);
});

const getCategoryClass = (category) => {
  switch (category) {
    case '🏠 Дом': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case '💻 Работа': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case '📚 Учеба': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case '🎯 Личное': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    default: return 'bg-slate-700 text-slate-300';
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 sm:px-0 py-4 sm:py-8">
    
    <h2 class="text-3xl font-black text-white mb-2">Мои задачи</h2>
    <p class="text-slate-500 mb-6">У вас {{ todos.length }} задач на сегодня</p>

    <div class="flex flex-col gap-3 mb-8">
      <div class="flex flex-col sm:flex-row gap-2">
        <select v-model="selectedCategory" @change="taskInput.focus()" class="w-full sm:w-auto p-3 bg-slate-800 text-white border border-slate-700 rounded-xl text-base outline-none">
          <option value="🏠 Дом">🏠 Дом</option>
          <option value="💻 Работа">💻 Работа</option>
          <option value="📚 Учеба">📚 Учеба</option>
          <option value="🎯 Личное">🎯 Личное</option>
        </select>

        <div class="flex gap-2 w-full">
          <input ref="taskInput" v-model="newTask" @keyup.enter="addNewTodo" type="text" placeholder="Что нужно сделать?" class="flex-1 p-3 bg-slate-900/50 border border-slate-700 rounded-xl text-base focus:ring-2 focus:ring-emerald-500 outline-none min-w-0" />
          <button @click="addNewTodo" class="bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-6 rounded-xl font-bold transition-transform active:scale-95">+</button>
        </div>
      </div>
    </div>

    <div class="flex bg-slate-900/50 p-1 rounded-xl mb-6 overflow-x-auto">
      <button v-for="f in ['Все', 'Активные', 'Выполненные']" :key="f" @click="filter = f" :class="filter === f ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-white'" class="flex-1 py-2 px-4 rounded-lg font-bold transition-all capitalize">
        {{ f }}
      </button>
    </div>

    <TransitionGroup name="list" tag="ul" class="space-y-2">
      <li v-for="todo in filteredTodos" :key="todo.id" class="flex items-center gap-3 bg-slate-800/40 p-4 rounded-xl border border-white/5 shadow-lg">
        <input type="checkbox" v-model="todo.done" class="w-6 h-6 rounded-md accent-emerald-500" />
        <div class="flex flex-col sm:flex-row sm:items-center flex-1 min-w-0">
          <span :class="getCategoryClass(todo.category)" class="text-[10px] w-fit px-2 py-0.5 rounded-full border uppercase font-black mb-1 sm:mb-0 sm:mr-2">
            {{ todo.category }}
          </span>
          <span :class="{'line-through text-slate-500': todo.done}" class="text-white text-base truncate">
            {{ todo.text }}
          </span>
        </div>
        <button @click="removeTodo(todo.id)" class="p-2 text-slate-500 hover:text-red-400">✕</button>
      </li>
    </TransitionGroup>

    <div v-if="todos.length === 0" class="text-center py-16">
      <div class="text-6xl mb-4 animate-bounce">✨</div>
      <h3 class="text-slate-300 font-bold text-xl mb-1">Все дела сделаны!</h3>
      <p class="text-slate-500 text-sm">Добавьте новую задачу выше.</p>
    </div>

  </div> </template>

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
