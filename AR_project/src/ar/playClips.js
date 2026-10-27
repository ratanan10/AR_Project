import "aframe";

AFRAME.registerComponent("play-clips", {
  schema: {
    exclude: { type: "int", default: 0 },
    timeScale: { type: "number", default: 1 },
  },

  init() {
    this.mixer = null;
    this.root = null;
    this.onModelLoaded = this.onModelLoaded.bind(this);
    this.el.addEventListener("model-loaded", this.onModelLoaded);
    if (this.el.getObject3D("mesh")) {
      this.onModelLoaded();
    }
  },

  onModelLoaded(evt) {
    const model =
      (evt && evt.detail && evt.detail.model) || this.el.getObject3D("mesh");
    if (!model) return;

    const clips = model.animations || [];
    if (!clips.length) return;

    if (this.mixer) {
      this.mixer.stopAllAction();
      this.mixer.uncacheRoot(this.root);
    }

    this.root = model;
    this.mixer = new AFRAME.THREE.AnimationMixer(model);
    this.mixer.timeScale = this.data.timeScale;

    clips.forEach((clip, index) => {
      if (index === this.data.exclude) return;
      this.mixer.clipAction(clip).play();
    });
  },

  tick(time, delta) {
    if (this.mixer) this.mixer.update(delta / 1000);
  },

  remove() {
    this.el.removeEventListener("model-loaded", this.onModelLoaded);
    if (this.mixer) {
      this.mixer.stopAllAction();
      this.mixer.uncacheRoot(this.root);
      this.mixer = null;
      this.root = null;
    }
  },
});
