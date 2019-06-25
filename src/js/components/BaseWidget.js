export class BaseWidget{
  constructor(wrapperElement,initialValue){
    const thisWidget = this;
    thisWidget.dom = wrapperElement;
    thisWidget.correctValue= initialValue;

  }
  get value(){
    const thisWidget=this;

    return thisWidget.correctValue;
  }
  set value(assingnedAvlue){
    const thisWidget= this;

    const newValue = thisWidget.parseValue(assingnedAvlue);

    if(newValue != thisWidget.correctValue && thisWidget.isValid(newValue)){
      thisWidget.correctValue= newValue;
      thisWidget.announce();
    }
    thisWidget.correctValue();
  }

  parseValue(newValue){
    return parseInt(newValue);
  }

  isValid(newValue){
    return !isNaN(newValue);
  }

  renderValue(){
    const thisWidget= this;

    console.log('widget value:', thisWidget.value);
  }

  announce(){
    const thisWidget= this;
    const event = new CustomEvent('updated',{
      bubbles: true
    });
    thisWidget.dom.wrapper.dispatchEvent(event);
  }

}

