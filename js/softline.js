'use strict';

(function() {
    var basket = [{ //масив корзины
            id: 0,
            image: "img/коробка1.jpg",
            title: "ABBYY Buisnes Card Read 2.0 для Windows",
            termlessLicense: "Безсрочная электронная лицензия",
            delivery: 'Нa e-mail',
            price: 2100,
            currency: 'руб.',
            doscount: '',
            num: 1,
        },
        {
            id: 1,
            image: "img/коробка2.jpg",
            title: "ABBYY FineReader 14 Standart",
            termlessLicense: 'Электронная лицензия/ключ (безсрочная)',
            delivery: 'Нa e-mail',
            price: 6990,
            currency: 'руб.',
            doscount: '',
            num: 1,
        }
    ];

    // ф-ия создает элементы для вставки в DOM
    var createElement = function(tagName, className, text) {
        var element = document.createElement(tagName);
        var classNames = className.split(' ');
        classNames.forEach(function(classNamesItem) {
            element.classList.add(classNamesItem)
        });
        if (text) {
            element.textContent = text;
        }
        return element;
    };

    //Ф-ия обновляет состояние корзины и отрисовывает элементы корзины ссылаясь на элементы обновленного массива "basket"
    var updatCart = function() {
        var containers = document.querySelectorAll('.table-basket__item');
        if (containers) {
            var basketList = document.querySelector('.table-basket__products');
            containers.forEach(function(basketListItem, index) {
                basketList.removeChild(containers[index])
            })
        }
        basket.forEach(function(basketItem, index) {
            var container = createElement('div', 'table-basket__item');
            basketList.appendChild(container);
            var prductDescription = createElement('td', 'table-basket__col table-basket__col--title');
            container.appendChild(prductDescription);
            var prductImage = createElement('img', 'table-basket__img');
            // img.src = productsItem.image;
            prductDescription.appendChild(prductImage);
            var prductText = createElement('div', 'table-basket__product-name', basketItem.title);
            prductDescription.appendChild(prductText);
            var delivery = createElement('div', 'table-basket__col table-basket__col--delivery', basketItem.delivery);
            container.appendChild(delivery);
            var priceWrap = createElement('div', 'table-basket__col table-basket__col--price-wrap');
            container.appendChild(priceWrap);
            var price = createElement('div', 'table-basket__price', basketItem.price + basketItem.currency);
            priceWrap.appendChild(price);
            var currency = createElement('div', 'table-basket__currency currency', basketItem.currency);
            priceWrap.appendChild(currency);
            var discount = createElement('div', 'table-basket__col table-basket__col--discount', basketItem.discount);
            container.appendChild(discount);
            var counterWrap = createElement('div', 'table-basket__col table-basket__col--counter table-basket__col--counter-main', basketItem.counter);
            container.appendChild(counterWrap);
            var buttonMinus = createElement('button', 'table-basket__btn table-basket__btn--minus button', ' ');
            counterWrap.appendChild(buttonMinus);
            var counterNum = createElement('div', 'table-basket__counter-num', basketItem.num || '0');
            counterWrap.appendChild(counterNum);
            var buttonAdd = createElement('button', 'table-basket__btn table-basket__btn--plus button', '+');
            counterWrap.appendChild(buttonAdd);
            var sumWrap = createElement('div', 'table-basket__col table-basket__col--sum');
            container.appendChild(sumWrap);
            var sum = createElement('div', 'table-basket__price-sum', (basketItem.num * basketItem.price || "0"));
            sumWrap.appendChild(sum);
            sumWrap.appendChild(currency);
            var removeProduct = createElement('bitton', 'table-basket__btn-remove button button', '+');
            sumWrap.appendChild(removeProduct);
            removeProduct.dataset.id = index;
            container.dataset.id = index;
            buttonMinus.dataset.id = index;
            buttonAdd.dataset.id = index;
            counterNum.dataset.id = index;
        })
        saveToStorage(); //запишем в localStorage обновленный список 
        onClickRemoveFromBasket(); // вешаю слушатели на обновленные кнопки "Закрыть" элементов корзины
        onClickaPlusProduct();
        onClickaMinusProduct();
        basketSum(basket); //обновляем общую сумму
    };

    //ф-ия вешает слушатель на кнопку "закрыть"
    var onClickRemoveFromBasket = function() {
        var btnClose = document.querySelectorAll('.table-basket__btn-remove');
        btnClose.forEach(function(btnCloseItem) {
            btnCloseItem.addEventListener('click', removeFromBasket);
        })
    };

    var onClickaPlusProduct = function() {
        var btnPlusProduct = document.querySelectorAll('.table-basket__btn--plus');
        btnPlusProduct.forEach(function(btnPlusProductItem) {
            btnPlusProductItem.addEventListener('click', countePluse)
        })
    }

    var onClickaMinusProduct = function() {
        var btnMinusProduct = document.querySelectorAll('.table-basket__btn--minus');
        btnMinusProduct.forEach(function(btnMinusProductItem) {
            btnMinusProductItem.addEventListener('click', counteMinus)
        })
    }

    var countePluse = function(evt) {
        var id = evt.target.dataset.id;
        var btnPlusProduct = document.querySelectorAll('.table-basket__btn--plus');
        btnPlusProduct.forEach(function(btnPlusProductItem, index) {
            if (btnPlusProductItem.dataset.id === id) {
                basket[index].num += 1;
            }
            updatCart();
        })
    }

    var counteMinus = function(evt) {
        var id = evt.target.dataset.id;
        var btnMinusProduct = document.querySelectorAll('.table-basket__btn--minus');
        btnMinusProduct.forEach(function(btnMinusProductItem, index) {
            if (btnMinusProductItem.dataset.id === id) {
                basket[index].num -= 1;
                var count = basket[index].num
                if (basket[index].num < 0) {
                    basket[index].num = 0
                }
            }
            updatCart();
        })
    }

    //ф-ия сохраняет в localStorage данные
    var saveToStorage = function() {
        var serialBasket = JSON.stringify(basket); //сериализуем 
        localStorage.setItem("products", serialBasket); //запишем в хранилище по ключу "products"
    };

    //ф-ия получает из localStorage данные
    var getToStorage = function() {
        var returnBasket = JSON.parse(localStorage.getItem("products")) //спарсим его обратно объект
        if (returnBasket) {
            basket = returnBasket;
            updatCart()
        }
    };

    //ф-ия удаляет элемент из коллекции "basket" и отрисовывает обновленную коллекцию в элементы корзины
    var removeFromBasket = function(evt) {
        var btnClose = document.querySelectorAll('.table-basket__item');
        var id = evt.target.dataset.id;
        btnClose.forEach(function(btnCloseItem) {
            if (btnCloseItem.dataset.id === id) {
                basket.splice(id, 1); // удаляю  элемент коллекции
                updatCart();
            }
        })
    };

    // ф-ия считает общую сумму корзины покупок
    function basketSum(array) {
        var basketSum = document.querySelector('.last-row__sum')
        var sum = 0;
        array.forEach(function(arrayItem) {
            console.log(arrayItem);
            sum += arrayItem.price * arrayItem.num;
        })
        basketSum.textContent = sum;
        console.log(sum);
        return (basketSum)
    };

    //  окно alert с покупками
    var onCheckout = function() {
        var basketSum = document.querySelector('.last-row__sum')
        var productInBasket = basket.map(function(item) {
            return item.title + ' ' + item.num + 'шт '
        })
        var productInBasketStr = productInBasket.join("; ")
        alert('Вы добавили в корзину ' + productInBasketStr + ' на сумму ' + basketSum.textContent + ' руб.')
    };

    var checkoutBtn = document.querySelector('.apply-order');
    checkoutBtn.addEventListener('click', onCheckout); // вызов алерт после клика кнопки "оформить заказ"

    // отрисовываем элементы каталога, проверяем localStorage, если есть элементы отрисовываем в "basket",
    getToStorage();
    updatCart()
        // localStorage.clear()
})();