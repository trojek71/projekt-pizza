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

      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      // console.log('imageWrapper',thisProduct.imageWrapper);
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
      const formData = utils.serializeFormToObject(thisProduct.form.options);

      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      const avaibleOptions = thisProduct.imageWrapper.querySelector('.active');
      console.log('Dostepne Opcje',avaibleOptions);

      let price = thisProduct.data.price;
      for ( let paramId in thisProduct.data.params){
        const param = thisProduct.data.params[paramId];

        for (let optionId in param.options){
          const option = param.options[optionId];
          const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;

          if(optionSelected && !option.default){
            price += param.options[optionId].price;

          }
          else if (!optionSelected && option.default){
            price -= param.options[optionId].price;
          }




        }


      }

      thisProduct.priceElem = price;
      console.log('set the contents of thisProduct.priceElem',thisProduct.priceElem);
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
      thisApp.initData();
      thisApp.initMenu();

    },
  };


  app.init();
}
