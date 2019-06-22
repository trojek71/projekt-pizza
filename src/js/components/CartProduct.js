import {select} from '../settings.js';
import{AmountWidget} from './AmountWidget.js';

export class CartProduct{
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


    const product = thisCartProduct;
    console.log('PRODUKTY',product);
    return product;


  }

}
