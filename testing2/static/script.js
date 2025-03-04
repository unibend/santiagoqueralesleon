let db;

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded, script running."); // Debugging

    let button = document.getElementById("addButton");
    console.log("Button element:", button); // Debugging

    if (button) {
        button.addEventListener("click", addItem);
        console.log("Event listener attached."); // Debugging
    } else {
        console.error("Button not found!"); // Debugging
    }

    const request = indexedDB.open("CRUD_DB", 1);

    request.onupgradeneeded = function(event) {
        db = event.target.result;
        if (!db.objectStoreNames.contains("items")) {
            db.createObjectStore("items", { keyPath: "id", autoIncrement: true });
        }
    };

    request.onsuccess = function(event) {
        db = event.target.result;
        console.log("Database opened successfully.");
        displayItems(); // Show stored items on page load
    };

    request.onerror = function(event) {
        console.error("Database error:", event.target.error);
    };
});

function addItem() {
    console.log("addItem() triggered"); // Debugging

    let input = document.getElementById("itemInput");
    let itemName = input.value.trim();

    if (itemName === "") {
        alert("Please enter a valid item.");
        return;
    }

    let transaction = db.transaction(["items"], "readwrite");
    let store = transaction.objectStore("items");
    let request = store.add({ name: itemName });

    request.onsuccess = function() {
        console.log("Item added:", itemName); // Debugging
        input.value = ""; // Clear input field
        displayItems(); // Refresh list after adding
    };

    request.onerror = function() {
        console.error("Error adding item.");
    };
}

function displayItems() {
    console.log("displayItems() triggered"); // Debugging

    let transaction = db.transaction(["items"], "readonly");
    let store = transaction.objectStore("items");
    let request = store.getAll();

    request.onsuccess = function() {
        console.log("Fetched items:", request.result); // Debugging
        let list = document.getElementById("itemList");
        list.innerHTML = ""; // Clear previous list

        request.result.forEach(item => {
            console.log("Rendering item:", item); // Debugging

            let li = document.createElement("li");
            li.textContent = item.name;

            let deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.classList.add("delete");
            deleteBtn.onclick = function() {
                deleteItem(item.id);
            };

            li.appendChild(deleteBtn);
            list.appendChild(li);
        });
    };

    request.onerror = function() {
        console.error("Error fetching items.");
    };
}

function deleteItem(id) {
    console.log("deleteItem() triggered for ID:", id); // Debugging

    let transaction = db.transaction(["items"], "readwrite");
    let store = transaction.objectStore("items");
    let request = store.delete(id);

    request.onsuccess = function() {
        console.log("Item deleted:", id);
        displayItems(); // Refresh list after deleting
    };

    request.onerror = function() {
        console.error("Error deleting item.");
    };
}
