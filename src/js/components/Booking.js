/* eslint-disable no-unused-vars */
import {select,templates} from '../settings.js';
import {utils} from '../utils.js';
import { AmountWidget } from './AmountWidget.js';


export class Booking{
  constructor(widgetContener){
    const thisBooking = this;

    thisBooking.render(widgetContener);
    thisBooking.initWidges();

  }
  render(){
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();

    thisBooking.dom ={};
    thisBooking.dom.wrapper = utils.createDOMFromHTML(generatedHTML);

    const widgetContener = document.querySelector(select.containerOf.booking);
    console.log('widgetContainer',widgetContener);
    widgetContener.appendChild(thisBooking.dom.wrapper);


    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);

    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);

    //thisBooking.dom.hoursAmount.innerHTML = thisBooking.peopleAmount;

    //thisBooking.dom.peopleAmount.innerHTML = thisBooking.peopleAmount;


  }

  initWidges(){
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    console.log('aaaa',thisBooking.peopleAmount);


    thisBooking.hoursAmount = new AmountWidget(thisBooking.widgetContener.hoursAmount);

  }


}
