import * as THREE from 'three';
import 'imports-loader?THREE=three!three/examples/js/controls/OrbitControls';
import PlateMesh from './plate-mesh';

export default class View3D {
  constructor({ canvas, width, height }) {
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true
    });
    this.renderer.setSize(width, height);

    this.render = this.render.bind(this);
  }

  // Initial setup of the scene based on model.
  setModel(model) {
    this.model = model;
    this.basicSceneSetup();
    this.model.plates.forEach(plate => this.addPlate(plate));
    this.render();
  }

  basicSceneSetup() {
    const size = this.renderer.getSize();

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(33, size.width / size.height, 0.1, 100);
    this.camera.position.set(0, 0, 4.5);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.scene.add(this.camera);

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enablePan = false;
    this.controls.rotateSpeed = 0.5;
    this.controls.zoomSpeed = 0.5;

    this.scene.add(new THREE.AmbientLight(0x4f5359));
    this.scene.add(new THREE.HemisphereLight(0xC6C2B6, 0x3A403B, .75));
  }

  addPlate(plate) {
    const plateMesh = new PlateMesh(plate);
    this.scene.add(plateMesh.root);
  }

  render() {
    window.requestAnimationFrame(this.render);
    this.renderer.render(this.scene, this.camera);
  }
}
