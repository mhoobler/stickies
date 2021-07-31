const getTransaction = async (db) =>
  new Promise((resolve, reject) => {
    var transaction = db.transaction(["stickies"], "readwrite");

    transaction.oncomplete = (evt) => {
      console.log("transaction success", evt);
    };

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
      console.log(evt);
      db = evt.target.result;

      db.onerror = (evt) => {
        console.error("Database error: " + evt.target.errorCode);
      };

      try {
        transaction = await getTransaction(db);
        const store = transaction.objectStore("stickies");
        resolve({ store });
      } catch (err) {
        console.log(err);
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

export default initDB;
