import React, {Component} from 'react'
import {render} from 'react-dom'
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc'
import { Button } from 'react-toolbox/lib/button'

import '../../css/sortable-densities.less'

let key = 0

const SortableItem = SortableElement(({value}) =>
  <li className='density-button-container'>
    <Button className='preset-button density-button' key={key++} label={value}/>
  </li>
)

const SortableList = SortableContainer(({items}) => {
  return (
    <ul>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </ul>
  )
})

export default class SortableDensites extends Component {
  constructor (props) {
    super(props)
    this.state = {
      items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6']
    }
    this.onSortEnd = this.onSortEnd.bind(this)
    let elems = document.querySelector
  }
  onSortEnd ({oldIndex, newIndex}) {
    this.setState({
      items: arrayMove(this.state.items, oldIndex, newIndex)
    })
  }
  render () {
    return (
      <div className='densities'>
        <SortableList items={this.state.items} onSortEnd={this.onSortEnd} />
      </div>
    )
  }
}
