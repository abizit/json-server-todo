var Todo = /** @class */ (function () {
        function Todo() {
            this.taskList = [];
            this.taskForm = document.getElementById('taskForm');
            this.initEventListeners();
            this.listTask();
        }

        Todo.prototype.initEventListeners = function () {
            this.taskForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addTask();
            });
            document.addEventListener('click', (e) => {
                if (e.target && e.target.classList.contains('list-group-item')) {
                    this.completeTask(e.target.id);
                }
            });
        };

        Todo.prototype.listTask = function () {
            this.apiRequests('GET', 'http://localhost:3000/todo', null)
        }

        Todo.prototype.addTask = function () {
            let value = document.getElementById('taskInput').value;
            if (value) {
                let dataObject = {
                    task: value,
                    completed: false
                }
                this.apiRequests('POST', 'http://localhost:3000/todo', JSON.stringify(dataObject))
            }
        };

        Todo.prototype.completeTask = function (elemId) {
            let id = parseInt(elemId.split('-')[1])
            for (let index in this.taskList) {
                if (this.taskList[index]['id'] == id) {
                    this.taskList[index]['completed'] = !this.taskList[index]['completed'];
                    console.log(this.taskList[index])
                    this.apiRequests('PATCH', 'http://localhost:3000/todo/' + id, JSON.stringify(this.taskList[index]))
                }
            }
        }

        // Reusable Functions
        Todo.prototype._displayTask = function () {
            let taskListContainer = document.getElementById('taskListContainer');
            taskListContainer.innerHTML = '';
            let completedtaskListContainer = document.getElementById('completedtaskListContainer');
            completedtaskListContainer.innerHTML = '';
            for (let i = 0; i < this.taskList.length; i++) {
                let taskObj = this.taskList[i];
                var taskContainer = document.createElement('div');
                taskContainer.id = "task-" + taskObj['id'];
                taskContainer.className = 'list-group-item list-group-item-action';
                taskContainer.innerHTML = taskObj['task'];
                taskObj['completed'] ? completedtaskListContainer.appendChild(taskContainer) : taskListContainer.appendChild(taskContainer);
            }
        };

        Todo.prototype.apiRequests = function (method, url, data) {
            // make requests to api
            // fetch or send data
            // show data to html if successful
            let httpRequest = new XMLHttpRequest();
            httpRequest.open(method, url, true);
            if (method === 'POST') {
                // for posting data
                httpRequest.setRequestHeader('Content-type', 'application/json');
                httpRequest.onload = (response) => {
                    let responseObj = JSON.parse(response.target.responseText);
                    this.taskList = that.taskList.concat([responseObj]);
                    this._displayTask();
                    document.getElementById('taskInput').value = '';
                };
            }

            if (method === 'GET') {
                // fotr fetching data
                httpRequest.onload = (response) => {
                    // assing respone to takslist
                    this.taskList = JSON.parse(response.target.responseText);
                    this._displayTask()
                }
            }
            if (method === 'PATCH') {
                httpRequest.setRequestHeader('Content-type', 'application/json');
                httpRequest.onload = (response) => {
                    this.listTask();
                }
            }

            httpRequest.send(data);

        }

        return Todo;
    }()
);
var todo = new Todo();


