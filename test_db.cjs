const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  projectId: "symbolic-operation-f3n78",
  appId: "1:849828158837:web:34694efeac8e1a28f3473c",
  apiKey: "AIzaSyDLasPVd8EWSDCwL_dhSY2W91jednrMQjg",
  authDomain: "symbolic-operation-f3n78.firebaseapp.com",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-futuregrow-5bef356f-2a59-46f0-bf84-493197154398");

async function test() {
  try {
     console.log("Writing test data...");
     await setDoc(doc(db, "mlm_app_data", "test_write"), { timestamp: Date.now() }, { merge: true });
     console.log("Write success!");
  } catch(e) {
     console.log("Write failed:", e);
  }
}
test();
