"use strict";
class TodoList {
    constructor() {
        this.filter = 'todas';
        this.todoItems = [];
        this.loadFromLocalStorage();
        this.renderList();
        const addItemButton = document.getElementById('addItemButton');
        if (addItemButton) {
            addItemButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.addItem();
            });
        }
        // Evento para cambiar de pestaña
        const todasTab = document.getElementById('ex1-tab-1');
        const activasTab = document.getElementById('ex1-tab-2');
        const completasTab = document.getElementById('ex1-tab-3');
        if (todasTab) {
            todasTab.addEventListener('click', () => this.setFilter('todas'));
        }
        if (activasTab) {
            activasTab.addEventListener('click', () => this.setFilter('activas'));
        }
        if (completasTab) {
            completasTab.addEventListener('click', () => this.setFilter('completas'));
        }
    }
    loadFromLocalStorage() {
        const todoItemsJson = localStorage.getItem('todoItems');
        if (todoItemsJson) {
            try {
                this.todoItems = JSON.parse(todoItemsJson);
            }
            catch (e) {
                console.error('Error loading todoItems:', e);
                this.todoItems = [];
            }
        }
    }
    updateLocalStorage() {
        localStorage.setItem('todoItems', JSON.stringify(this.todoItems));
    }
    renderList() {
        const todasList = document.getElementById('todoList1');
        const activasList = document.getElementById('todoList2');
        const completasList = document.getElementById('todoList3');
        if (todasList && activasList && completasList) {
            // Limpia todas las listas
            todasList.innerHTML = '';
            activasList.innerHTML = '';
            completasList.innerHTML = '';
            // Crea listas filtradas
            const todasItems = this.todoItems;
            const activasItems = this.todoItems.filter(item => !item.completed);
            const completasItems = this.todoItems.filter(item => item.completed);
            // helper para renderizar elementos dada una lista
            const renderItems = (listElement, items) => {
                items.forEach((item) => {
                    const listItem = document.createElement('li');
                    listItem.className = 'list-group-item d-flex align-items-center border-0 mb-2 rounded';
                    listItem.style.backgroundColor = '#f4f6f7';
                    const checkbox = document.createElement('input');
                    checkbox.className = 'form-check-input me-2';
                    checkbox.type = 'checkbox';
                    checkbox.checked = item.completed;
                    checkbox.addEventListener('change', () => {
                        this.togglecompletas(item.id);
                    });
                    const text = document.createElement('span');
                    text.textContent = item.text;
                    if (item.completed) {
                        text.style.textDecoration = 'line-through';
                    }
                    const editButton = document.createElement('button');
                    editButton.className = 'btn btn-warning btn-sm ms-2';
                    editButton.textContent = 'Editar';
                    editButton.addEventListener('click', () => {
                        this.editItem(item.id);
                    });
                    const deleteButton = document.createElement('button');
                    deleteButton.className = 'btn btn-danger btn-sm ms-2';
                    deleteButton.textContent = 'Borrar';
                    deleteButton.addEventListener('click', () => {
                        this.deleteItem(item.id);
                    });
                    listItem.appendChild(checkbox);
                    listItem.appendChild(text);
                    listItem.appendChild(editButton);
                    listItem.appendChild(deleteButton);
                    listElement.appendChild(listItem);
                });
            };
            // Renderiza las listas según el filtro activo
            if (this.filter === 'todas') {
                renderItems(todasList, todasItems);
            }
            else if (this.filter === 'activas') {
                renderItems(activasList, activasItems);
            }
            else if (this.filter === 'completas') {
                renderItems(completasList, completasItems);
            }
        }
    }
    findItemIndexById(id) {
        return this.todoItems.findIndex(item => item.id === id);
    }
    togglecompletas(id) {
        const index = this.findItemIndexById(id);
        if (index !== -1) {
            this.todoItems[index].completed = !this.todoItems[index].completed;
            this.updateLocalStorage();
            this.renderList();
        }
    }
    addItem() {
        const newItemInput = document.getElementById('form2');
        const newItemText = newItemInput.value;
        if (newItemText.trim() !== '') {
            const myuuid = crypto.randomUUID();
            this.todoItems.push({ id: myuuid, text: newItemText, completed: false });
            this.updateLocalStorage();
            this.renderList();
            newItemInput.value = ''; // Limpiar el campo de texto
        }
    }
    setFilter(filter) {
        this.filter = filter;
        this.renderList();
    }
    editItem(id) {
        const index = this.findItemIndexById(id);
        if (index !== -1) {
            const newText = prompt('Editar tarea:', this.todoItems[index].text);
            if (newText !== null && newText.trim() !== '') {
                this.todoItems[index].text = newText.trim();
                this.updateLocalStorage();
                this.renderList();
            }
        }
    }
    deleteItem(id) {
        if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
            const index = this.findItemIndexById(id);
            if (index !== -1) {
                this.todoItems.splice(index, 1);
                this.updateLocalStorage();
                this.renderList();
            }
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new TodoList();
});
