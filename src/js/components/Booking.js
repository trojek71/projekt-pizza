/* eslint-disable no-unused-vars */
import {select,templates} from '../settings.js';
import {utils} from '../utils.js';
import {AmountWidget} from './AmountWidget.js';
import {DatePicker} from './DatePicker.js';
import {HourPicker} from './HourPicker.js';


export class Booking{
  constructor(bookingContainer){
    const thisBooking = this;

    thisBooking.bookingContainer= bookingContainer;
    thisBooking.render(bookingContainer);
    thisBooking.initWidges();

  }
  render(){
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();

    thisBooking.dom ={};
    thisBooking.dom.wrapper = thisBooking.bookingContainer;


    thisBooking.dom.wrapper.innerHTML= generatedHTML;

    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);


    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);

    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    console.log('thisBooking.dom.datePicker;',thisBooking.dom.datePicker);
    thisBooking.dom.hourPicker= thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
  }

  initWidges(){
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker= new HourPicker(thisBooking.dom.hourPicker);


  }


}
