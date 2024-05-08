function addTask() {
    var task = prompt("Enter task:");
    if (task !== null) {
        fetch('http://localhost:3000/addTask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task: task }),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            // Optionally, you can call viewTasks() after adding a task to refresh the task list
            viewTasks();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
}

function viewTasks() {
    fetch('http://localhost:3000/viewTasks') // Ensure the correct URL for your backend
    .then(response => response.json())
    .then(data => {
        var outputDiv = document.getElementById('output');
        outputDiv.innerHTML = '';
        data.tasks.forEach(task => {
            outputDiv.innerHTML += `ID: ${task.id}, Task: ${task.task}, Completed: ${task.completed}<br>`;
        });
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function updateTask() {
    var taskId = prompt("Enter Task ID to mark as completed:");
    if (taskId !== null) {
        fetch(`http://localhost:3000/updateTask/${taskId}`, {
            method: 'PUT',
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            // Optionally, you can call viewTasks() after updating a task to refresh the task list
            viewTasks();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
}

function deleteTask() {
    var taskId = prompt("Enter Task ID to delete:");
    if (taskId !== null) {
        fetch(`http://localhost:3000/deleteTask/${taskId}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            // Optionally, you can call viewTasks() after deleting a task to refresh the task list
            viewTasks();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
}

function exit() {
    // Handle exit logic if necessary
}
