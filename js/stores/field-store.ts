import * as THREE from "three";
import FieldBase from "../plates-model/field-base";
import { IFieldsOutput } from "../plates-model/model-output";

export default class FieldStore extends FieldBase {
  // Never ever use @observable decorator here. There are too many fields being used and simple setting of a property
  // value will take too much time (it's been tested).
  elevation: number | null = null;
  normalizedAge: number | null = null;
  boundary = false;
  earthquakeMagnitude = 0;
  earthquakeDepth = 0;
  volcanicEruption = false;
  force = new THREE.Vector3();
  originalHue: number | null = null;

  handleDataFromWorker(idx: number, fieldData: IFieldsOutput) {
    this.elevation = fieldData.elevation[idx];
    this.normalizedAge = fieldData.normalizedAge[idx];
    if (fieldData.boundary) {
      this.boundary = !!fieldData.boundary[idx];
    }
    if (fieldData.earthquakeMagnitude) {
      this.earthquakeMagnitude = fieldData.earthquakeMagnitude[idx];
      this.earthquakeDepth = fieldData.earthquakeDepth?.[idx] || 0;
    }
    if (fieldData.volcanicEruption) {
      this.volcanicEruption = !!fieldData.volcanicEruption[idx];
    }
    if (fieldData.forceX && fieldData.forceY && fieldData.forceZ) {
      this.force.set(fieldData.forceX[idx], fieldData.forceY[idx], fieldData.forceZ[idx]);
    }
    if (fieldData.originalHue) {
      this.originalHue = fieldData.originalHue[idx] !== -1 ? fieldData.originalHue[idx] : null;
    }
  }
}
