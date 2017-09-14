import PropTypes from 'prop-types';
import React from 'react';
import cn from 'classnames';
import message from './utils/messages';
import { navigate } from './utils/constants';

class Toolbar extends React.Component {
  static propTypes = {
    view: PropTypes.string.isRequired,
    views: PropTypes.arrayOf(
      PropTypes.string,
    ).isRequired,
    label: PropTypes.node.isRequired,
    messages: PropTypes.object,
    onNavigate: PropTypes.func.isRequired,
    onViewChange: PropTypes.func.isRequired,
    additionalContent: PropTypes.node
  }

  render() {
    let { messages, label } = this.props;

    messages = message(messages)

    return (
      <div className='rbc-toolbar'>
        <span className='rbc-btn-group'>
          <button
            type='button'
            className={cn(`rbc-toolbar-btn-${messages.today.toLowerCase()}`)}
            onClick={this.navigate.bind(null, navigate.TODAY)}
          >
            <span className="rbc-toolbar-btn-message">{messages.today}</span>
          </button>
          <button
            type='button'
            className={cn(`rbc-toolbar-btn-${messages.previous.toLowerCase()}`)}
            onClick={this.navigate.bind(null, navigate.PREVIOUS)}
          >
            <span className="rbc-toolbar-btn-message">{messages.previous}</span>
          </button>
          <button
            type='button'
            className={cn(`rbc-toolbar-btn-${messages.next.toLowerCase()}`)}
            onClick={this.navigate.bind(null, navigate.NEXT)}
          >
            <span className="rbc-toolbar-btn-message">{messages.next}</span>
          </button>
        </span>

        <span className='rbc-toolbar-label'>
          { label }
        </span>

        <span className='rbc-btn-group'>
        {
          this.viewNamesGroup(messages)
        }
        </span>

        {/* NOTE: may be reordered by order style property */}
        {this.props.additionalContent}
      </div>
    );
  }

  navigate = (action) => {
    this.props.onNavigate(action)
  }

  view = (view) => {
    this.props.onViewChange(view)
  }

  viewNamesGroup(messages) {
    let viewNames = this.props.views
    const view = this.props.view

    if (viewNames.length > 1) {
      return (
        viewNames.map(name =>
          <button type='button' key={name}
            className={cn(`rbc-toolbar-btn-${name.toLowerCase()}`, {'rbc-active': view === name})}
            onClick={this.view.bind(null, name)}
          >
            <span className="rbc-toolbar-btn-message">{messages[name]}</span>
          </button>
        )
      )
    }
  }
}

export default Toolbar;
