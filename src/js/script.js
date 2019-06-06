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
  /* New class Product */

  class Product{
    constructor(id, data){
      const thisProduct = this;
      thisProduct.id= id;
      thisProduct.data= data;
      thisProduct.renderInMenu();
      thisProduct.initAccordion();

      console.log('new Product', thisProduct);
    }

    renderInMenu(){
      const thisProduct = this;
      /* generate HTML based on templates */
      const generateHTML = templates.menuProduct(thisProduct.data);

      console.log('generateHTML',generateHTML);
      console.log('thisProduct.Data',thisProduct.data);

      /* create element usig utils.createElementFromHTML */
      thisProduct.element = utils.createDOMFromHTML(generateHTML);
      console.log('thisProduct.element', thisProduct.element);

      /* find menu container */
      const menuContainer = document.querySelector(select.containerOf.menu);

      /* add element to menu */
      menuContainer.appendChild(thisProduct.element);
    }
    initAccordion(){
    const thisProduct = this;
    /* find the clickable trigger (the element that should react to clicking) */
    const triggers = thisProduct.element.querySelectorAll(select.menuProduct.clickable);
    console.log(' triggers',triggers);
    /* START: click event listener to trigger */

    for (let trigger of triggers){
    trigger.addEventListener('click', function(event){
      /* prevent default action for event */
      event.preventDefault();

      console.log(' triggers',trigger);
      /* toggle active class on element of thisProduct */
      thisProduct.element.classList.add('active');

      const activeProducts = thisProduct.element.querySelectorAll(select.menuProduct.clickable);
      console.log('aktywne Produkty',activeProducts);

      for(let activeProduct of activeProducts){
       if (activeProduct != thisProduct.products){
          console.log('elementy produktu',activeProduct);
         thisProduct.element.classList.remove('active');
         console.log('elementy do usuniecia ',thisProduct.element);
        }
        else {thisProduct.element.classList.add('active');
     }

      }

    });
  }







    /* START LOOP: for each active product */

    /* START: if the active product isn't the element of thisProduct */

    /* remove class active for the active product */

    /* END: if the active product isn't the element of thisProduct */

    /* END LOOP: for each active product */

    /* END: click event listener to trigger */

    }

  }

  const app = {

    initMenu: function(){
      const thisApp = this;
      console.log('thisApp.data:',this.data);
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
