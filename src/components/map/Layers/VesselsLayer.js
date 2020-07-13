import { CompositeLayer, IconLayer, PathLayer } from "deck.gl";

class VesselsLayer extends CompositeLayer {
  renderLayers() {
    return [
      // Vessel icons
      new IconLayer({
        data: this.props.data,
        // TODO
      }),
      // Historical path
      new PathLayer({
        data: this.props.data,
        // TODO
      }),
      // Future path
      new PathLayer({
        data: this.props.data,
        // TODO
      }),
    ];
  }
}
VesselsLayer.layerName = "VesselsLayer";
