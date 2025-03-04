let db;

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded, initializing IndexedDB...");

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

    document.getElementById("addButton").addEventListener("click", addItem);
});

function addItem() {
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
        console.log("Item added:", itemName);
        input.value = ""; // Clear input field
        displayItems(); // Refresh list after adding
    };

    request.onerror = function() {
        console.error("Error adding item.");
    };
}

function displayItems() {
    let transaction = db.transaction(["items"], "readonly");
    let store = transaction.objectStore("items");
    let request = store.getAll();

    request.onsuccess = function() {
        let list = document.getElementById("itemList");
        list.innerHTML = ""; // Clear list before updating

        request.result.forEach(item => {
            let li = document.createElement("li");
            li.textContent = item.name;

            // Delete button
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
