import * as THREE from "three";
import { random } from "../seedrandom";
import Field from "./field";
import Plate from "./plate";

function randomVec3() {
  return new THREE.Vector3(random(), random(), random());
}

function removeDraggingFields(plates: Plate[]) {
  const platesCount = plates.length;
  for (let i = platesCount - 1; i >= 0; i -= 1) {
    const bottomPlate = plates[i];
    bottomPlate.forEachField((bottomField: Field) => {
      if (!bottomField.draggingPlate) {
        return;
      }
      for (let j = i - 1; j >= 0; j -= 1) {
        const topPlate = plates[j];
        const topField = topPlate.fieldAtAbsolutePos(bottomField.absolutePos);
        if (topField) {
          bottomPlate.deleteField(bottomField.id);
          return;
        }
      }
    });
  }
}

function deleteSubductingFields(plates: Plate[]) {
  plates.forEach((plate: Plate) => {
    plate.forEachField((field: Field) => {
      if (field.subduction) {
        plate.deleteField(field.id);
      }
    });
  });
}

export default function addRelativeMotion(plates: Plate[]) {
  // Remove fields that cause drag force and add some random hot spots.
  removeDraggingFields(plates);
  deleteSubductingFields(plates);
  for (const plate of plates) {
    plate.angularVelocity.setLength(plate.angularSpeed * 0.5);
    const fields: Field[] = Array.from(plate.fields.values());
    const randomField: Field = fields[Math.floor(fields.length * random())];
    const pos = randomField.absolutePos.clone().normalize();
    // .cross() ensures that force vector is perpendicular to the earth surface.
    const force = pos.clone().cross(randomVec3()).setLength(2);
    plate.setHotSpot(pos, force);
  }
}
