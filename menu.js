// public, protected, private

function Container(id, className, tagName) {
  // public
  this.id = id;
  this.className = className;

  // protected
  this._tagName = tagName;

  // private
  var element;

  this.getElement = function() {
    return element;
  }

  this.setElement = function(newValue) {
    element = newValue;
  }
}

Container.prototype.render = function() {
  var element = this.getElement();

  if (!element) {
    element = document.createElement(this._tagName);
    element.id = this.id;
    element.className = this.className;

    this.setElement(element);
  }

  return element;
}


function Menu(id, className, items) {
  Container.call(this, id, className, 'ul');

  // protected
  this._items = items;
}

Menu.prototype = Object.create(Container.prototype);
Menu.prototype.render = function() {
  var container = Container.prototype.render.call(this);
  
  this._items.forEach(function(item) {
    if(item instanceof Container) {
      container.appendChild(item.render());
    }
  });

  return container;
}

function MenuItem(className, link, title) {
  Container.call(this, '', className, 'li');

  this.link = link;
  this.title = title;

}

MenuItem.prototype = Object.create(Container.prototype);
MenuItem.prototype.render = function() {
  var container = Container.prototype.render.call(this);

  var a = document.createElement('a');
  a.className = 'drop-link';
  a.textContent = this.title;
  a.href = this.link;

  container.appendChild(a);

  return container;
}


function SuperMenu(id, className, items, link, title) {
  MenuItem.call(this, 'item', link, title);
  Menu.call(this, id, className, items);
}

SuperMenu.prototype = Object.create(Menu.prototype);
SuperMenu.prototype.render = function() {
  if(this.link && this.title) {

    var menuItem = new MenuItem('menu_list', this.link, this.title).render();
    var menu = Menu.prototype.render.call(this);
    var div = document.createElement('div');
    div.className = 'drop-box';
    var div1 = document.createElement('div');
    div1.className = 'drop-box-flex';
    var div2 = document.createElement('div');
    div2.className = 'drop-flex';
    var h3 = document.createElement('h3');
    h3.className = 'drop-heading';
    h3.textContent = 'Women';

    div2.appendChild(h3);
    div2.appendChild(menu);
    div1.appendChild(div2);
    div.appendChild(div1);
    menuItem.appendChild(div);


    return menuItem;
  } else {
    return Menu.prototype.render.call(this);
  }
}


var menuItem1 = new MenuItem('menu_list', '#', 'Home');
var menuItem2 = new MenuItem('menu_list', '/men', 'Men');
var menuItem3 = new MenuItem('menu_list', 'product_catalog.html', 'Women');
var menuItem4 = new MenuItem('menu_list', 'product_catalog.html', 'Kids');
var menuItem5 = new MenuItem('menu_list', 'product_catalog.html', 'Accessories');
var menuItem6 = new MenuItem('menu_list', 'product_catalog.html', 'Featured');
var menuItem7 = new MenuItem('menu_list', 'product_catalog.html', 'Hot deals');

var menuItem8 = new MenuItem('menu-item', '/men/dresses', 'Dresses');
var menuItem9 = new MenuItem('menu-item', '/men/tops', 'Tops');
var menuItem10 = new MenuItem('menu-item', '/men/sweaters', 'Sweaters/Knits');
var menuItem11 = new MenuItem('menu-item', '/men/jackets', 'Jackets/Coats');
var menuItem12 = new MenuItem('menu-item', '/men/blazers', 'Blazers');
var menuItem13 = new MenuItem('menu-item', '/men/denim', 'Denim');
var menuItem14 = new MenuItem('menu-item', '/men/pants', 'Leggins/Pants');
var menuItem15 = new MenuItem('menu-item', '/men/skirts', 'Skirts/Shorts');
var menuItem16 = new MenuItem('menu-item', '/men/accessories', 'Accessories');

var menu1 = new SuperMenu('','drop-menu',[menuItem8, menuItem9, menuItem10, menuItem11, menuItem12,  menuItem13, menuItem14, menuItem15, menuItem16], '/men', 'Men');

var menu2 = new SuperMenu('','menu',[menuItem1, menu1, menuItem3, menuItem4, menuItem5, menuItem6, menuItem7]);


var $container = document.getElementById('nav_container');
$container.appendChild(menu2.render());

