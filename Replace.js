//Задание 1

var regexp = /\'/g;

console.log("\'Hello, world\'".replace(regexp,"\""));


//Задание 2

var regexp1 = /^'|'$/g;

console.log("\'I'm Evgeny Khabirov. I'm 28.\'".replace(regexp1,"\""));


//Задание 3
var $form = document.getElementById("form");
var $warningText = document.createElement("p");
$warningText.classList.add("warning");
$form.appendChild($warningText);

function handleButtonSendForm(){
    var regPhone = /^\+\d\(\d{3}\)\d{3}-\d{4}$/;
    var regName = /^[A-za-zА-яа-я]+$/gi;
    var regMail = /[a-z-\.]+@[a-z]+\.[a-z]{2}$/gi;

    var $inputs = document.getElementsByClassName("input_form");
    var warningMessage = "Неверно введено";

    if (regName.test($inputs[0].value) === false){
        $inputs[0].style.border = "1px solid red";
        warningMessage += " имя ";
        $warningText.textContent = warningMessage;
    }else {
        $inputs[0].style.border = "1px solid green";
    }

    if (regPhone.test($inputs[1].value) === false){
        $inputs[1].style.border = "1px solid red";
        warningMessage += " телефон ";
        $warningText.textContent = warningMessage;
    }else {
        $inputs[1].style.border = "1px solid green";
    }

    if (regMail.test($inputs[2].value) === false) {
        $inputs[2].style.border = "1px solid red";
        warningMessage += " e-mail ";
        $warningText.textContent = warningMessage;
    }else {
        $inputs[1].style.border = "1px solid green";
    }
}

var $button = document.getElementById("send");
$button.addEventListener("click",handleButtonSendForm);


