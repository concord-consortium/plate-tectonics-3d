import React, { PureComponent } from 'react'
import renderCrossSection from '../plates-view/render-cross-section'

import '../../css/cross-section-2d.less'

export default class CrossSection2D extends PureComponent {
  componentDidMount () {
    this.renderCanvas()
  }

  componentDidUpdate () {
    this.renderCanvas()
  }

  renderCanvas () {
    const { data } = this.props
    renderCrossSection(this.canvas, data)
  }

  render () {
    const { swapped } = this.props
    return (
      <div className='cross-section-2d-view'>
        <div className='canvas-container'>
          <canvas ref={(c) => { this.canvas = c }} />
          <span className='left-label'>{ swapped ? 'P2' : 'P1' }</span>
          <span className='right-label'>{ swapped ? 'P1' : 'P2'}</span>
        </div>
      </div>
    )
  }
}