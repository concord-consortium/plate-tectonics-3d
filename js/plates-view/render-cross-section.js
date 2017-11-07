import * as THREE from 'three'
import config from '../config'

const OCEANIC_CRUST_COL = '#27374f'
const CONTINENTAL_CRUST_COL = '#643d0c'
const LITHOSPHERE_COL = '#666'
const MANTLE_COL = '#033f19'

const HEIGHT = 160 // px
const SKY_PADDING = 30 // px, area above the dynamic cross section view, filled with sky gradient
const MAX_ELEVATION = 1
const MIN_ELEVATION = 0.7 * config.subductionMinElevation

function scaleX (x) {
  return Math.floor(x * config.crossSectionPxPerKm)
}

function scaleY (y) {
  return SKY_PADDING + Math.floor(HEIGHT * (1 - (y - MIN_ELEVATION) / (MAX_ELEVATION - MIN_ELEVATION)))
}

const SEA_LEVEL = scaleY(0.5) // 0.5 is a sea level in model units

function crossSectionWidth (data) {
  let maxDist = 0
  data.forEach(chunkData => {
    const lastPoint = chunkData[chunkData.length - 1]
    if (lastPoint && lastPoint.dist > maxDist) {
      maxDist = lastPoint.dist
    }
  })
  return scaleX(maxDist)
}

function fillPath (ctx, color, p1, p2, p3, p4) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(scaleX(p1.x), scaleY(p1.y))
  ctx.lineTo(scaleX(p2.x), scaleY(p2.y))
  ctx.lineTo(scaleX(p3.x), scaleY(p3.y))
  ctx.lineTo(scaleX(p4.x), scaleY(p4.y))
  ctx.closePath()
  ctx.fill()
}

function debugInfo (ctx, p1, p2, info) {
  ctx.strokeStyle = 'black'
  ctx.beginPath()
  ctx.moveTo(scaleX(p1.x), scaleY(p1.y))
  ctx.lineTo(scaleX(p2.x), scaleY(p2.y))
  ctx.stroke()
  ctx.fillStyle = 'black'
  info.forEach((text, idx) => {
    ctx.fillText(text, scaleX(p1.x) + 5, scaleY(p1.y) + 10 + 10 * idx)
  })
}

function renderChunk (ctx, chunkData) {
  for (let i = 0; i < chunkData.length - 1; i += 1) {
    const x1 = chunkData[i].dist
    const x2 = chunkData[i + 1].dist
    const f1 = chunkData[i].field
    const f2 = chunkData[i + 1].field
    // Top of the crust
    const t1 = new THREE.Vector2(x1, f1.elevation)
    const t2 = new THREE.Vector2(x2, f2.elevation)
    // Bottom of the crust, top of the lithosphere
    const c1 = new THREE.Vector2(x1, f1.elevation - f1.crustThickness)
    const c2 = new THREE.Vector2(x2, f2.elevation - f2.crustThickness)
    // Bottom of the lithosphere, top of the mantle
    const l1 = new THREE.Vector2(x1, f1.elevation - f1.crustThickness - f1.lithosphereThickness)
    const l2 = new THREE.Vector2(x2, f2.elevation - f2.crustThickness - f2.lithosphereThickness)
    // Bottom of the cross section and mantle
    const b1 = new THREE.Vector2(x1, config.subductionMinElevation)
    const b2 = new THREE.Vector2(x2, config.subductionMinElevation)
    // Fill crust
    fillPath(ctx, f1.isOcean && f2.isOcean ? OCEANIC_CRUST_COL : CONTINENTAL_CRUST_COL, t1, t2, c2, c1)
    // Fill lithosphere
    fillPath(ctx, LITHOSPHERE_COL, c1, c2, l2, l1)
    // Fill mantle
    fillPath(ctx, MANTLE_COL, l1, l2, b2, b1)
    // Debug info, optional
    if (config.debugCrossSection) {
      debugInfo(ctx, l1, b1, [i, f1.id, x1.toFixed(1) + ' km'])
    }
  }
}

function renderSkyAndSea (ctx, width) {
  // Sky.
  const sky = ctx.createLinearGradient(0, 0, 0, SEA_LEVEL)
  sky.addColorStop(0, '#4375be')
  sky.addColorStop(1, '#c0daeb')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, width, SEA_LEVEL)
  // Ocean.
  ctx.fillStyle = '#1da2d8'
  ctx.fillRect(0, SEA_LEVEL, width, HEIGHT)
}

export default function renderCrossSection (canvas, data) {
  const ctx = canvas.getContext('2d')
  // Ensure that canvas has at least 1px width, so it can be used as a texture in 3D view.
  const width = Math.max(1, crossSectionWidth(data))
  canvas.width = width
  canvas.height = HEIGHT + SKY_PADDING
  ctx.clearRect(0, 0, width, HEIGHT + SKY_PADDING)
  renderSkyAndSea(ctx, width)
  data.forEach(chunkData => renderChunk(ctx, chunkData))
}