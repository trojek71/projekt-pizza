import {select,settings} from '../settings.js';

export class AmountWidget{
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
