import * as THREE from 'three'
import $ from 'jquery'
import EventEmitter from 'eventemitter2'
import CrossSectionDrawing from './cross-section-drawing'
import ForceDrawing from './force-drawing'
import PlanetClick from './planet-click'

// Mouse position in pixels.
export function mousePos (event, targetElement) {
  const $targetElement = $(targetElement)
  const parentX = $targetElement.offset().left
  const parentY = $targetElement.offset().top
  return {x: event.pageX - parentX, y: event.pageY - parentY}
}

// Normalized mouse position [-1, 1].
export function mousePosNormalized (event, targetElement) {
  const pos = mousePos(event, targetElement)
  const $targetElement = $(targetElement)
  const parentWidth = $targetElement.width()
  const parentHeight = $targetElement.height()
  pos.x = (pos.x / parentWidth) * 2 - 1
  pos.y = -(pos.y / parentHeight) * 2 + 1
  return pos
}

export default class InteractionsManager {
  constructor (view) {
    this.view = view

    this.emitter = new EventEmitter()

    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2(-2, -2) // intentionally out of view, which is limited to [-1, 1] x [-1, 1]
    this.followMousePosition()

    // Plug into view rendering cycle.
    this.view.onRenderCallback = this.testForInteractions.bind(this)

    this.getIntersection = this.getIntersection.bind(this)
    this.emit = this.emit.bind(this)

    this.interactionInProgress = false
    this.interactions = {
      crossSection: new CrossSectionDrawing(this.getIntersection, this.emit),
      force: new ForceDrawing(this.getIntersection, this.emit),
      fieldInfo: new PlanetClick(this.getIntersection, this.emit, 'fieldInfo')
    }
    this.interaction = 'none'
  }

  setInteraction (name) {
    for (let name of Object.keys(this.interactions)) {
      const interaction = this.interactions[name]
      this.setInteractionInactive(interaction, name)
    }
    this.interactionInProgress = false
    this.interaction = name
  }

  getIntersection (mesh) {
    return this.raycaster.intersectObject(mesh)[0] || null
  }

  emit (event, data) {
    this.emitter.emit(event, data)
  }

  on (event, handler) {
    this.emitter.on(event, handler)
  }

  testForInteractions () {
    this.raycaster.setFromCamera(this.mouse, this.view.camera)

    if (this.interactionInProgress) {
      // It means that user pressed the mouse button or touched the screen.
      // Nothing more to do here, interaction handlers will be called on appropriate events.
      // Note that it's important to update raycaster anyway.
      return
    }

    let anyInteractionActive = false
    for (let name of Object.keys(this.interactions)) {
      if (this.interaction !== name) continue
      const interaction = this.interactions[name]
      if (!anyInteractionActive && interaction.test()) {
        this.setInteractionActive(interaction, name)
        anyInteractionActive = true
      } else {
        this.setInteractionInactive(interaction, name)
      }
    }

    this.view.controls.enableRotate = !anyInteractionActive
  }

  setInteractionActive (interaction, name) {
    if (interaction.active) return
    interaction.setActive()
    let namespace = `interaction-${name}`
    let $elem = $(this.view.domElement)
    $elem.on(`mousedown.${namespace} touchstart.${namespace}`, () => {
      this.interactionInProgress = true
      if (interaction.onMouseDown) {
        interaction.onMouseDown()
      }
    })
    $elem.on(`mousemove.${namespace} touchmove.${namespace}`, () => {
      if (interaction.onMouseMove && this.interactionInProgress) {
        interaction.onMouseMove()
      }
    })
    $elem.on(`mouseup.${namespace} touchend.${namespace} touchcancel.${namespace}`, () => {
      this.interactionInProgress = false
      if (interaction.onMouseUp) {
        interaction.onMouseUp()
      }
    })
  }

  setInteractionInactive (interaction, name) {
    if (!interaction.active) return
    interaction.setInactive()
    const namespace = `interaction-${name}`
    $(this.view.domElement).off(`.${namespace}`)
  }

  followMousePosition () {
    const onMouseMove = (event) => {
      const pos = mousePosNormalized(event, this.view.domElement)
      this.mouse.x = pos.x
      this.mouse.y = pos.y
    }
    $(this.view.domElement).on('mousemove touchmove', onMouseMove)
  }
}