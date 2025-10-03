let cBox = document.getElementById("colorBox");
let colorBtn = document.getElementById("changeColor");

let assignRandomColor = function()
{
    cBox.style.backgroundColor ="rgb(255,0,0)";
}

console.log(cBox);



colorBtn.addEventListener("click", assignRandomColor);