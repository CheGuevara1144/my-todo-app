import { ref, watch } from "vue";

// Инициализируем данные из localStorage или ставим значения по умолчанию
export const name = ref(localStorage.getItem("user-name") || "Сергей");
export const todos = ref(JSON.parse(localStorage.getItem("my-todos")) || []);
export const history = ref(
  JSON.parse(localStorage.getItem("my-history")) || []
);
export const count = ref(parseInt(localStorage.getItem("my-count")) || 0);
export const newTask = ref("");

// Вспомогательная функция для получения времени
const getTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export const addTask = (inputRef, category = "🏠 Дом") => {
  // Добавили category
  if (newTask.value.trim() === "") return;

  const todoText = newTask.value;

  todos.value.push({
    id: Date.now(),
    text: todoText,
    category: category, // КЛЮЧЕВОЙ МОМЕНТ: сохраняем выбранную категорию
    done: false,
  });

  newTask.value = "";
  count.value++;

  // ВОТ ЭТА СТРОКА ОЖИВЛЯЕТ АВТОФОКУС:
  inputRef?.focus();

  history.value.unshift({
    message: `Добавлена задача: ${todoText}`,
    time: getTime(),
    type: "add",
  });
};

export const removeTodo = (id) => {
  // 1. Сначала находим задачу в массиве по её ID
  const todo = todos.value.find((t) => t.id === id);

  if (!todo) return;

  // 2. Если задача НЕ выполнена, спрашиваем подтверждение
  if (!todo.done) {
    const confirmed = confirm(
      `Задача "${todo.text}" ещё не выполнена. Всё равно удалить?`
    );
    if (!confirmed) return; // Если нажали "Отмена", прерываем функцию
  }

  // 3. Если мы здесь, значит либо задача выполнена, либо пользователь нажал "ОК"
  todos.value = todos.value.filter((t) => t.id !== id);

  // Увеличиваем счетчик операций
  count.value++;

  // Записываем в историю
  history.value.unshift({
    message: `Удалена задача: ${todo.text}`,
    time: getTime(),
    type: "delete",
  });
};

export const resetStorage = () => {
  if (
    confirm(
      "Вы уверены, что хотите полностью очистить задачи, статистику и историю?"
    )
  ) {
    todos.value = [];
    count.value = 0;
    history.value = [];
    localStorage.clear();
    location.reload(); // Перезагрузим, чтобы всё обнулилось чисто
  }
};

// Следим за всеми изменениями и сохраняем их
watch(
  [todos, history, name, count],
  () => {
    localStorage.setItem("my-todos", JSON.stringify(todos.value));
    localStorage.setItem("my-history", JSON.stringify(history.value));
    localStorage.setItem("user-name", name.value);
    localStorage.setItem("my-count", count.value.toString());
  },
  { deep: true }
);
