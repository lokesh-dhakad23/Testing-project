import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, addDoc, collection, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getAuth, 
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword, 
        onAuthStateChanged, 
        signOut } 
        from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBMlC0qEs3laPw8nj1ruMixTsiO9HKBWPk",
    authDomain: "test-project-88989.firebaseapp.com",
    projectId: "test-project-88989",
    storageBucket: "test-project-88989.firebasestorage.app",
    messagingSenderId: "223720262076",
    appId: "1:223720262076:web:5a612427c8d7248180c3b9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


const textarea = document.getElementById("textarea");
const saveBtn = document.getElementById("save-btn");
const showData = document.getElementById("showInfo");

// FOR AUTHENTICATION //
const authForm = document.getElementById("auth-container");
const mainPage = document.getElementById("main-container");
const loginBtn = document.getElementById("login-btn");
const signUpBtn = document.getElementById("signup-btn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const formLoginBtn = document.getElementById("form-login-btn");
const closeBtn = document.getElementById("close-btn");
const logOutBtn = document.getElementById("log-out-btn");
const authMessage = document.getElementById("auth-message");

loginBtn.addEventListener("click", () => {
  authForm.style.display = "flex";
  mainPage.style.display = "none";
})

closeBtn.addEventListener("click", () => {
  authForm.style.display = "none";
  mainPage.style.display = "block";
})

signUpBtn.addEventListener("click", () => {
  
  const email = emailInput.value
  const password = passwordInput.value
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    console.log(user)
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage)
  });
});

formLoginBtn.addEventListener("click", () => {
  const email = emailInput.value
  const password = passwordInput.value
    signInWithEmailAndPassword(auth, email, password) 
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("success sign-in");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage)
    })
});

logOutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      authForm.style.display = "flex";
      mainPage.style.display = "none";
      console.log("sign-out successful")

    })
    .catch((error) => {
      // An error happened.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage)
    });
  });

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    console.log("success change")
      authForm.style.display = 'none';
      mainPage.style.display = 'block';
      authMessage.textContent = `Welcome, ${user.email}!`;
      fetchInRealtime();
  } else {
      // User is signed out
      authForm.style.display = 'flex';
      mainPage.style.display = 'none';
      authMessage.textContent = 'Please sign in or create an account';
      console.log("No user is signed in.")
  }
});


saveBtn.addEventListener("click", () => {
    let text = textarea.value
    if (text) {
        addToDB(text)
    }
    text = ""
    fetchInRealtime()
});


function fetchInRealtime() {
  onSnapshot(collection(db, "data"), (querySnapshot) => {
      showData.innerHTML = ""
      
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data().body}`)
        showDataFunc(showData,doc.data())
      })
  })
}

function showDataFunc(showInfo,datatext) {
  showInfo.innerHTML += `<h1 id="showdata">${datatext.body}</h1>`
}
async function addToDB(text) {
    try {
        const docRef = await addDoc(collection(db, "data"), {
          body: text,
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
}
