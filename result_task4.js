var button = document.getElementById("test");

button.addEventListener('click', function() {
    var xhr = new XMLHttpRequest();

    // настройка запроса
    xhr.open('GET', 'http://127.0.0.1:8080/answer.json');
    // отправка запроса
    xhr.send();

    xhr.onreadystatechange = function() {
        if(xhr.readyState === XMLHttpRequest.DONE) {
            try {
                var answer = JSON.parse(xhr.responseText);

                var answerText = document.createElement('h1');
                if (answer.result === "success"){
                    answerText.textContent = answer.result;
                    answerText.style.color = "green";
                } else {
                    answerText.textContent = answer.result;
                    answerText.style.color = "red";
                }

                document.body.appendChild(answerText);
            } catch {
                console.log('Error');
        }
        }
    }
});
