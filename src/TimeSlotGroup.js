import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TimeSlot from './TimeSlot'
import date from './utils/dates.js'
import localizer from './localizer'
import { elementType } from './utils/propTypes'

export default class TimeSlotGroup extends Component {
  static propTypes = {
    dayWrapperComponent: elementType,
    timeslots: PropTypes.number.isRequired,
    step: PropTypes.number.isRequired,
    value: PropTypes.instanceOf(Date).isRequired,
    showLabels: PropTypes.bool,
    isNow: PropTypes.bool,
    timeGutterFormat: PropTypes.string,
    culture: PropTypes.string
  }
  static defaultProps = {
    timeslots: 2,
    step: 30,
    isNow: false,
    showLabels: false
  }

  renderSlice(slotNumber, content, value) {
    const { dayWrapperComponent, showLabels, isNow, culture } = this.props;
    return (
      <TimeSlot
        key={slotNumber}
        dayWrapperComponent={dayWrapperComponent}
        showLabel={showLabels && !slotNumber}
        content={content}
        culture={culture}
        isNow={isNow}
        value={value}
      />
    )
  }

  renderSlices() {
    const ret = []
    const sliceLength = this.props.step
    let sliceValue = this.props.value
    for (let i = 0; i < this.props.timeslots; i++) {
      const content = localizer.format(sliceValue, this.props.timeGutterFormat, this.props.culture)
      ret.push(this.renderSlice(i, content, sliceValue))
      sliceValue = date.add(sliceValue, sliceLength, 'minutes')
    }
    return ret
  }
  render() {
    var height = {
      minHeight: this.props.timeslots * this.props.step +'px'
    }
    return (
      <div
          style={height}
          className="rbc-timeslot-group">
        {this.renderSlices()}
      </div>
    )
  }
}
