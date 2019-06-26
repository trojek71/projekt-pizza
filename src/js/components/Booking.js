/* eslint-disable no-unused-vars */
import {select,templates,settings} from '../settings.js';
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
    thisBooking.getData();

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
  getData(){
    const thisBooking = this;

    const startEndDates = {};
    startEndDates[settings.db.dateStartParamKey] = utils.dateToStr(thisBooking.datePicker.minDate);
    startEndDates[settings.db.dateEndParamKey] = utils.dateToStr(thisBooking.datePicker.maxDate);

    const endDate = {};
    endDate[settings.db.dateEndParamKey] = startEndDates[settings.db.dateEndParamKey];

    const params = {
      booking: utils.queryParams(startEndDates),
      eventsCurrent: settings.db.notRepeatParam + '&' + utils.queryParams(startEndDates),
      eventsRepeat: settings.db.repeatParam + '&' + utils.queryParams(endDate),
    };

    console.log('getData params', params);


    const urls = {
      booking: settings.db.url + '/' + settings.db.booking + '?' + params.booking,
      eventsCurrent: settings.db.url + '/' + settings.db.event + '?' + params.eventsCurrent,
      eventsRepeat: settings.db.url + '/' + settings.db.event + '?' + params.eventsRepeat,
    };

    console.log('getData urls', urls);



    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function([bookingsResponse, eventsCurrentResponse, eventsRepeatResponse]){
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function([bookings, eventsCurrent, eventsRepeat]){
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });

  }

  parseData(bookings,eventsCurrent,eventsRepeat){
    const thisBooking=this;
    thisBooking.booked ={};

    console.log('eventCurrent',eventsCurrent);
    //console.log('repat',);
    for (let element  of eventsCurrent) {
      console.log('element:',element);
      //thisBooking.makeBooked(eventsCurrent.data);


    }


  }
}
