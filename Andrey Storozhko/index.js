(function todo() {
    var form = document.getElementById('todo-form');
    var input = document.getElementById('todo-input');
    var list = document.getElementById('todo-output');

    var store = (function () {
        var todoList = [];
        var id = 1;

        var addTodo = function (todo) {
            todoList.push({id: id, todo: todo, checked: false});
            id++;
            console.log(todoList);
        };

        var getTodos = function () {
            return todoList;
        };

        var editTodo = function (id) {
            for (var i = 0; i < todoList.length; i++) {
                if (todoList[i].id == id) {
                    todoList[i].checked = !todoList[i].checked;
                }
            }
        };

        var removeTodo = function (id) {
            for (var i = 0; i < todoList.length; i++) {
                if (todoList[i].id == id) {
                    todoList.splice(i, 1);
                }
            }
        };

        return {
            addTodo: addTodo,
            getTodos: getTodos,
            editTodo: editTodo,
            removeTodo: removeTodo
        };
    })();

    var view = (function (store) {
        var todos = store.getTodos();
        var render = function () {
            list.innerHTML = '';
            input.value = '';
            todos.forEach(function (item) {
                var li = document.createElement('li');
                var text = document.createElement('p');
                var checkbox = document.createElement('input');
                var removeDiv = document.createElement('div');
                li.id = item.id;
                li.className = 'task';
                text.innerHTML = item.todo;
                text.className = 'task__text';
                checkbox.type = 'checkbox';
                checkbox.className = 'task__checkbox';
                checkbox.checked = item.checked;
                removeDiv.innerHTML = '&#x2718';
                removeDiv.className = 'task__remove-icon';
                li.insertAdjacentElement('beforeend', text);
                li.insertAdjacentElement('beforeend', checkbox);
                li.insertAdjacentElement('beforeend', removeDiv);
                list.appendChild(li);
                if (item.checked) {
                    var newLi = document.getElementById(item.id);
                    newLi.childNodes[0].className = "task__text task__text--checked";
                    newLi.childNodes[1].checked = item.checked;
                }
            })
        };

        var boxChecked = function (event) {
            var element = event.target;
            if (element.type === 'checkbox') {
                store.editTodo(element.parentNode.id);
                render();
            }
        };

        var deleteTask = function (event) {
            var element = event.target;
            if (element.className === 'task__remove-icon') {
                store.removeTodo(element.parentElement.id);
                render();
            }
        };

        return {
            render: render,
            boxChecked: boxChecked,
            deleteTask: deleteTask
        };
    })(store);

    form.onsubmit = function () {
        if (!input.value) {
            alert('You must enter some value!');
            return false;
        } else {
            store.addTodo(input.value);
            view.render();
            return false;
        }
    };

    list.addEventListener('click', view.deleteTask);
    list.addEventListener('click', view.boxChecked);
})();