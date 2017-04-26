import React, { PureComponent } from 'react';
import Plates3DView from './plates-3d-view';
import Model from '../plates-model/model';
import { getURLParam, getImageData } from '../utils';

import '../../css/plates-model.less';

export default class PlatesModel extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const preset = getURLParam('preset') || 'data/test1.png';
    getImageData(preset, imgData => {
      this.setupModel({imgData});
    });
  }

  setupModel(preset) {
    this.model = new Model(preset);
    this.view3d.setModel(this.model);
  }

  render() {
    return (
      <div className="plates-model">
        <Plates3DView ref={(c) => { this.view3d = c; }} />
      </div>
    );
  }
}
