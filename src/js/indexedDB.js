const getTransaction = async (db) =>
  new Promise((resolve, reject) => {
    var transaction = db.transaction(["stickies"], "readwrite");

    transaction.onerror = (evt) => {
      console.error("transaction error", evt);
    };

    if (transaction) {
      resolve(transaction);
    } else {
      reject("Error with creating transaction");
    }
  });

const initDB = async () =>
  new Promise((resolve, reject) => {
    var request = indexedDB.open("stickiesDB", 1);
    var db;
    var transaction;

    request.onerror = (evt) => {
      console.error("IndexedDB error");
      reject("Error with creating request");
    };

    request.onsuccess = async (evt) => {
      db = evt.target.result;

      db.onerror = (evt) => {
        console.error("Database error: " + evt.target.errorCode);
      };

      try {
        transaction = await getTransaction(db);
        const store = transaction.objectStore("stickies");
        resolve({ store });
      } catch (err) {
        console.error(err);
      }
    };

    request.onupgradeneeded = (evt) => {
      var db = evt.target.result;

      var stickiesStore = db.createObjectStore("stickies", {
        autoIncrement: true,
        keyPath: "id",
      });
      stickiesStore.createIndex("id", "id", { unique: true });
      stickiesStore.createIndex("message", "message", { unique: false });
      stickiesStore.createIndex("color", "color", { unique: false });
      stickiesStore.createIndex("left", "left", { unique: false });
      stickiesStore.createIndex("top", "top", { unique: false });
    };
  });

function getStickies(cb) {
  initDB()
    .then((res) => {
      const request = res.store.getAll();
      request.onsuccess = (evt) => {
        const stickies = evt.target.result;
        cb(stickies);
      };
      request.onerror = (evt) => {
        console.log(evt);
      };
    })
    .catch((err) => console.error(err));
}

function addSticky(data, cb) {
  const { color, top, left } = data;

  initDB()
    .then((res) => {
      const request = res.store.add({ color, top, left, message: "" });
      request.onsuccess = (evt) => {
        cb(evt.target.result);
      };
      request.onerror = (evt) => {
        console.log(evt);
      };
    })
    .catch((err) => console.error(err));
}

function updateSticky(data, cb = () => {}) {
  const { id, color, top, left, message } = data;
  initDB()
    .then((res) => {
      const request = res.store.put({ id, color, top, left, message });
      request.onsuccess = (evt) => {
        cb(evt.target.result);
      };
      request.onerror = (evt) => {
        console.log(evt);
      };
    })
    .catch((err) => console.error(err));
}

function deleteSticky(data, cb = () => {}) {
  const { id } = data;
  initDB()
    .then((res) => {
      const request = res.store.delete(parseInt(id));
      request.onsuccess = (evt) => {
        cb(evt.target.result);
      };
      request.onerror = (evt) => {
        console.log(evt);
      };
    })
    .catch((err) => console.error(err));
}
export { getStickies, addSticky, updateSticky, deleteSticky };
