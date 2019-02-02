var $cart = $('#cart');
var $catalog = $('#goods');
var $send = $('#send');
var $comment = $('#comment_block');
var $commentAccept = $('#accepted_comments');

function buildCatalog() {
  $.ajax({
    url: 'http://localhost:3000/goods',
    dataType: 'json',
    success: function(goods) {
      goods.forEach(function(item) {
        var $li = $('<li/>').text(item.name);
        var $buyButton = $('<button/>', {
          text: 'Buy',
          class: 'buy'
        }).data(item);

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
        success: function(comment) {
            comment.forEach(function(item) {
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
        success: function(comment) {
            comment.forEach(function(item) {
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
    success: function(goods) {
      var sum = 0;
      var $ul = $('<ul/>');
      goods.forEach(function(item) {
        var $li = $('<li/>', {
          text: item.name + ' (' + item.quantity + ')',
        });


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
      $cart.append($('<span/>', { text: 'Total: ' + sum }));
    }
  });
}

(function($) {
  buildCatalog();
  buildCart();
  buildAcceptComment();

  $comment.on('click', '.accept', function () {
      var comment = $(this).data();
      $.ajax({
          url: 'http://localhost:3000/accepted-reviews',
          type: 'POST',
          dataType: 'json',
          data: comment,
          success: function() {
              buildAcceptComment();
          }
      });
  });

    $comment.on('click', '.reject', function() {
        var comment = $(this).data();
        $.ajax({
            url: 'http://localhost:3000/reviews/' + comment.id,
            type: 'DELETE',
            success: function() {
                $comment.empty();
            }
        })
    });

  $cart.on('click', '.remove', function() {
    var good = $(this).data();
    $.ajax({
      url: 'http://localhost:3000/cart/' + good.id,
      type: 'DELETE',
      success: function() {
        buildCart();
      }
    })
  });

    $cart.on('click', '.minus', function() {
        var good = $(this).data();
        if(good.quantity > 1) {
            var goodInCart = $('#cart-' + good.id).data();
            $.ajax({
                url: 'http://localhost:3000/cart/' + good.id,
                type: 'PATCH',
                dataType: 'json',
                data: { quantity: +goodInCart.quantity - 1 },
                success: function() {
                    buildCart();
                }
            })
        } else {
            $.ajax({
                url: 'http://localhost:3000/cart/' + good.id,
                type: 'DELETE',
                success: function() {
                    buildCart();
                }
            })
        }
    });

    $cart.on('click', '.plus', function() {
        var good = $(this).data();
        var goodInCart = $('#cart-' + good.id).data();
            $.ajax({
                url: 'http://localhost:3000/cart/' + good.id,
                type: 'PATCH',
                dataType: 'json',
                data: { quantity: +goodInCart.quantity + 1 },
                success: function() {
                    buildCart();
                }
            })
    });


  $catalog.on('click', '.buy', function() {
    var good = $(this).data();
    if($('#cart-' + good.id).length) {
      // товар в корзине есть - нужно увеличить количество
      var goodInCart = $('#cart-' + good.id).data();
      $.ajax({
        url: 'http://localhost:3000/cart/' + good.id,
        type: 'PATCH',
        dataType: 'json',
        data: { quantity: +goodInCart.quantity + 1 },
        success: function() {
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
        success: function() {
          buildCart();
        }
      });
    }
  });

  $send.on('click', function (){
      var comment = $('#comment').val();
      $.ajax({
          url: 'http://localhost:3000/reviews',
          type: 'POST',
          dataType: 'json',
          data: { comments: comment },
          success: function() {
              buildComment();
          }
      });
  });

})(jQuery);