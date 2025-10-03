let cBox = document.getElementById("colorBox");
let colorBtn = document.getElementById("changeColor");
let imgBox = document.getElementById("crocodileImage");
let imageBtn = document.getElementById("toggleImage");

let assignRandomColor = function()
{
    let rComp =255 * Math.random();
    let gComp =255 * Math.random();
    let bComp =255 * Math.random();
    cBox.style.backgroundColor ="rgb(" +rComp +", " + gComp +", " + bComp +")";
}

const toggleCrocodileImage = () =>
{
    console.log(imgBox.src);  
    if (imgBox.src.includes("baby-crocodile"))
    {
        console.log("Changing to adult crocodile");
        imgBox.src = "pictures/crocodile-2.jpg";
    }
    else
    {
        imgBox.src ="pictures/baby-crocodile.webp";
    }
}

imageBtn.addEventListener("click", toggleCrocodileImage);
colorBtn.addEventListener("click", assignRandomColor);