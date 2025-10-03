let cBox = document.getElementById("colorBox");
let colorBtn = document.getElementById("changeColor");

let assignRandomColor = function()
{
    let rComp =255 * Math.random();
    let gComp =255 * Math.random();
    let bComp =255 * Math.random();
    cBox.style.backgroundColor ="rgb(" +rComp +", " + gComp +", " + bComp +")";
}

console.log(cBox);

colorBtn.addEventListener("click", assignRandomColor);