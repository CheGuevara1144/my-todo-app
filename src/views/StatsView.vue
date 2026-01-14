<script setup>
import { computed } from 'vue';
import { todos, count, history, resetStorage } from '../store.js';

// 1. Считаем общее количество задач
const totalTodos = computed(() => todos.value.length);

// 2. Считаем только выполненные (у которых done === true)
const completedTodos = computed(() => todos.value.filter(t => t.done).length);

// 3. Вычисляем процент для полоски прогресса
const progressPercent = computed(() => {
  if (totalTodos.value === 0) return 0;
  return Math.round((completedTodos.value / totalTodos.value) * 100);
});
</script>

<template>
  <div class="text-center p-6 max-w-md mx-auto">
    <h2 class="text-slate-400 uppercase text-xs font-bold mb-2">Всего операций</h2>
    <div class="text-7xl font-black text-emerald-400 mb-10 drop-shadow-xl">
      {{ count }}
    </div>
    <div class="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 mb-6 backdrop-blur-sm">
  <div class="flex justify-between items-end mb-4">
    <div class="text-left">
      <h3 class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Прогресс задач</h3>
      <div class="text-2xl font-bold text-white">
        {{ completedTodos }} <span class="text-slate-500 text-lg">/ {{ totalTodos }}</span>
      </div>
    </div>
    <div class="text-right">
      <span class="text-3xl font-black text-emerald-400">{{ progressPercent }}%</span>
    </div>
  </div>

  <div class="w-full bg-slate-700 h-4 rounded-full overflow-hidden p-1 shadow-inner">
    <div 
      class="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(16,185,129,0.4)]"
      :style="{ width: progressPercent + '%' }"
    ></div>
  </div>
</div>
<div class="bg-slate-900/50 rounded-3xl p-6 border border-slate-700/50 mb-8 backdrop-blur-sm">
  <h3 class="text-left font-bold mb-4 text-slate-300 flex items-center gap-2">
    <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
    История действий
  </h3>

  <div class="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar text-left">
    <div v-for="(item, index) in history" :key="index"
      class="flex justify-between items-center text-sm text-slate-400 border-b border-slate-800/50 pb-2 last:border-0"
    >
      <div class="flex items-center gap-2">
        <span class="w-1.5 h-1.5 rounded-full" 
              :class="item.type === 'add' ? 'bg-emerald-500' : 'bg-rose-500'"></span>
        
        <span>{{ typeof item === 'object' ? item.message : item }}</span>
      </div>

      <span v-if="item.time" class="text-[10px] font-mono opacity-50 bg-slate-800 px-1.5 py-0.5 rounded">
        {{ item.time }}
      </span>
    </div>

    <p v-if="history.length === 0" class="text-slate-600 italic py-4 text-center">История пуста...</p>
  </div>
</div>

    <button 
      @click="resetStorage"
      class="w-full py-4 rounded-2xl border-2 border-dashed border-slate-700 text-slate-500 hover:border-red-500/50 hover:text-red-400 transition-all active:scale-95 font-medium"
    >
      🗑️ Очистить все данные
    </button>
  </div>
</template>