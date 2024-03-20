import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
    databaseURL: "https://databasefortino-default-rtdb.europe-west1.firebasedatabase.app/"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const memberListInDB = ref(database, "membri");
const inputNewMemberFieldEL = document.getElementById("new-member-name");
const addMemberButtonEL = document.getElementById("add-member-btn");
const memberListEL = document.getElementById("members-list");

addMemberButtonEL.addEventListener("click", function() {
    let inputValue = inputNewMemberFieldEL.value.trim();
    
    if (inputValue !== '') {
        // Push an object with name and counter properties
        push(memberListInDB, {
            name: inputValue,
            counter: 0
        });
        
        clearInputFieldEl();
        console.log(`${inputValue} added to database`);

    } else {
        alert('Please enter a valid member name.');
    }
});


// Listen for changes in the member list
onValue(memberListInDB, snapshot => {
    memberListEL.innerHTML = ''; // Clear the existing list
    snapshot.forEach(member => {
        const { name, counter } = member.val();
        const listItem = document.createElement('li');
        listItem.textContent = `${name}: ${counter}`; // Display member name and counter value
        listItem.classList.add('member-item')
        const increaseButton = document.createElement('button');
        increaseButton.textContent = 'Increase';
        increaseButton.classList.add('increase-btn'); // Add class to the increase button
        increaseButton.addEventListener('click', () => increaseCounter(member.key, counter));

        const decreaseButton = document.createElement('button');
        decreaseButton.textContent = 'Decrease';
        decreaseButton.classList.add('decrease-btn'); // Add class to the decrease button
        decreaseButton.addEventListener('click', () => decreaseCounter(member.key, counter));

        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset';
        resetButton.classList.add('reset-btn'); // Add class to the reset button
        resetButton.addEventListener('click', () => resetCounter(member.key));

        listItem.appendChild(increaseButton);
        listItem.appendChild(decreaseButton);
        listItem.appendChild(resetButton);

        memberListEL.appendChild(listItem);
    });
});

function clearInputFieldEl() {
    inputNewMemberFieldEL.value = null;
}

function increaseCounter(memberKey, currentCounter) {
    const newCounter = currentCounter + 1;
    update(ref(database, `membri/${memberKey}`), { counter: newCounter });
}

function decreaseCounter(memberKey, currentCounter) {
    const newCounter = Math.max(0, currentCounter - 1);
    update(ref(database, `membri/${memberKey}`), { counter: newCounter });
}

function resetCounter(memberKey) {
    update(ref(database, `membri/${memberKey}`), { counter: 0 });
}
