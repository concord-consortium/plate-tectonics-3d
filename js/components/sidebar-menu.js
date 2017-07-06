import React, { PureComponent } from 'react'
import { Sidebar } from 'react-toolbox'
import { IconButton } from 'react-toolbox/lib/button'
import { List, ListItem, ListCheckbox } from 'react-toolbox/lib/list'
import Dropdown from 'react-toolbox/lib/dropdown'

const INTERACTION_OPTIONS = [
  { value: 'none', label: 'None (camera navigation)' },
  { value: 'crossSection', label: 'Draw a cross section line' },
  { value: 'force', label: 'Assign forces to plates' },
  { value: 'fieldInfo', label: 'Log field data to browser console' }
]

const COLORMAP_OPTIONS = [
  { value: 'topo', label: 'Topographic' },
  { value: 'plate', label: 'Plate color' }
]

export default class SidebarMenu extends PureComponent {
  constructor (props) {
    super(props)

    this.toggleWireframe = this.toggleOption.bind(this, 'wireframe')
    this.toggleVelocities = this.toggleOption.bind(this, 'renderVelocities')
    this.toggleForces = this.toggleOption.bind(this, 'renderForces')
    this.toggleBoundaries = this.toggleOption.bind(this, 'renderBoundaries')
    this.toggleEulerPoles = this.toggleOption.bind(this, 'renderEulerPoles')
    this.changeColormap = this.handleChange.bind(this, 'colormap')
    this.changeInteraction = this.handleChange.bind(this, 'interaction')
  }

  get options () {
    return this.props.options
  }

  handleChange (name, value) {
    const {onOptionChange} = this.props
    onOptionChange(name, value)
  }

  toggleOption (name) {
    const {onOptionChange} = this.props
    onOptionChange(name, !this.options[name])
  }

  render () {
    const {active, onClose} = this.props
    const options = this.options
    return (
      <Sidebar pinned={active} type='right' className='sidebar'>
        <IconButton icon='close' onClick={onClose} />
        <List>
          <ListItem
            ripple={false}
            itemContent={
              <Dropdown
                className='dropdown-wide'
                label='Select interaction'
                source={INTERACTION_OPTIONS}
                value={options.interaction}
                onChange={this.changeInteraction}
              />
            }
          />
          <ListItem
            ripple={false}
            itemContent={
              <Dropdown
                label='Select color scheme'
                source={COLORMAP_OPTIONS}
                value={options.colormap}
                onChange={this.changeColormap}
              />
            }
          />
          <ListCheckbox caption='Velocity arrows' legend='Show plate motion'
            checked={options.renderVelocities} onChange={this.toggleVelocities} />
          <ListCheckbox caption='Force arrows' legend='Show forces acting on a plate'
            checked={options.renderForces} onChange={this.toggleForces} />
          <ListCheckbox caption='Euler poles' legend='Show axes of rotation'
            checked={options.renderEulerPoles} onChange={this.toggleEulerPoles} />
          <ListCheckbox caption='Plate boundaries' legend='Highlight plate boundaries'
            checked={options.renderBoundaries} onChange={this.toggleBoundaries} />
          <ListCheckbox caption='Wireframe' legend='See through the plate surface'
            checked={options.wireframe} onChange={this.toggleWireframe} />
        </List>
      </Sidebar>
    )
  }
}