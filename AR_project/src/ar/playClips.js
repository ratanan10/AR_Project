import "aframe";

AFRAME.registerComponent("play-clips", {
  schema: {
    exclude: { type: "int", default: 0 },
    timeScale: { type: "number", default: 1 },
    loop: { type: "boolean", default: true },
    autoplay: { type: "boolean", default: true },
  },

  init() {
    this.mixer = null;
    this.root = null;
    this.actions = [];
    this.onModelLoaded = this.onModelLoaded.bind(this);
    this.openAnimation = this.openAnimation.bind(this);
    this.closeAnimation = this.closeAnimation.bind(this);

    this.el.addEventListener("model-loaded", this.onModelLoaded);
    this.el.addEventListener("open-animation", this.openAnimation);
    this.el.addEventListener("close-animation", this.closeAnimation);

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
      this.actions = [];
    }

    this.root = model;
    this.mixer = new AFRAME.THREE.AnimationMixer(model);
    this.mixer.timeScale = this.data.timeScale;
    this.actions = [];

    clips.forEach((clip, index) => {
      if (index === this.data.exclude || clip.name === "drone1Action") return;
      const action = this.mixer.clipAction(clip);

      if (this.data.loop) {
        action.setLoop(AFRAME.THREE.LoopRepeat);
      } else {
        action.setLoop(AFRAME.THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
      }

      this.actions.push(action);

      if (this.data.autoplay) {
        action.play();
      } else {
        // Paused at the initial (assembled) pose
        action.play();
        action.paused = true;
      }
    });

    if (!this.data.autoplay) {
      this.mixer.update(0);
    }
  },

  openAnimation() {
    if (!this.mixer || !this.actions.length) return;
    this.actions.forEach((action) => {
      const clip = action.getClip();
      if (action.time >= clip.duration) return;
      action.paused = false;
      action.timeScale = Math.abs(this.data.timeScale || 1);
      action.play();
    });
  },

  closeAnimation() {
    if (!this.mixer || !this.actions.length) return;
    this.actions.forEach((action) => {
      if (action.time <= 0) return;
      action.paused = false;
      action.timeScale = -Math.abs(this.data.timeScale || 1);
      action.play();
    });
  },

  update(oldData) {
    if (this.mixer && oldData && this.data.timeScale !== oldData.timeScale) {
      this.mixer.timeScale = this.data.timeScale;
    }
  },

  tick(time, delta) {
    if (this.mixer) this.mixer.update(delta / 1000);
  },

  remove() {
    this.el.removeEventListener("model-loaded", this.onModelLoaded);
    this.el.removeEventListener("open-animation", this.openAnimation);
    this.el.removeEventListener("close-animation", this.closeAnimation);
    if (this.mixer) {
      this.mixer.stopAllAction();
      this.mixer.uncacheRoot(this.root);
      this.mixer = null;
      this.root = null;
      this.actions = [];
    }
  },
});
