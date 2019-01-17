window.onload = function() {
    var input = document.getElementById('todo-input');
    var add = document.getElementById('todo-add');
    var list = document.getElementById('todo-output');
    var clearIcon = document.getElementById('todo-clear');

    var calendar =  datepicker('#todo-datepicker', {
        formatter: (input, date) => {
            input.value = date.toLocaleDateString();
        },
        position: 'bl',
        overlayPlaceholder: 'Enter a year...',
        onSelect: function(instance) {
            calendar.value = instance.dateSelected;
        },
    });

    var todo = (function() {
        var _todoList;

        if(!localStorage.myTasks) {
            localStorage.myTasks = JSON.stringify({todos: [], id: 1});
        }

        _todoList = JSON.parse(localStorage.myTasks);

        function addTask() {
            if(input.value !== '') {
                var datepicker = document.getElementById('todo-datepicker');
                _todoList.todos.push({id: _todoList.id, task: input.value, checked: false, deadline: datepicker.value});
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
                _todoList.todos.forEach(function(task, i) {
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
                _todoList.todos.forEach(function(task) {
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
        
        function clearLocalStorage() {
            list.innerHTML = '';
            localStorage.removeItem('myTasks');
            localStorage.clear();
        }

        function _updateStorage() {
            localStorage.myTasks = JSON.stringify(_todoList);
        }

        function _sortByDate() {
            _todoList.todos.sort(function(firstDate, secondDate) {
                return firstDate.deadline - secondDate.deadline;
            });
            _updateStorage();
        }
        
        function _sortByCheck() {
            _todoList.todos.sort(function(firstCheck, secondCheck) {
                return firstCheck.checked - secondCheck.checked;
            });
            _updateStorage();
        }

        function _renderTasks() {
            _sortByDate();
            _sortByCheck();
            list.innerHTML = '';
            _todoList.todos.forEach(function (item) {
                var date = item.deadline ? item.deadline : '';
                var task = document.createElement('li');
                task.className = 'task';
                task.setAttribute('id', item.id);
                task.innerHTML = '<div class="task__status"></div><div class="task__deadline">' + date + '</div><p class="task__text">' + item.task + '</p><input type="checkbox" class="task__checkbox"><div class="task__remove-icon">&#x2718</div>';
                task.childNodes[2].checked = item.checked;
                list.appendChild(task);
                if (item.checked) {
                    var doneTask = document.getElementById(item.id);
                    doneTask.childNodes[0].innerHTML = '&#10004';
                    doneTask.childNodes[1].className = "task__deadline task__deadline--checked";
                    doneTask.childNodes[2].className = "task__text task__text--checked";
                    doneTask.childNodes[3].checked = item.checked;
                }
            });
        }

        return {
            addTask: addTask,
            deleteTask: deleteTask,
            checkTask: checkTask,
            loadTodoList: loadTodoList,
            clearLocalStorage: clearLocalStorage
        }
    })();

    document.addEventListener('keypress', function(key) {
        if(key.which === 13) {
            if(input.value !== '') {
                todo.addTask()
            }
        }
    });
    input.addEventListener('keypress', function(key) {
        if(key.which === 13) {
            todo.addTask()
        }
    });
    add.addEventListener('click', todo.addTask);
    list.addEventListener('click', todo.deleteTask);
    list.addEventListener('click', todo.checkTask);
    clearIcon.addEventListener('click', todo.clearLocalStorage);

    todo.loadTodoList();
};
