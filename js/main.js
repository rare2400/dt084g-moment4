"use strict";

//Skapar variabler för elementen i HTML-koden
const inputTask = document.getElementById("newtodo");
const addTodoButton = document.getElementById("newtodobutton");
const errorMessage = document.getElementById("message");
const todoListEl = document.getElementById("todolist");
const clearListButton = document.getElementById("clearbutton");
let i; //variabel för i för att kunna iterera en array (for-loop)

/* Händelsehanterare för inladdning av sidan, klick på lägg till-knappen, 
inmatning i textfältet, tryck på rensa-knappen */
window.onload = init;
addTodoButton.addEventListener("click", addItem);
inputTask.addEventListener("keyup", checkItemText);
clearListButton.addEventListener("click", clearStorage);

// funktion för inladdningen av sidan
function init() {
    //lägg till-knappen är från början inaktiverad
    addTodoButton.disabled = true;

    //läser in lagrad lista
    loadStorage();
}

//Funktion för att kontrollera längden av texten i textfältet
function checkItemText() {
    //lagrar värdet en variabel för vad som skrivs i textfältet
    const input = inputTask.value;
    //if-sats för kontroll att texten är längre än fem tecken
    if (input.length < 5) {
        //är det mindre än fem tecken meddelas detta på skärmen och det går inte att trycka på knappen
        errorMessage.innerHTML = "Ange minst fem tecken";
        addTodoButton.disabled = true;
    } else {
        //är det fem eller mer tecken försvinner meddelandet och det går att trycka på lägg till-knappen
        errorMessage.innerHTML = "";
        addTodoButton.disabled = false;
    }
}

//funktion för att lägga till kurs
function addItem() {
    //variabel för texten som skrivs i textfältet
    const input = inputTask.value;

    //skapar nytt element (<article>)
    const newEl = document.createElement("article");

    //skapar en textnode (det som skrivs in i input-fältet)
    let taskTextNode = document.createTextNode(input);

    //input-texten läggs till i det nya elementet (article)
    newEl.appendChild(taskTextNode);

    //ger elementet sin class
    newEl.className = "todo";

    //lägger till i listan
    todoListEl.appendChild(newEl);

    //lägger till en händelsehanterare för klick på nya element för att kunna radera dem
    //vid klick på elementet anropas en anonym funktion där elementet får variabeln "el"
    newEl.addEventListener("click", function (el) {
        el.target.remove();
    });

    //rensar input-fältet efter tillägg
    inputTask.value = "";
    //stänger av lägg till-knappen efter att en ny sak lagts till i listan
    addTodoButton.disabled = true;

    //anropar lagring av tillägg
    storeItem();
}

//Lagra "att göran"
function storeItem() {

    //Läser in elementen i listan
    let todoItems = document.getElementsByClassName("todo");

    //Array där lista med saker att göra kommer att lagras i
    const taskArr = [];

    //for-loop för att loopa och lagra arrayen
    for (i = 0; i < todoItems.length; i++)
        taskArr.push(todoItems[i].innerHTML);

    /*eftersom det inte går att lagra en array i web storage så konverteras den 
    till en JSON-sträng */
    let jsonStr = JSON.stringify(taskArr);

    //lagra i web storage
    localStorage.setItem("todo", jsonStr);
}

//funktion för att läsa in eller skriva ut lagrad data i Web Storage
function loadStorage() {
    //Läser in och konverterar tillbaka JSON-strängen till en array
    let todoItems = JSON.parse(localStorage.getItem("todo"));

    //loopar arrayen med dem lagrade kurserna
    for (i = 0; i < todoItems.length; i++) {

        /* Skriver ut det som sparats i Web Storage till skärmen genom att återanvända koden 
        från tidigare när elementen skapades från textfältet */
        const newEl = document.createElement("article");
        let taskTextNode = document.createTextNode(todoItems[i]);
        newEl.appendChild(taskTextNode);
        newEl.className = "todo";
        todoListEl.appendChild(newEl);

        // Elementet som klickas på raderas
        newEl.addEventListener("click", function (el) {
            el.target.remove();

            //lagrar listan på nytt så inga raderade element kommer tillbaka
            storeItem();
        });
    }
}

//Rensa den lagrade datan i web storage
function clearStorage() {
    localStorage.clear();

    //Listan rensas från skärmen
    todoListEl.innerHTML = "";

    //anropar utskrift
    loadStorage();
}