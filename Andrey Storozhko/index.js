window.onload = function() {
    var input = document.getElementById('todo-input');
    var add = document.getElementById('todo-add');
    var list = document.getElementById('todo-output');
    var clearIcon = document.getElementById('todo-clear');
    var filters = document.getElementById('todo-filters');
    var filterButtons = document.getElementsByClassName('filter__button');

    var calendar = datepicker('#todo-datepicker', {
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
            localStorage.myTasks = JSON.stringify({ todos: [], id: 1, filter: 'All' });
        }

        _todoList = JSON.parse(localStorage.myTasks);

        function addTask() {
            if(input.value !== '') {
                var datepicker = document.getElementById('todo-datepicker');
                _todoList.todos.push({ id: _todoList.id, task: input.value, checked: false, deadline: calendar.value });
                _todoList.id++;
                input.value = '';
                calendar.value = '';
                datepicker.value = '';
                _updateStorage();
                _switcher(_todoList.filter);
            } else {
                alert('You must enter some value!');
            }
        }

        function deleteTask(event) {
            if(event.target.className === 'task__remove-icon') {
                var element = event.target.parentNode;
                var id = +element.getAttribute('id');
                _todoList.todos.forEach(function(task, i) {
                    if(task.id === id) {
                        _todoList.todos.splice(i, 1);
                    }
                });
                _updateStorage();
                _switcher(_todoList.filter);
            }
        }

        function checkTask(event) {
            if(event.target.type === 'checkbox') {
                var element = event.target.parentNode;
                var id = +element.getAttribute('id');
                _todoList.todos.forEach(function(task) {
                    if(task.id === id) {
                        task.checked = !task.checked;
                    }
                });
            }
            _updateStorage();
            _switcher(_todoList.filter);
        }

        function loadTodoList() {
            _renderTasks();
        }

        function clearAllTasks() {
            var result = confirm('Do you want to delete all tasks?');
            if(result) {
                list.innerHTML = '';
                _todoList.todos = [];
                _todoList.id = 1;
                _updateStorage();
            }
        }

        function filterTodos(event) {
            var filter = event.target.innerHTML;
            _switcher(filter);
        }

        function _updateStorage() {
            localStorage.myTasks = JSON.stringify(_todoList);
        }

        function _sortByDate() {
            _todoList.todos.sort(function(firstTask, secondTask) {
                var firstDate = new Date(firstTask.deadline);
                var secondDate = new Date(secondTask.deadline);
                return firstDate - secondDate;
            });
            _updateStorage();
        }

        function _sortByCheck() {
            _todoList.todos.sort(function(firstTask, secondTask) {
                return firstTask.checked - secondTask.checked;
            });
            _updateStorage();
        }

        function _switcher(filter) {
            switch(filter) {
                case 'All':
                    _renderTasks(null, filter);
                    break;
                case 'Active':
                    var activeTodos = _todoList.todos.filter(function(item) {
                        return item.checked === false;
                    });
                    _renderTasks(activeTodos, filter);
                    break;
                case 'Completed':
                    var completedTodos = _todoList.todos.filter(function(item) {
                        return item.checked === true;
                    });
                    _renderTasks(completedTodos, filter);
                    break;
                case 'Tomorrow':
                    var tomorrowTodos = _todoList.todos.filter(function(item) {
                        var tomorrow = new Date().getDate() + 1;
                        return new Date(item.deadline).getDate() === tomorrow;
                    });
                    _renderTasks(tomorrowTodos, filter);
                    break;
                case 'Next week':
                    var nextWeekTodos = _todoList.todos.filter(function(item) {
                        var nextWeek = new Date().getWeek() + 1;
                        return new Date(item.deadline).getWeek() === nextWeek;
                    });
                    _renderTasks(nextWeekTodos, filter);
                    break;
                default:
                    break;
            }
        }

        function _renderTasks(data, filter) {
            var dataList = data || _todoList.todos;
            _todoList.filter = filter || 'All';
            _setButtonColor();
            _sortByDate();
            _sortByCheck();
            list.innerHTML = '';
            dataList.forEach(function(item) {
                var date = item.deadline ? new Date(item.deadline).toLocaleDateString() : '';
                var task = document.createElement('li');
                task.className = 'task';
                task.setAttribute('id', item.id);
                task.innerHTML = '<input type="checkbox" class="task__checkbox"><div class="task__deadline">' + date + '</div><p class="task__text">' + item.task + '</p><div class="task__remove-icon">&#x2718</div>';
                task.childNodes[0].checked = item.checked;
                list.appendChild(task);
                if(item.checked) {
                    var doneTask = document.getElementById(item.id);
                    doneTask.className = 'task task--checked';
                    doneTask.childNodes[0].checked = item.checked;
                }
            });
        }
        
        function _setButtonColor() {
            for(var i = 0; i < filterButtons.length; i++) {
                if(filterButtons[i].innerHTML === _todoList.filter) {
                    filterButtons[i].className = 'filter__button filter__button--active'
                } else {
                    filterButtons[i].className = 'filter__button'
                }
            }
        }

        return {
            addTask: addTask,
            deleteTask: deleteTask,
            checkTask: checkTask,
            loadTodoList: loadTodoList,
            clearAllTasks: clearAllTasks,
            filterTodos: filterTodos
        };
    })();

    Date.prototype.getWeek = function() {
        var date = new Date(this.getTime());
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
        var week1 = new Date(date.getFullYear(), 0, 4);
        return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    };

    document.addEventListener('keypress', function(key) {
        if(key.which === 13) {
            if(input.value !== '') {
                todo.addTask();
            }
        }
    });
    add.addEventListener('click', todo.addTask);
    list.addEventListener('click', todo.deleteTask);
    list.addEventListener('click', todo.checkTask);
    clearIcon.addEventListener('click', todo.clearAllTasks);
    filters.addEventListener('click', todo.filterTodos);

    todo.loadTodoList();
};
