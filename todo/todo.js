document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const prioritySelect = document.getElementById('priority-select');
    const categorySelect = document.getElementById('category-select');
    const taskList = document.getElementById('task-list');
    const tasksCounter = document.getElementById('tasks-counter');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sort-select');
    
    // Modal Elements
    const editModal = document.getElementById('edit-modal');
    const closeModalBtn = document.querySelector('.close');
    const editForm = document.getElementById('edit-form');
    const editId = document.getElementById('edit-id');
    const editText = document.getElementById('edit-text');
    const editPriority = document.getElementById('edit-priority');
    const editCategory = document.getElementById('edit-category');
    
    // App State
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';
    
    // Initialize the app
    function init() {
        renderTasks();
        updateTasksCounter();
    }
    
    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Add a new task
    function addTask(text, priority, category) {
        const newTask = {
            id: Date.now().toString(),
            text: text,
            completed: false,
            priority: priority,
            category: category,
            createdAt: new Date()
        };
        
        tasks.unshift(newTask);
        saveTasks();
        renderTasks();
        updateTasksCounter();
    }
    
    // Delete a task
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
        updateTasksCounter();
    }
    
    // Toggle task completion status
    function toggleTaskStatus(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        
        saveTasks();
        renderTasks();
        updateTasksCounter();
    }
    
    // Edit a task
    function editTask(id, newText, newPriority, newCategory) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { 
                    ...task, 
                    text: newText,
                    priority: newPriority,
                    category: newCategory
                };
            }
            return task;
        });
        
        saveTasks();
        renderTasks();
    }
    
    // Clear completed tasks
    function clearCompletedTasks() {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
        updateTasksCounter();
    }
    
    // Filter tasks based on current filter
    function getFilteredTasks() {
        switch(currentFilter) {
            case 'active':
                return tasks.filter(task => !task.completed);
            case 'completed':
                return tasks.filter(task => task.completed);
            default:
                return tasks;
        }
    }
    
    // Sort tasks based on selected sort option
    function getSortedTasks(filteredTasks) {
        const sortOption = sortSelect.value;
        
        switch(sortOption) {
            case 'priority':
                const priorityOrder = { 'high': 1, 'medium': 2, 'low': 3 };
                return [...filteredTasks].sort((a, b) => 
                    priorityOrder[a.priority] - priorityOrder[b.priority]
                );
            case 'category':
                return [...filteredTasks].sort((a, b) => 
                    a.category.localeCompare(b.category)
                );
            default: // 'added' (default sort by date added)
                return filteredTasks; // Already sorted by newest first
        }
    }
    
    // Render tasks to the DOM
    function renderTasks() {
        let filteredTasks = getFilteredTasks();
        let sortedTasks = getSortedTasks(filteredTasks);
        
        taskList.innerHTML = '';
        
        if (sortedTasks.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.className = 'task-item empty-message';
            emptyMessage.textContent = 'No tasks to display';
            taskList.appendChild(emptyMessage);
            return;
        }
        
        sortedTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskItem.dataset.id = task.id;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'task-checkbox';
            checkbox.checked = task.completed;
            
            const taskText = document.createElement('span');
            taskText.className = 'task-text';
            taskText.textContent = task.text;
            
            const priorityBadge = document.createElement('span');
            priorityBadge.className = `task-priority priority-${task.priority}`;
            priorityBadge.textContent = `${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}`;
            
            const categoryBadge = document.createElement('span');
            categoryBadge.className = `task-category category-${task.category}`;
            categoryBadge.textContent = `${task.category.charAt(0).toUpperCase() + task.category.slice(1)}`;
            
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'task-actions';
            
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            
            actionsDiv.appendChild(editBtn);
            actionsDiv.appendChild(deleteBtn);
            
            taskItem.appendChild(checkbox);
            taskItem.appendChild(taskText);
            taskItem.appendChild(priorityBadge);
            taskItem.appendChild(categoryBadge);
            taskItem.appendChild(actionsDiv);
            
            taskList.appendChild(taskItem);
            
            // Add event listeners
            checkbox.addEventListener('change', function() {
                toggleTaskStatus(task.id);
            });
            
            editBtn.addEventListener('click', function() {
                openEditModal(task);
            });
            
            deleteBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this task?')) {
                    deleteTask(task.id);
                }
            });
        });
    }
    
    // Update tasks counter
    function updateTasksCounter() {
        const activeTasks = tasks.filter(task => !task.completed).length;
        tasksCounter.textContent = activeTasks;
    }
    
    // Open edit modal
    function openEditModal(task) {
        editId.value = task.id;
        editText.value = task.text;
        editPriority.value = task.priority;
        editCategory.value = task.category;
        
        editModal.style.display = 'flex';
    }
    
    // Close edit modal
    function closeEditModal() {
        editModal.style.display = 'none';
    }
    
    // Event Listeners
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const text = taskInput.value.trim();
        const priority = prioritySelect.value;
        const category = categorySelect.value;
        
        if (text) {
            addTask(text, priority, category);
            taskInput.value = '';
            taskInput.focus();
        }
    });
    
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentFilter = this.dataset.filter;
            renderTasks();
        });
    });
    
    sortSelect.addEventListener('change', renderTasks);
    
    closeModalBtn.addEventListener('click', closeEditModal);
    
    window.addEventListener('click', function(e) {
        if (e.target === editModal) {
            closeEditModal();
        }
    });
    
    editForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const id = editId.value;
        const newText = editText.value.trim();
        const newPriority = editPriority.value;
        const newCategory = editCategory.value;
        
        if (newText) {
            editTask(id, newText, newPriority, newCategory);
            closeEditModal();
        }
    });
    
    // Initialize the app
    init();
});