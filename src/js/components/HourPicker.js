import {BaseWidget} from './BaseWidget.js';
import {utils} from '../utils.js';
import {select,settings} from '../settings.js';

export class HourPicker extends BaseWidget{
  constructor(wrapper){
    super (wrapper, settings.hours.open);
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
    thisWidget.dom.output= thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);
    thisWidget.initPlugin();
    thisWidget.Value= thisWidget.dom.input.value;


    thisWidget.parseValue();
    thisWidget.renderValue();

  }

  initPlugin(){
    const thisWidget = this;

    rangeSlider.create(thisWidget.dom.input);

    thisWidget.dom.input.addEventListener('input',function(){
     thisWidget.value= thisWidget.dom.input.value;

      console.log('Widget Value:',thisWidget.value);
    });
  }

  parseValue(Value){
    const thisWidget = this;
    console.log('parse Value', thisWidget.Value );
      return utils.numberToHour(Value);

  }
  isValid(newValue){

    return true;
  }

  renderValue(){
    const thisWidget= this;
    console.log('output',thisWidget.dom.output);
    thisWidget.dom.output.innerHTML=thisWidget.value;

    console.log('dom value:', thisWidget.dom.output.innerHTML);
  }


}
