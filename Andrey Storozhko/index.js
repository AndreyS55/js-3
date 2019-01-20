window.onload = function () {
    var input = document.getElementById('todo-input');
    var add = document.getElementById('todo-add');
    var list = document.getElementById('todo-output');
    var clearIcon = document.getElementById('todo-clear');

    var calendar = datepicker('#todo-datepicker', {
        formatter: (input, date) => {
            input.value = date.toLocaleDateString();
        },
        position: 'bl',
        overlayPlaceholder: 'Enter a year...',
        onSelect: function (instance) {
            calendar.value = instance.dateSelected;
        },
    });

    var todo = (function () {
        var _todoList;

        if (!localStorage.myTasks) {
            localStorage.myTasks = JSON.stringify({todos: [], id: 1});
        }

        _todoList = JSON.parse(localStorage.myTasks);

        function addTask() {
            if (input.value !== '') {
                var datepicker = document.getElementById('todo-datepicker');
                _todoList.todos.push({id: _todoList.id, task: input.value, checked: false, deadline: calendar.value});
                _todoList.id++;
                input.value = '';
                calendar.value = '';
                datepicker.value = '';
                _updateStorage();
                _renderTasks();
            } else {
                alert('You must enter some value!');
            }
        }

        function deleteTask(event) {
            if (event.target.className === 'task__remove-icon') {
                var element = event.target.parentNode;
                var id = +element.getAttribute('id');
                _todoList.todos.forEach(function (task, i) {
                    if (task.id === id) {
                        _todoList.todos.splice(i, 1);
                    }
                });
                _updateStorage();
                _renderTasks();
            }
        }

        function checkTask(event) {
            if (event.target.type === 'checkbox') {
                var element = event.target.parentNode;
                var id = +element.getAttribute('id');
                _todoList.todos.forEach(function (task) {
                    if (task.id === id) {
                        task.checked = !task.checked;
                    }
                });
            }
            _updateStorage();
            _renderTasks();
        }

        function loadTodoList() {
            _renderTasks();
        }

        function clearAllTasks() {
            list.innerHTML = '';
            _todoList.todos = [];
            _todoList.id = 1;
            _updateStorage();
        }

        function _updateStorage() {
            localStorage.myTasks = JSON.stringify(_todoList);
        }

        function _sortByDate() {
            _todoList.todos.sort(function (firstTask, secondTask) {
                var firstDate = new Date(firstTask.deadline);
                var secondDate = new Date(secondTask.deadline);
                return firstDate - secondDate;
            });
            _updateStorage();
        }

        function _sortByCheck() {
            _todoList.todos.sort(function (firstTask, secondTask) {
                return firstTask.checked - secondTask.checked;
            });
            _updateStorage();
        }

        function _renderTasks() {
            _sortByDate();
            _sortByCheck();
            list.innerHTML = '';
            _todoList.todos.forEach(function (item) {
                var date = item.deadline ? new Date(item.deadline).toLocaleDateString() : '';
                var task = document.createElement('li');
                task.className = 'task';
                task.setAttribute('id', item.id);
                task.innerHTML = '<div class="task__deadline">' + date + '</div><p class="task__text">' + item.task + '</p><input type="checkbox" class="task__checkbox"><div class="task__remove-icon">&#x2718</div>';
                task.childNodes[2].checked = item.checked;
                list.appendChild(task);
                if (item.checked) {
                    var doneTask = document.getElementById(item.id);
                    doneTask.className = 'task task--checked';
                    doneTask.childNodes[0].className = 'task__deadline task__deadline--checked';
                    doneTask.childNodes[1].className = 'task__text task__text--checked';
                    doneTask.childNodes[2].checked = item.checked;
                }
            });
        }

        return {
            addTask: addTask,
            deleteTask: deleteTask,
            checkTask: checkTask,
            loadTodoList: loadTodoList,
            clearAllTasks: clearAllTasks
        }
    })();

    document.addEventListener('keypress', function (key) {
        if (key.which === 13) {
            if (input.value !== '') {
                todo.addTask()
            }
        }
    });
    add.addEventListener('click', todo.addTask);
    list.addEventListener('click', todo.deleteTask);
    list.addEventListener('click', todo.checkTask);
    clearIcon.addEventListener('click', todo.clearAllTasks);

    todo.loadTodoList();
};
