let db;
const request = indexedDB.open("CRUD_DB", 1);

request.onupgradeneeded = function(event) {
    let db = event.target.result;
    db.createObjectStore("items", { keyPath: "id", autoIncrement: true });
};

request.onsuccess = function(event) {
    db = event.target.result;
    displayItems();
};

function addItem() {
    let input = document.getElementById("itemInput");
    let transaction = db.transaction(["items"], "readwrite");
    let store = transaction.objectStore("items");
    store.add({ name: input.value });
    input.value = "";
    transaction.oncomplete = displayItems;
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
            list.appendChild(li);
        });
    };
}
