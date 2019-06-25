import {select,settings} from '../settings.js';
import {BaseWidget} from './BaseWidget.js';

export class AmountWidget extends BaseWidget{
  constructor(wrapper){
    super (wrapper, settings.amountWidget.defaultValue);
    const thisWidget = this;


    thisWidget.getElements();
    //thisWidget.value = startingValue || settings.amountWidget.defaultValue;
    //thisWidget.setValue();
    thisWidget.initAction();
  }

  getElements(){
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);

  }

  /*setValue(value){
    const thisWidget = this;
    const newValue = parseInt(value);
    if ( (value >= settings.amountWidget.defaultMin) && (value <= settings.amountWidget.defaultMax) && (thisWidget.value != newValue)  ){
      thisWidget.value= newValue;
      thisWidget.announce();
    }
    thisWidget.input.value = thisWidget.value;
  }*/
  isValid(newValue){
    return !isNaN(newValue) && newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax;
  }

  initAction(){
    const   thisWidget = this;
    thisWidget.dom.input.addEventListener('change', function() {
      event.preventDefault();
      //thisWidget.setValue(thisWidget.input.value);
      thisWidget.value = thisWidget.dom.input.value;
    });
    thisWidget.linkDecrease.addEventListener('click',function(){
      event.preventDefault();
      //thisWidget.setValue(thisWidget.value -1 );
      thisWidget.value = --thisWidget.dom.input.value;
    });
    thisWidget.linkIncrease.addEventListener('click',function(){
      event.preventDefault();
      //thisWidget.setValue(thisWidget.value + 1);
      thisWidget.value = ++thisWidget.dom.input.value;
    });
  }
  //announce(){
  //  const thisWidget = this;
  //  const event = new CustomEvent('updated',{bubbles: true});
  //  thisWidget.element.dispatchEvent(event);
  //}
  renderValue(){
    const thisWidget= this;
    thisWidget.dom.input.value = thisWidget.value;
  }
}
