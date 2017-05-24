import PropTypes from 'prop-types';
import React, { Component } from 'react';
import cn from 'classnames';

import dates from './utils/dates';
import { elementType } from './utils/propTypes';
import BackgroundWrapper from './BackgroundWrapper';
import TimeSlotGroup from './TimeSlotGroup'
import moment from 'moment'

export default class TimeColumn extends Component {
  static propTypes = {
    step: PropTypes.number.isRequired,
    culture: PropTypes.string,
    timeslots: PropTypes.number.isRequired,
    now: PropTypes.instanceOf(Date).isRequired,
    min: PropTypes.instanceOf(Date).isRequired,
    max: PropTypes.instanceOf(Date).isRequired,
    showLabels: PropTypes.bool,
    timeGutterFormat: PropTypes.string,
    type: PropTypes.string.isRequired,
    className: PropTypes.string,
    dayWrapperComponent: elementType,
    dynamicSlots: PropTypes.bool
  }
  static defaultProps = {
    step: 30,
    timeslots: 2,
    showLabels: false,
    type: 'day',
    className: '',
    dayWrapperComponent: BackgroundWrapper,
    dynamicSlots: false
  }

  renderTimeSliceGroup(key, isNow, date, stepOpt) {
    const { dayWrapperComponent, timeslots, showLabels, step, timeGutterFormat, culture } = this.props;

    var tt = stepOpt / step
    return (
      <TimeSlotGroup
        key={key}
        isNow={isNow}
        value={date}
        step={step}
        culture={culture}
        timeslots={tt}
        showLabels={showLabels}
        timeGutterFormat={timeGutterFormat}
        dayWrapperComponent={dayWrapperComponent}
      />
    )
  }

  render() {
    const { className, children, style, now, min, max, step, timeslots, dynamicSlots } = this.props;
   const totalMin = dates.diff(min, max, 'minutes')
    const numGroups = Math.ceil(totalMin / (step * timeslots))
    const renderedSlots = []
    const groupLengthInMinutes = step * timeslots

    let date = min
    let next = date
    let isNow = false

    var hours = [8, 9, 10, 12, 16, 18];

    if (dynamicSlots) {
      for (var i = 0; i < hours.length -1; i++){
        var hour = hours[i]
        var start = moment(date).hour(hour)
        var end = moment(date).hour(hours[i+1])
        var stepOpt = end.diff(start, 'minutes')
        var res = this.renderTimeSliceGroup(i, false, date, stepOpt)
        renderedSlots.push(res)
        date = dates.add(date, stepOpt, 'minutes')
      }
    } else {
      for (var i = 0; i < numGroups; i++) {
        isNow = dates.inRange(
            now
            , date
            , dates.add(next, groupLengthInMinutes - 1, 'minutes')
            , 'minutes'
        )

        next = dates.add(date, groupLengthInMinutes, 'minutes');
        renderedSlots.push(this.renderTimeSliceGroup(i, isNow, date))

        date = next
    }

    return (
      <div
        className={cn(className, 'rbc-time-column')}
        style={style}
      >
        {renderedSlots}
        {children}
      </div>
    )
  }
}
