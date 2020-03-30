const dbPromise = idb.open('posts-store', 1, (db) => {
    if (!db.objectStoreNames.contains('posts')) {
        db.createObjectStore('posts', {keyPath: 'id'});
    }
});

export async function writeDataToDB(st, data) {
    const db = await dbPromise;
    const tx = db.transaction(st, 'readwrite');
    const store = tx.objectStore('posts');
    store.put(data);

    return tx.complete;
}

export async function getAllDataFromDB(st) {
    const db = await dbPromise;
    const tx = db.transaction(st, 'readonly');
    const store = tx.objectStore('posts');

    return store.getAll();
}


