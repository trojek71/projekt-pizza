/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars
/* eslint-disable no-unused-vars  */
{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product', // CODE ADDED
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input.amount', // CODE CHANGED
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    // CODE ADDED START
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: '.cart__total-number',
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
      amountWidget: '.widget-amount',

    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
    // CODE ADDED END
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    // CODE ADDED START
    cart: {
      wrapperActive: 'active',
    },
    // CODE ADDED END
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }, // CODE CHANGED
    // CODE ADDED START
    cart: {
      defaultDeliveryFee: 20,
    },
    // CODE ADDED END
    db: {
      url: '//localhost:3131',
      product: 'product',
      order: 'order',
    },
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    // CODE ADDED START
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
    // CODE ADDED END


  };



  class Product{
    constructor(id, data){
      const thisProduct = this;
      thisProduct.id= id;
      thisProduct.data= data;
      thisProduct.renderInMenu();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initamountWidget();
      thisProduct.processOrder();

    }

    renderInMenu(){

      const thisProduct = this;
      const generateHTML = templates.menuProduct(thisProduct.data);

      thisProduct.element = utils.createDOMFromHTML(generateHTML);
      const menuContainer = document.querySelector(select.containerOf.menu);
      menuContainer.appendChild(thisProduct.element);
      const totalPrice = document.querySelector(select.menuProduct.priceElem);
    }

    getElements(){
      const thisProduct = this;
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);

    }


    initAccordion(){
      const thisProduct = this;
      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.accordionTrigger.addEventListener('click', function(event){
        event.preventDefault();
        thisProduct.element.classList.add(classNames.menuProduct.wrapperActive);
        const activeProducts = document.querySelectorAll('.product.active');
        for(let activeProduct of activeProducts){
          if (activeProduct != thisProduct.element){
            activeProduct.classList.remove('active');
          }
        }
      });
    }

    initOrderForm(){
      const thisProduct = this;
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.cartButton.addEventListener('click', function(event){

        event.preventDefault();
        thisProduct.processOrder();
        thisProduct.addToCart();
      });
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.form.addEventListener('submit', function(event){

        event.preventDefault();
        thisProduct.processOrder();
      });
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      for(let input of thisProduct.formInputs){
        input.addEventListener('change', function(event){
          event.preventDefault();
          thisProduct.processOrder();
        });
      }
    }

    processOrder(){
      const thisProduct = this;
      const formData = utils.serializeFormToObject(thisProduct.form);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      thisProduct.params = {};
      let price = thisProduct.data.price;

      for ( let paramId in thisProduct.data.params){
        const param = thisProduct.data.params[paramId];
        for (let optionId in param.options){
          const option = param.options[optionId];
          const Images = thisProduct.imageWrapper.querySelectorAll('.'+paramId+'-'+optionId);

          const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;
          if(optionSelected && !option.default){
            price += param.options[optionId].price;

          }
          else if (!optionSelected && option.default){
            price -= param.options[optionId].price;

          }
          if (( optionSelected && option.default) || ( optionSelected && !option.default)) {
            if(!thisProduct.params[paramId]){
              thisProduct.params[paramId] = {
                label: param.label,
                options:{},
              };
            }
            thisProduct.params[paramId].options[optionId]= option.label;

            for (let Image of Images ){
              Image.classList.add('active');

            }
          }
          else
          {
            for (let Image of Images){
              Image.classList.remove('active');
            }
          }
        }
      }

      thisProduct.priceSingle = price;

      thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;


      thisProduct.element.querySelector(select.menuProduct.priceElem).innerHTML = thisProduct.price;




    }

    initamountWidget(){
      const thisProduct = this;

      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);

      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
      thisProduct.amountWidgetElem.addEventListener('updated', function(){
        thisProduct.processOrder();
      });

    }
    addToCart(){
      const thisProduct = this;
      thisProduct.name = thisProduct.data.name  ;
      thisProduct.amount = thisProduct.amountWidget.value ;
      app.cart.add(thisProduct);


    }

  }

  class AmountWidget{
    constructor(element,  startingValue){
      const thisWidget = this;

      thisWidget.getElements(element);
      thisWidget.value = startingValue || settings.amountWidget.defaultValue;
      thisWidget.setValue();
      thisWidget.initAction();
    }

    getElements(element){
      const thisWidget = this;
      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);

    }

    setValue(value){
      const thisWidget = this;
      const newValue = parseInt(value);
      if ( (value >= settings.amountWidget.defaultMin) && (value <= settings.amountWidget.defaultMax) && (thisWidget.value != newValue)  ){
        thisWidget.value= newValue;
        thisWidget.announce();
      }
      thisWidget.input.value = thisWidget.value;
    }

    initAction(){
      const   thisWidget = this;
      thisWidget.input.addEventListener('change', function() {
        event.preventDefault();
        thisWidget.setValue(thisWidget.input.value);
      });
      thisWidget.linkDecrease.addEventListener('click',function(){
        event.preventDefault();
        thisWidget.setValue(thisWidget.value -1 );
      });
      thisWidget.linkIncrease.addEventListener('click',function(){
        event.preventDefault();
        thisWidget.setValue(thisWidget.value + 1);
      });
    }
    announce(){
      const thisWidget = this;
      const event = new CustomEvent('updated',{bubbles: true});
      thisWidget.element.dispatchEvent(event);
    }
  }

  class Cart{
    constructor(element){
      const thisCart = this;

      thisCart.products = [];
      thisCart.getElements(element);
      thisCart.initActions();
      thisCart.deliveryFee = 20;
      thisCart.update();

    }


    getElements(element){
      const thisCart = this;

      thisCart.dom ={};

      thisCart.dom.wrapper = element;

      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);

      thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);

      thisCart.renderTotalsKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];

      for(let key of thisCart.renderTotalsKeys){
        thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
      }

      thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
      thisCart.phone =  document.querySelector('[name="phone"]');
      thisCart.address =  document.querySelector('[name="address"]');


    }
    initActions(){
      const thisCart = this;
      thisCart.dom.toggleTrigger.addEventListener('click',function(){
        thisCart.dom.wrapper.classList.toggle('active');
      });

      thisCart.dom.productList.addEventListener('remove',function(e){

        thisCart.remove(e.detail.cartProduct);
      });

      thisCart.dom.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisCart.sendOrder();


      });

    }

    remove(cartProduct){

      const thisCart = this;
      const index = thisCart.products.indexOf(cartProduct);
      cartProduct.dom.wrapper.remove();
      const removeProduct = thisCart.products.splice(index,1);
      thisCart.update();
    }





    add(menuProduct){

      const thisCart = this;


      const generatedHTML = templates.cartProduct(menuProduct);
      const generatedDOM = utils.createDOMFromHTML(generatedHTML);
      thisCart.dom.productList.appendChild(generatedDOM);
      thisCart.products.push(new CartProduct(menuProduct, generatedDOM));

      this.update();

      thisCart.dom.productList.addEventListener('updated',function(){
        thisCart.update();
      });
    }

    update(){
      const thisCart = this;
      thisCart.totalNumber = 0;
      thisCart.subtotalPrice = 0;



      for (let  product of thisCart.products){

        thisCart.totalNumber += product.amount;
        thisCart.subtotalPrice += product.price;
      }


      thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;


      for (let key of thisCart.renderTotalsKeys){
        for(let elem of thisCart.dom[key]){
          elem.innerHTML = thisCart[key];
        }
      }
    }
    sendOrder(data){

      const thisCart = this;

      const url = settings.db.url + '/' + settings.db.order;

      const payload = {
        address: thisCart.address.value,
        totalPrice: thisCart.totalPrice,
        phone: thisCart.phone.value,
        subtotalPrice: thisCart.subtotalPrice ,
        totalNumber: thisCart.totalNumber,
        products: [],

      };

      for (let product of thisCart.products ){

        product.getData();

        console.log('AAAAAAAA',product);

        payload.products.push (product);
      }


      ///payload.products.push ();

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      };

      fetch(url,options)
        .then(function(response){
          return response.json();
        }).then(function(parsedRespnse){
          console.log('parsedResponse', parsedRespnse);
        });


    }





  }


  class CartProduct{
    constructor(menuProduct, element){
      const thisCartProduct = this;

      thisCartProduct.id = menuProduct.id;
      thisCartProduct.name = menuProduct.name;
      thisCartProduct.price = menuProduct.price;
      thisCartProduct.priceSingle = menuProduct.priceSingle;
      thisCartProduct.amount = menuProduct.amount;
      thisCartProduct.params = JSON.parse(JSON.stringify(menuProduct.params));


      thisCartProduct.getElements(element);

      thisCartProduct.initamountWidget();
      thisCartProduct.initActions();

    }

    getElements(element) {
      const thisCartProduct = this;

      thisCartProduct.dom = {};

      thisCartProduct.dom.wrapper = element;
      thisCartProduct.dom.amountWidget = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget);
      thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);
      thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.edit);
      thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove);

    }

    initamountWidget(){
      const thisCartProduct = this;

      thisCartProduct.amountWidgetElem = thisCartProduct.dom.wrapper.querySelector(select.menuProduct.amountWidget);

      thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.amountWidgetElem, thisCartProduct.amount);

      thisCartProduct.amountWidgetElem.addEventListener('updated', function(){
        thisCartProduct.amount = thisCartProduct.amountWidget.value ;


        thisCartProduct.price = (thisCartProduct.amount * thisCartProduct.priceSingle);
        thisCartProduct.dom.price.innerHTML = thisCartProduct.price;

      });

    }
    remove(){
      const thisCartProduct = this;
      const event = new CustomEvent('remove', {
        bubbles: true,
        detail: {
          cartProduct: thisCartProduct,
        },
      });
      thisCartProduct.dom.wrapper.dispatchEvent(event);
      console.log('wywołanie metody usuwanie');
    }

    initActions(){
      const thisCartProduct = this;
      thisCartProduct.dom.edit.addEventListener('click',function(event){
        event.preventDefault();
      });

      thisCartProduct.dom.remove.addEventListener('click',function(event){
        event.preventDefault();
        thisCartProduct.remove();
      });
    }
    getData(){
      console.log('wywolanie getData');
      const thisCartProduct = this;

      console.log('PRODUKTY',thisCartProduct.params);
      const product = thisCartProduct.params;
      return product;


    }

  }

  const app = {

    initMenu: function(){
      const thisApp = this;
      for (let productData in thisApp.data.products){
        new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
      }

    },

    initData: function(){
      const thisApp = this;
      thisApp.data = {};
      const url = settings.db.url + '/' + settings.db.product;

      fetch(url)
        .then(function(rawReponse){
          return rawReponse.json();
        })
        .then(function(parsedResponse){
          console.log('parsedResponse',parsedResponse);
          /* save parsedRespnse as thisApp.data.products */
          thisApp.data.products = parsedResponse;
          /* execute initMenu method */
          thisApp.initMenu();
        });
      console.log('thisApp.data',JSON.stringify(thisApp.data));
    },

    init: function(){
      const thisApp = this;
      thisApp.initData();
      //thisApp.initMenu();
      thisApp.initCart();

    },
    initCart: function(){
      const thisApp = this;

      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);
    }


  };

  app.init();

}
