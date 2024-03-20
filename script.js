import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
    databaseURL: "https://databasefortino-default-rtdb.europe-west1.firebasedatabase.app/"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const newsListInDB = ref(database, "notizie");
const inputFieldEL = document.getElementById("inputBox");
const addButtonEL = document.getElementById("logButton");
const newsListEL = document.getElementById("news-list");

addButtonEL.addEventListener("click", function() {
    let inputValue = inputFieldEL.value;
    
    push(newsListInDB, inputValue);
    
    clearInputFieldEl();
    
    console.log(`${inputValue} added to database`);
});

onValue(newsListInDB, function(snapshot) {
    if (snapshot.exists()){
    let newsArray = Object.entries(snapshot.val());
   
    clearNewsList()
     
    for(let i = 0; i < newsArray.length; i++) {
        let currentNews = newsArray[i];
        let currentNewsID = currentNews[0];
        let currentNewsValue = currentNews[1];
    
        appendItemToNewsList(currentNews); 
     } 
     } else {
         newsListEL.innerHTML = "Non c'è nulla di pubblicato al momento" 
    }
});

   
function clearNewsList(){
    newsListEL.innerHTML = null;
}

function clearInputFieldEl(){
    inputFieldEL.value = null;
}

function appendItemToNewsList(item){
  
    let itemID = item[0];
    let itemValue = item[1]
    
    let newEl= document.createElement("li")
    
    newEl.textContent = itemValue;
    newsListEL.append(newEl)
    
    newEl.addEventListener("dblclick",function(){
    let exactLocationOfItemInDB = ref(database,`notizie/${itemID}`);
    remove(exactLocationOfItemInDB)
    })
}
