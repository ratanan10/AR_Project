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

AFRAME.registerComponent("gesture-rotation", {
  schema: {
    factor: { type: "number", default: 0.5 },
  },

  init() {
    this.startX = 0;
    this.isDragging = false;

    this.onStart = (e) => {
      // Don't drag if clicking UI buttons or overlay elements
      if (e.target && (e.target.closest(".engine-controls") || e.target.closest("button"))) {
        return;
      }
      this.isDragging = true;
      this.startX = e.touches ? e.touches[0].clientX : e.clientX;
    };

    this.onMove = (e) => {
      if (!this.isDragging) return;
      // Only rotate when the parent target entity is visible
      if (this.el.parentEl && !this.el.parentEl.object3D.visible) return;

      const currentX = e.touches ? e.touches[0].clientX : e.clientX;
      const deltaX = currentX - this.startX;
      this.startX = currentX;

      const currentRotation = this.el.getAttribute("rotation") || { x: 0, y: 0, z: 0 };
      this.el.setAttribute("rotation", {
        x: currentRotation.x,
        y: currentRotation.y + deltaX * (this.data.factor || 0.5),
        z: currentRotation.z,
      });
    };

    this.onEnd = () => {
      this.isDragging = false;
    };

    window.addEventListener("mousedown", this.onStart);
    window.addEventListener("mousemove", this.onMove);
    window.addEventListener("mouseup", this.onEnd);
    window.addEventListener("touchstart", this.onStart, { passive: true });
    window.addEventListener("touchmove", this.onMove, { passive: true });
    window.addEventListener("touchend", this.onEnd, { passive: true });
  },

  remove() {
    window.removeEventListener("mousedown", this.onStart);
    window.removeEventListener("mousemove", this.onMove);
    window.removeEventListener("mouseup", this.onEnd);
    window.removeEventListener("touchstart", this.onStart);
    window.removeEventListener("touchmove", this.onMove);
    window.removeEventListener("touchend", this.onEnd);
  },
});
