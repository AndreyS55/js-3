window.onload = function() {
    var input = document.getElementById('todo-input');
    var add = document.getElementById('todo-add');
    var list = document.getElementById('todo-output');
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
        var _todoList = [];
        var _todoId = 1;

        function addTask() {
            if(input.value !== '') {
                var datepicker = document.getElementById('todo-datepicker');
                _todoList.push({id: _todoId, task: input.value, checked: false, deadline: calendar.value});
                _todoId++;
                input.value = '';
                calendar.value = '';
                datepicker.value = '';
                _renderTasks();
            } else {
                alert('You must enter some value!');
            }
        }

        function deleteTask(event) {
            if (event.target.className === 'task__remove-icon') {
                var element = event.target.parentNode;
                var id = +element.getAttribute('id');
                for (var i = 0; i < _todoList.length; i++) {
                    if (_todoList[i].id === id) {
                        _todoList.splice(i, 1);
                    }
                }
                _renderTasks();
            }
        }

        function checkTask(event) {
            if (event.target.type === 'checkbox') {
                var element = event.target.parentNode;
                var id = +element.getAttribute('id');
                for (var i = 0; i < _todoList.length; i++) {
                    if (_todoList[i].id === id) {
                        _todoList[i].checked = !_todoList[i].checked;
                    }
                }
            }
            _renderTasks();
        }

        function _renderTasks() {
            list.innerHTML = '';
            _todoList.forEach(function (item) {
                var date = item.deadline ? item.deadline.toLocaleDateString() : '';
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
            checkTask: checkTask
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
};
