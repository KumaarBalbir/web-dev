let lst = document.querySelector("ul");
let lastElement = lst.lastElementChild;
console.log(lastElement.innerHTML);
lastElement.innerHTML = "Last Element Changed";
let btn = document.querySelector("button");
btn.style.backgroundColor = "yellow";

let heading = document.querySelector("h1");
heading.classList.add("huge");
