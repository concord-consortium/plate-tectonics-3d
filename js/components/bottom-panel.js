import React, { PureComponent } from 'react'
import { inject, observer } from 'mobx-react'
import ccLogo from '../../images/cc-logo.png'
import ccLogoSmall from '../../images/cc-logo-small.png'
import { Button } from 'react-toolbox/lib/button'
import FontIcon from 'react-toolbox/lib/font_icon'
import SidebarMenu from './sidebar-menu'
import config from '../config'

import '../../css/bottom-panel.less'

const SIDEBAR_ENABLED = config.sidebar && config.sidebar.length > 0

@inject('simulationStore') @observer
export default class BottomPanel extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      sidebarActive: false
    }

    this.toggleSidebar = this.toggleSidebar.bind(this)
    this.togglePlayPause = this.togglePlayPause.bind(this)
  }

  get options () {
    return this.props.simulationStore
  }

  get playPauseIcon () {
    return this.options.playing ? 'pause' : 'play_arrow'
  }

  get playPauseLabel () {
    return this.options.playing ? 'stop' : 'start'
  }

  togglePlayPause () {
    const { setOption } = this.props.simulationStore
    setOption('playing', !this.options.playing)
  }

  toggleSidebar () {
    const { sidebarActive } = this.state
    this.setState({ sidebarActive: !sidebarActive })
  }

  render () {
    const { sidebarActive } = this.state
    const { reload, restoreSnapshot, restoreInitialSnapshot, stepForward } = this.props.simulationStore
    const options = this.options
    return (
      <div className='bottom-panel'>
        <img src={ccLogo} className='cc-logo-large' />
        <img src={ccLogoSmall} className='cc-logo-small' />
        <div className='middle-widgets'>
          {
            config.planetWizard &&
            <Button className='inline-widget' onClick={reload}>
              <FontIcon value='replay' />
              <span className='label'>Reload</span>
            </Button>
          }
          <Button className='inline-widget' disabled={!options.snapshotAvailable} onClick={restoreInitialSnapshot}>
            <FontIcon value='skip_previous' />
            <span className='label'>Restart</span>
          </Button>
          <Button className='inline-widget' disabled={!options.snapshotAvailable} onClick={restoreSnapshot}>
            <FontIcon value='fast_rewind' />
            <span className='label'>Step back</span>
          </Button>
          <Button className='inline-widget' onClick={this.togglePlayPause}>
            <FontIcon value={this.playPauseIcon} />
            <span className='label'>{this.playPauseLabel}</span>
          </Button>
          <Button className='inline-widget' onClick={stepForward} disabled={options.playing}>
            <FontIcon value='fast_forward' />
            <span className='label'>Step forward</span>
          </Button>
        </div>
        {
          SIDEBAR_ENABLED &&
          <Button icon='menu' className='menu-button float-right' onClick={this.toggleSidebar} floating mini />
        }
        <SidebarMenu active={sidebarActive} onClose={this.toggleSidebar} />
      </div>
    )
  }
}
