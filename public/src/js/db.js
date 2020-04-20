export async function writeDataToDB(st, data) {
    const db = await dbPromise;
    const tx = db.transaction(st, 'readwrite');
    const store = tx.objectStore(st);
    store.put(data);

    return tx.complete;
}

export async function getAllDataFromDB(st) {
    const db = await dbPromise;
    const tx = db.transaction(st, 'readonly');
    const store = tx.objectStore(st);

    return store.getAll();
}


