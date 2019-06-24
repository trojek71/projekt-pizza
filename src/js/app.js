/* eslint-disable no-unused-vars */
import {Product} from './components/Product.js';
import {Cart} from './components/Cart.js';
import {select,settings, classNames} from './settings.js';
import {Booking} from './components/Booking.js';


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

  },

  init: function(){
    const thisApp = this;
    thisApp.initPages();
    thisApp.initData();
    thisApp.initCart();
    thisApp.initBooking();

  },
  initCart: function(){
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
    });
  },
  initPages(){
    const thisApp = this;
    thisApp.pages = Array.from(document.querySelector(select.containerOf.pages).children);
    thisApp.navLinks = Array.from(document.querySelectorAll(select.nav.links));
    console.log('active pages', thisApp.pages);
    //thisApp.activatePage(thisApp.pages[0].id);
    let pagesMatchingHash =[];
    if (window.location.hash.leght >2){
      const  idFromHash = window.location.hash.replace('#/','');
      pagesMatchingHash = thisApp.pages.filter(function(page){
        return page.id == idFromHash;
      });
    }
    thisApp.activatePage(pagesMatchingHash.leght ? pagesMatchingHash[0].id : thisApp.pages[1].id);
    for(let link of thisApp.navLinks){

      link.addEventListener('click', function(event){
        const clickedElement = this;

        event.preventDefault();
        const pageSelector = clickedElement.getAttribute('href');

        const pageSelectorEmpty = pageSelector.replace('#','');

        thisApp.activatePage(pageSelectorEmpty);


      });
    }




  },

  activatePage(pageId){
    const thisApp= this;
    window.location.hash = '#/' + pageId;
    for(let link of thisApp.navLinks){
      link.classList.toggle(classNames.nav.active, link.getAttribute('href') == '#' + pageId);

    }
    for (let page of thisApp.pages){

      page.classList.toggle(classNames.pages.active, page.id == pageId);
      console.log('active pages', thisApp.pages);
    }

  },

  initBooking(){

    const bookingContainer = document.querySelector(select.containerOf.booking);

    new Booking(bookingContainer);
    console.log('bookingConteiner',bookingContainer);
  }

};


app.init();


