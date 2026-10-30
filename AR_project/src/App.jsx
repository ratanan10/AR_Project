import { useState, useEffect } from 'react'
import './App.css'
import "aframe";
import "mind-ar/dist/mindar-image-aframe.prod.js";
import "./ar/playClips.js";
import models from './config/models.js';

const doorWindowModels = models.filter(
  (model) => model.id === "door" || model.id === "window",
);
const doorWindowTargetIndex = doorWindowModels.find(
  (model) => model.id === "door",
).targetIndex;

function App() {
  const [status, setStatus] = useState("Allow Camera access and scan a image target to start AR experience");
  const [isEngineActive, setIsEngineActive] = useState(false);
  const [isDoorTargetActive, setIsDoorTargetActive] = useState(false);
  const [doorViewMode, setDoorViewMode] = useState("door"); // "door" | "window"

  useEffect(() => {
    const listeners = [];

    models.forEach((model) => {
      if (model.id === "door" || model.id === "window") return;

      const target = document.getElementById(`target-${model.id}`);

      if (!target) return;

      const onFound = () => {
        if (model.id === "engine") {
          setIsEngineActive(true);
        }
        setStatus(`Found ${model.name} detected`);
      };

      const onLost = () => {
        if (model.id === "engine") {
          setIsEngineActive(false);
        }
        setStatus(`Lost ${model.name} detected`);
      };

      target.addEventListener("targetFound", onFound);
      target.addEventListener("targetLost", onLost);

      listeners.push(() => {
        target.removeEventListener("targetFound", onFound);
        target.removeEventListener("targetLost", onLost);
      });
    });

    const doorWindowTarget = document.getElementById("target-door-window");
    if (doorWindowTarget) {
      const onFound = () => {
        setDoorViewMode("door");
        setIsDoorTargetActive(true);
        setStatus("Found Door / Window card detected");
      };

      const onLost = () => {
        setIsDoorTargetActive(false);
        setStatus("Door / Window card lost");
      };

      doorWindowTarget.addEventListener("targetFound", onFound);
      doorWindowTarget.addEventListener("targetLost", onLost);

      listeners.push(() => {
        doorWindowTarget.removeEventListener("targetFound", onFound);
        doorWindowTarget.removeEventListener("targetLost", onLost);
      });
    }

    return () => {
      listeners.forEach((removeListener) => removeListener());
    };
  }, []);

  const handleOpenEngine = () => {
    const engineEl = document.getElementById("model-engine");
    if (engineEl) {
      engineEl.emit("open-animation");
    }
  };

  const handleCloseEngine = () => {
    const engineEl = document.getElementById("model-engine");
    if (engineEl) {
      engineEl.emit("close-animation");
    }
  };

  return (
    <main className="ar-app">
      <div className="ar-status">{status}</div>

      {isEngineActive && (
        <div className="engine-controls">
          <button className="btn-engine btn-open" onClick={handleOpenEngine}>
            <span className="btn-icon"></span> Open Engine
          </button>
          <button className="btn-engine btn-close" onClick={handleCloseEngine}>
            <span className="btn-icon"></span> Close Engine
          </button>
        </div>
      )}

      {isDoorTargetActive && (
        <div
          className={`door-toggle-container${isEngineActive ? " with-engine" : ""}`}
        >
          <button
            type="button"
            className="btn-door-toggle"
            onClick={() =>
              setDoorViewMode((prev) => (prev === "door" ? "window" : "door"))
            }
          >
           
            {doorViewMode === "door" ? "Switch to Window" : "Switch to Door"}
          </button>
        </div>
      )}

      <a-scene
        mindar-image="imageTargetSrc: /targets_combined.mind;
          maxTrack: 7;
          autoStart: true;
          uiLoading: no;
          uiScanning: yes;
          uiError: no;
          filterMinCF: 0.0001;
          filterBeta: 0.001;
          warmupTolerance: 5;
          missTolerance: 5;"
        color-space="sRGB"
        renderer="colorManagement: true"
        vr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: false"
        embedded
      >
        <a-assets>
          {models.map((model) => (
            <a-asset-item
              key={model.id}
              id={`asset-${model.id}`}
              src={model.modelUrl}
            />
          ))}
        </a-assets>

        <a-camera
          position="0 0 0"
          look-controls="enabled: false"
        />

        {models
          .filter((model) => model.id !== "door" && model.id !== "window")
          .map((model) => (
            <a-entity
              key={model.id}
              id={`target-${model.id}`}
              mindar-image-target={`targetIndex: ${model.targetIndex}`}
            >
              <a-gltf-model
                id={`model-${model.id}`}
                src={`#asset-${model.id}`}
                visible="true"
                position={model.position}
                rotation={model.rotation}
                scale={model.scale}
                gesture-rotation
                play-clips={`exclude: ${model.excludeClip ?? 0}; timeScale: ${model.timeScale ?? 1}; loop: ${model.loop ?? true}; autoplay: ${model.autoplay ?? true};`}
              />
            </a-entity>
          ))}

        <a-entity
          id="target-door-window"
          mindar-image-target={`targetIndex: ${doorWindowTargetIndex}`}
        >
          {doorWindowModels.map((model) => (
            <a-gltf-model
              key={model.id}
              id={`model-${model.id}`}
              src={`#asset-${model.id}`}
              visible= 
              {
                (model.id === "door" && doorViewMode === "door") ||
                (model.id === "window" && doorViewMode === "window")
                  ? "true"
                  : "false"
              }
              position={model.position}
              rotation={model.rotation}
              scale={model.scale}
              gesture-rotation
              play-clips={`exclude: ${model.excludeClip ?? 0}; timeScale: ${model.timeScale ?? 1}; loop: ${model.loop ?? true}; autoplay: ${model.autoplay ?? true};`}
            />
          ))}
        </a-entity>
      </a-scene>
    </main>
  );
}

export default App;
