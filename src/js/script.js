/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
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
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };


  class Product{
    constructor(id, data){
      const thisProduct = this;
      thisProduct.id= id;
      thisProduct.data= data;
      thisProduct.renderInMenu();
      thisProduct.initAccordion();
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
        console.log('button',thisProduct.cartButton);
        event.preventDefault();
        thisProduct.processOrder();
      });
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.form.addEventListener('submit', function(event){
        console.log('button',thisProduct.formInputs);
        event.preventDefault();
        thisProduct.processOrder();
      });
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      for(let input of thisProduct.formInputs){
        input.addEventListener('change', function(){
          console.log('button',input);
          thisProduct.processOrder();
        });
      }
    }

    processOrder(){
      const thisProduct = this;
      const formData = utils.serializeFormToObject(thisProduct.form);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      let price = thisProduct.data.price;
      console.log('Cena wyjściowa:',price);
      for ( let paramId in thisProduct.data.params){
        const param = thisProduct.data.params[paramId];
        for (let optionId in param.options){
          const option = param.options[optionId];
          const Images = thisProduct.imageWrapper.querySelectorAll('.'+paramId+'-'+optionId);
          console.log('aktywne obrazki',Images);
          const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;
          if(optionSelected && !option.default){
            price += param.options[optionId].price;
            console.log('nowa powiększona cena:',price);
          }
          else if (!optionSelected && option.default){
            price -= param.options[optionId].price;
            console.log('nowa pomniejszona cena:',price);
          }
          if (( optionSelected && option.default) || ( optionSelected && !option.default)) {
            for (let Image of Images ){
              Image.classList.add('active');
              console.log('dodanie klasy active');
            }
          }
          else
          {
            for (let Image of Images){
              Image.classList.remove('active');
              console.log('odebranie klasy active'); }
          }
        }
      }
      thisProduct.priceElem = price;
      console.log('PRICE ELEMENT:',thisProduct.priceElem);
      price *= thisProduct.amountWidget.value;
      thisProduct.priceElem = price;
      console.log('NOWA CENA',thisProduct.priceElem);
    }

    initamountWidget(){
      const thisProduct = this;
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
      console.log('thisProduct.amountWidgetElem',thisProduct.amountWidgetElem);

      thisProduct.amountWidgetElem.addEventListener('updated', function(){
        console.log('zzzzzzzz',thisProduct.amountWidgetElem);
        thisProduct.processOrder();
      });

    }





  }

  class AmountWidget{
    constructor(element){
      const thisWidget = this;
      thisWidget.getElements(element);
      thisWidget.value = settings.amountWidget.defaultValue;
      console.log('Value',thisWidget.value);
      thisWidget.setValue();
      thisWidget.initAction();
      console.log('AmountWitget:', thisWidget);
      console.log('constructor arguments:',element);

    }

    getElements(element){
      const thisWidget = this;

      thisWidget.element = element;
      console.log('thisWidget :',thisWidget);
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);

    }

    setValue(value){
      const thisWidget = this;

      const newValue = parseInt(value);
      console.log(' WARTOŚĆ', newValue);
      /* TODO: Add validation*/
      if ( (value >= settings.amountWidget.defaultMin) && (value <= settings.amountWidget.defaultMax) && (thisWidget.value != newValue)  ){
        thisWidget.value= newValue;
        thisWidget.announce();
        console.log('WYKONANIE PĘTLI');
      }

      thisWidget.input.value = thisWidget.value;
    }

    initAction(){
      const   thisWidget = this;
      //thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);

      thisWidget.input.addEventListener('change', function() {
        console.log('button input',thisWidget.input.value);

        thisWidget.setValue(thisWidget.input.value);
      });

      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);


      thisWidget.linkDecrease.addEventListener('click',function(event){
        console.log('button decrease',thisWidget.linkDecrease);
        event.preventDefault();

        thisWidget.setValue(thisWidget.value -1 );
        console.log('aaaaaaaaaaaaa', thisWidget.value - 1 );
      });


      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);

      thisWidget.linkIncrease.addEventListener('click',function(){
        console.log('button increase',thisWidget.linkIncrease);
        event.preventDefault();

        thisWidget.setValue(thisWidget.value + 1);
        console.log('bbbbbbbbbbb',thisWidget.value);
      });





    }
    announce(){
      const thisWidget = this;
      const event = new Event('updated');
      thisWidget.element.dispatchEvent(event);
    }



  }




  const app = {

    initMenu: function(){
      const thisApp = this;
      for (let productData in thisApp.data.products){
        new Product(productData,thisApp.data.products[productData]);
      }
    },

    initData: function(){
      const thisApp = this;
      thisApp.data = dataSource;
    },



    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);
      console.log('widget',AmountWidget);
      thisApp.initData();
      thisApp.initMenu();

    },
  };


  app.init();
}
