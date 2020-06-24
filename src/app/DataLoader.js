import assert from "assert";
import fetch from "unfetch";

const MAX_FRAMES = 120;
const METADATA_PATH =
  "https://raw.githubusercontent.com/jakkarintiew/frames-data/master/frames_20s/frames_metadata.json";
const FRAMES_DIR =
  "https://raw.githubusercontent.com/jakkarintiew/frames-data/master/frames_20s/";

export default class DataLoader {
  constructor() {
    this.isOpen = false;
    this.isLoading = true;
    this.numberOfFrames = 0;
    this.metadata = {};
    this.frames = {};
  }

  connect(callback) {
    this.isOpen = true;
    this.isLoading = true;
    this.loadMetadata().then((data) => {
      this.metadata = data;
      this.numberOfFrames = data.frames.length;
      console.log("Start loading...");
      this.startLoad();
      // console.log(this.frames);
      callback(this.frames);
    });
  }

  loadMetadata() {
    assert(METADATA_PATH);
    return fetch(METADATA_PATH).then((resp) => resp.json());
  }

  loadFrame(index) {
    const filePath = FRAMES_DIR + `${index}_frame.json`;
    assert(filePath);
    return fetch(filePath).then((resp) => resp.json());
  }

  startLoad() {
    for (let i = 0; i < MAX_FRAMES; i++) {
      this.loadFrame(i).then((data) => {
        this.frames[i] = data;
      });
    }
  }
}
