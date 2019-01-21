var xhr = new XMLHttpRequest();

// настройка запроса
xhr.open("GET", "http://127.0.0.1:8080/gallery.json");
// отправка запроса
xhr.send();

xhr.onreadystatechange = function() {
    if(xhr.readyState === XMLHttpRequest.DONE) {
        try {
            var images= JSON.parse(xhr.responseText);

            var container = document.createElement("div");
            container.className = "container";
            var imagesDiv = document.createElement("div");
            imagesDiv.className = "images";
            var modalsDiv = document.createElement("div");
            images.forEach(function(image) {
                var button = document.createElement("button");
                button.setAttribute("data-modal", image.name + "_" + "modal");
                button.className = "button_img";
                button.addEventListener("click", function (){
                    var idModal = this.getAttribute("data-modal");
                    var $modal = document.getElementById(idModal);
                    $modal.style.display = "block";
                });
                var img = document.createElement("img");
                img.src = image.small_img;
                img.alt = image.name;
                button.appendChild(img);
                imagesDiv.appendChild(button);

                //создание модальных окон
                var modal = document.createElement("div");
                modal.setAttribute("id", image.name + "_" + "modal");
                modal.className = "modal_img";
                var modalContent = document.createElement("div");
                modalContent.className = "modal-content";
                var buttonClose = document.createElement("button");
                buttonClose.setAttribute("data-modal", image.name + "_" + "modal");
                buttonClose.className = "close";
                buttonClose.textContent = "X";
                buttonClose.addEventListener("click", function (){
                    var idModal = this.getAttribute("data-modal");
                    var $modal = document.getElementById(idModal);
                    $modal.style.display = "none";
                });
                var imgModal = document.createElement("img");
                imgModal.src = image.big_img;
                imgModal.alt = image.name + "_" + "big";
                modalContent.appendChild(buttonClose);
                modalContent.appendChild(imgModal);
                modal.appendChild(modalContent);
                modalsDiv.appendChild(modal);
            });

            container.appendChild(imagesDiv);
            container.appendChild(modalsDiv);
            document.body.appendChild(container);
        } catch {
            console.log("Error");
    }
    }
}