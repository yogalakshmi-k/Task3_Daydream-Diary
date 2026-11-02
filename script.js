
// DAYDREAM DIARY - The Little Things Club

// Get HTML elements
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");
const taskCount = document.getElementById("task-count");

const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");
const progressMessage = document.getElementById("progress-message");

const journalInput = document.getElementById("journal-input");
const saveEntryButton = document.getElementById("save-entry");
const journalMessage = document.getElementById("journal-message");
const entriesList = document.getElementById("entries-list");

const moodButtons = document.querySelectorAll(".mood-btn");

// Load saved data from localStorage
let tasks = JSON.parse(localStorage.getItem("daydreamTasks")) || [];
let entries = JSON.parse(localStorage.getItem("daydreamEntries")) || [];
let selectedMood = "Happy";

// Display today's date
const today = new Date();

document.getElementById("today-date").textContent =
    today.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
    });

// Save tasks in localStorage
function saveTasks() {
    localStorage.setItem("daydreamTasks", JSON.stringify(tasks));
}

// Save journal entries in localStorage
function saveEntries() {
    localStorage.setItem("daydreamEntries", JSON.stringify(entries));
}

// Add a new task
taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const taskName = taskInput.value.trim();

    if (taskName === "") {
        return;
    }

    const newTask = {
        id: Date.now() + Math.random(),
        text: taskName,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
});

// Display tasks on the page
function renderTasks() {
    taskList.innerHTML = "";

    emptyMessage.classList.toggle("hidden", tasks.length > 0);

    tasks.forEach(function(task) {
        const li = document.createElement("li");
        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-check";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Mark task complete");

        checkbox.addEventListener("change", function() {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const taskText = document.createElement("span");
        taskText.className = "task-text";
        taskText.textContent = task.text;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "✕";
        deleteButton.setAttribute("aria-label", "Delete task");

        deleteButton.addEventListener("click", function() {
            tasks = tasks.filter(function(item) {
                return item.id !== task.id;
            });

            saveTasks();
            renderTasks();
        });

        li.appendChild(checkbox);
        li.appendChild(taskText);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });

    updateProgress();
}

// Update task progress
function updateProgress() {
    const completedTasks = tasks.filter(function(task) {
        return task.completed;
    }).length;

    const totalTasks = tasks.length;

    const percentage = totalTasks === 0
        ? 0
        : (completedTasks / totalTasks) * 100;

    taskCount.textContent =
        totalTasks + (totalTasks === 1 ? " little task" : " little tasks");

    progressText.textContent =
        completedTasks + " of " + totalTasks + " tasks completed";

    progressFill.style.width = percentage + "%";

    if (totalTasks === 0) {
        progressMessage.textContent = "Every little step counts! ♡";
    } else if (completedTasks === totalTasks) {
        progressMessage.textContent = "You bloomed through every task! 🌷";
    } else if (percentage >= 50) {
        progressMessage.textContent = "You're doing wonderful, dreamer! ✨";
    } else {
        progressMessage.textContent = "Little by little, you got this! 🌱";
    }
}

// Choose a mood
moodButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        moodButtons.forEach(function(item) {
            item.classList.remove("selected");
        });

        button.classList.add("selected");
        selectedMood = button.dataset.mood;
    });
});

// Save a journal entry
saveEntryButton.addEventListener("click", function() {
    const journalText = journalInput.value.trim();

    if (journalText === "") {
        journalMessage.textContent =
            "Write a little something before saving, lovely! ♡";
        return;
    }

    const newEntry = {
        id: Date.now() + Math.random(),
        text: journalText,
        mood: selectedMood,
        date: new Date().toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short"
        })
    };

    entries.unshift(newEntry);

    saveEntries();
    renderEntries();

    journalInput.value = "";
    journalMessage.textContent = "Your little memory is saved! 💗";

    setTimeout(function() {
        journalMessage.textContent = "";
    }, 3000);
});

// Display saved journal entries
function renderEntries() {
    entriesList.innerHTML = "";

    if (entries.length === 0) {
        const message = document.createElement("p");
        message.className = "empty-entries";
        message.textContent = "Your memories will appear here. 🌸";
        entriesList.appendChild(message);
        return;
    }

    entries.forEach(function(entry) {
        const card = document.createElement("article");
        card.className = "entry-card";

        const meta = document.createElement("div");
        meta.className = "entry-meta";

        const date = document.createElement("span");
        date.textContent = entry.date;

        const mood = document.createElement("span");
        mood.className = "entry-mood";
        mood.textContent = "♡ " + entry.mood;

        const text = document.createElement("p");
        text.className = "entry-text";
        text.textContent = entry.text;

        const deleteButton = document.createElement("button");
        deleteButton.className = "entry-delete";
        deleteButton.textContent = "Delete memory ✕";

        deleteButton.addEventListener("click", function() {
            entries = entries.filter(function(item) {
                return item.id !== entry.id;
            });

            saveEntries();
            renderEntries();
        });

        meta.appendChild(date);
        meta.appendChild(mood);

        card.appendChild(meta);
        card.appendChild(text);
        card.appendChild(deleteButton);

        entriesList.appendChild(card);
    });
}

// Initial display when the website opens
renderTasks();
renderEntries();
