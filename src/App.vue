<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { name } from './store.js';
// 1. Состояние (State)
const newTask = ref('');
const filter = ref('all'); // Может быть 'all', 'active', 'done'
const todos = ref([]);

// 2. Вычисляемые свойства (Computed)
// Это самое важное — список сам пересчитывается при изменении фильтра или задач
const filteredTodos = computed(() => {
  if (filter.value === 'active') {
    return todos.value.filter(t => !t.done);
  } else if (filter.value === 'done') {
    return todos.value.filter(t => t.done);
  }
  return todos.value;
});

const totalTasks = computed(() => todos.value.length);
const completedTasks = computed(() => todos.value.filter(t => t.done).length);

// 3. Методы (Methods)
function addTask() {
  if (newTask.value.trim() === '') return;
  
  todos.value.push({
    id: Date.now(),
    text: newTask.value,
    done: false
  });
  
  newTask.value = ''; // Очищаем поле ввода
}

function removeTodo(id) {
  todos.value = todos.value.filter(t => t.id !== id);
}

// 4. Наблюдатели (Watchers) для автосохранения
watch(todos, (newTodos) => {
  localStorage.setItem('my-todos', JSON.stringify(newTodos));
}, { deep: true });

watch(name, (newName) => {
  localStorage.setItem('user-name', newName);
});

// 5. Загрузка данных (Lifecycle)
onMounted(() => {
  const savedName = localStorage.getItem('user-name');
  if (savedName) name.value = savedName;

  const savedTodos = localStorage.getItem('my-todos');
  if (savedTodos) {
    todos.value = JSON.parse(savedTodos);
  }
});
</script>

<template>
  <div class="min-h-screen bg-slate-900 py-8 px-4 text-slate-200">
    <div class="max-w-2xl mx-auto bg-slate-800 rounded-3xl shadow-2xl border border-slate-700">
      
      <header class="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-center rounded-t-3xl">
        <nav class="flex justify-center gap-4 mb-6">
          <router-link to="/" class="nav-link" active-class="active">Задачи</router-link>
          <router-link to="/stats" class="nav-link" active-class="active">Статистика</router-link>
        </nav>
        <h1 class="text-3xl font-bold text-white">
  Привет, 
  <input 
    v-model="name" 
    class="bg-transparent border-b border-white/30 focus:outline-none focus:border-white w-auto min-w-[100px] text-center transition-all"
    placeholder="твое имя"
  >!
</h1>
      </header>

      <main class="p-6">
        <router-view /> 
      </main>

    </div>
  </div>
</template>

<style scoped>
/* Анимации появления списка */
.list-enter-active, .list-leave-active { transition: all 0.3s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateX(20px); }

/* Плавный переход между роутами */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }


</style>