let db;

// Open (or create) the database
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
    displayItems();
};

request.onerror = function(event) {
    console.error("Database error:", event.target.error);
};

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
        input.value = "";
        displayItems();
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
        list.innerHTML = "";
        request.result.forEach(item => {
            let li = document.createElement("li");
            li.textContent = item.name;

            // Delete button
            let deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
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
        displayItems();
    };

    request.onerror = function() {
        console.error("Error deleting item.");
    };
}
