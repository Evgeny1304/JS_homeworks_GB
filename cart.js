var $cart = $('#cart');
var $catalog = $('#goods');
var $send = $('#send');
var $comment = $('#comment_block');
var $commentAccept = $('#accepted_comments');
var $slider = $('#slider');

function buildSlider() {
    $.ajax({
        url: 'http://localhost:3000/carousel',
        dataType: 'json',
        success: function (images) {
            images.forEach(function (item) {
                var $imgBlock = $('<div/>', {
                    id: 'img' + item.id,
                    class: 'img_block'
                });
                var $img = $('<img/>', {
                    src: item.source,
                    class: 'slide_img',
                    alt: item.name
                }).data(item);
                $imgBlock.append($img);
                $slider.append($imgBlock);
            });
        }
    });
}

function buildCatalog() {
    $.ajax({
        url: 'http://localhost:3000/goods',
        dataType: 'json',
        success: function (goods) {
            goods.forEach(function (item) {
                var $li = $('<li/>', {
                    text: item.name,
                    class: 'good'
                }).data(item);
                var $buyButton = $('<button/>', {
                    text: 'Buy',
                    class: 'buy'
                }).data(item);
                $li.draggable({revert: true});
                $li.append($buyButton);
                $catalog.append($li);
            });
        }
    });
}

function buildComment() {
    $.ajax({
        url: 'http://localhost:3000/reviews',
        dataType: 'json',
        success: function (comment) {
            comment.forEach(function (item) {
                $comment.text(item.comments);
                var $acceptButton = $('<button/>', {
                    text: 'Одобрить',
                    class: 'accept',
                    id: 'comment-' + item.id
                }).data(item);

                var $rejectButton = $('<button/>', {
                    text: 'Отклонить',
                    class: 'reject',
                    id: 'comment-' + item.id
                }).data(item);

                $comment.append($acceptButton);
                $comment.append($rejectButton);

            });
        }
    });
}

function buildAcceptComment() {
    $commentAccept.empty();
    $.ajax({
        url: 'http://localhost:3000/accepted-reviews',
        dataType: 'json',
        success: function (comment) {
            comment.forEach(function (item) {
                var $text = $('<p/>').text(item.comments);
                $commentAccept.append($text);
            });
        }
    });
}

function buildCart() {
    $('#cart').empty();
    $.ajax({
        url: 'http://localhost:3000/cart',
        dataType: 'json',
        success: function (goods) {
            var sum = 0;
            var $ul = $('<ul/>');
            goods.forEach(function (item) {
                var $li = $('<li/>', {
                    text: item.name + ' (' + item.quantity + ')',
                }).data(item);


                var $plusButton = $('<button/>', {
                    text: '+',
                    class: 'plus',
                    id: 'cart-' + item.id
                }).data(item);

                var $minusButton = $('<button/>', {
                    text: '-',
                    class: 'minus',
                    id: 'cart-' + item.id
                }).data(item);

                var $buyButton = $('<button/>', {
                    text: 'Remove',
                    class: 'remove',
                    id: 'cart-' + item.id
                }).data(item);
                sum += +item.price * +item.quantity;

                $li.append($plusButton);
                $li.append($minusButton);
                $li.append($buyButton);
                $ul.append($li);
            });

            $cart.append($ul);
            $cart.append($('<span/>', {text: 'Total: ' + sum}));
        }
    });
}

(function ($) {
    buildCatalog();
    buildCart();
    buildAcceptComment();
    buildSlider();

    //событие на перещелкивание слайдера влево
    var i = 1;
    var limitImgLeft = 1;
    $('#left').on('click', function () {
        j = 4;
        limitImgRight = 4;
        limitImgLeft++;
        var $images = $('.img_block');
        for (i; i < limitImgLeft && i < $images.length; i++) {
            if (i <= 4) {
                $('#img' + i).toggle('fade', 'linear', 50);
                $('#right').prop('disabled', true);
            } else {
                $('#right').prop('disabled', false);
                break;
            }
        }
    });

    //событие на перещелкивание слайдера вправо
    var j = 4;
    var limitImgRight = 4;
    $('#right').on('click', function () {
        i = 1;
        limitImgLeft = 1;
        limitImgRight--;
        var $images = $('.img_block');
        for (j; j > limitImgRight && j < $images.length; j--) {
            if (j >= 1) {
                $('#img' + j).toggle('fade', 'linear', 50);
                $('#left').prop('disabled', true);
            } else {
                $('#left').prop('disabled', false);
                break;
            }
        }
    });

    //событие на покупку товара
    $catalog.on('click', '.buy', function () {
        var good = $(this).data();
        if ($('#cart-' + good.id).length) {
            // товар в корзине есть - нужно увеличить количество
            var goodInCart = $('#cart-' + good.id).data();
            $.ajax({
                url: 'http://localhost:3000/cart/' + good.id,
                type: 'PATCH',
                dataType: 'json',
                data: {quantity: +goodInCart.quantity + 1},
                success: function () {
                    buildCart();
                }
            });
        } else {
            // товара в корзине нет - нужно добавить
            good.quantity = 1;
            $.ajax({
                url: 'http://localhost:3000/cart',
                type: 'POST',
                dataType: 'json',
                data: good,
                success: function () {
                    buildCart();
                }
            });
        }
    });

    //событие на добавление товара через drag and drop
    $cart.droppable({
        over: function (event, ui) {
            var goodDrag = ui.draggable.data();
            var good = {
                id: goodDrag.id,
                name: goodDrag.name,
                price: goodDrag.price,
                category: goodDrag.category
            };
            if ($('#cart-' + good.id).length) {
                // товар в корзине есть - нужно увеличить количество
                var goodInCart = $('#cart-' + good.id).data();
                $.ajax({
                    url: 'http://localhost:3000/cart/' + good.id,
                    type: 'PATCH',
                    dataType: 'json',
                    data: {quantity: +goodInCart.quantity + 1},
                    success: function () {
                        buildCart();
                    }
                });
            } else {
                // товара в корзине нет - нужно добавить
                good.quantity = 1;
                $.ajax({
                    url: 'http://localhost:3000/cart',
                    type: 'POST',
                    dataType: 'json',
                    data: good,
                    success: function () {
                        buildCart();
                    }
                });
            }
        }
    });

    //событие на увеличение количества товара
    $cart.on('click', '.plus', function () {
        var good = $(this).data();
        var goodInCart = $('#cart-' + good.id).data();
        $.ajax({
            url: 'http://localhost:3000/cart/' + good.id,
            type: 'PATCH',
            dataType: 'json',
            data: {quantity: +goodInCart.quantity + 1},
            success: function () {
                buildCart();
            }
        })
    });

    //событие на уменьшение количества товара
    $cart.on('click', '.minus', function () {
        var good = $(this).data();
        if (good.quantity > 1) {
            var goodInCart = $('#cart-' + good.id).data();
            $.ajax({
                url: 'http://localhost:3000/cart/' + good.id,
                type: 'PATCH',
                dataType: 'json',
                data: {quantity: +goodInCart.quantity - 1},
                success: function () {
                    buildCart();
                }
            })
        } else {
            $.ajax({
                url: 'http://localhost:3000/cart/' + good.id,
                type: 'DELETE',
                success: function () {
                    buildCart();
                }
            })
        }
    });

    //событие на удаление товара из корзины
    $cart.on('click', '.remove', function () {
        var good = $(this).data();
        $.ajax({
            url: 'http://localhost:3000/cart/' + good.id,
            type: 'DELETE',
            success: function () {
                buildCart();
            }
        })
    });

    //событие на отправку отзыва
    $send.on('click', function () {
        var comment = $('#comment').val();
        $.ajax({
            url: 'http://localhost:3000/reviews',
            type: 'POST',
            dataType: 'json',
            data: {comments: comment},
            success: function () {
                buildComment();
            }
        });
    });

    //событие на одобрение отзыва
    $comment.on('click', '.accept', function () {
        var comment = $(this).data();
        $.ajax({
            url: 'http://localhost:3000/accepted-reviews',
            type: 'POST',
            dataType: 'json',
            data: comment,
            success: function () {
                buildAcceptComment();
            }
        });
    });

    //событие на отклонение отзыва
    $comment.on('click', '.reject', function () {
        var comment = $(this).data();
        $.ajax({
            url: 'http://localhost:3000/reviews/' + comment.id,
            type: 'DELETE',
            success: function () {
                $comment.empty();
            }
        })
    });

})(jQuery);
