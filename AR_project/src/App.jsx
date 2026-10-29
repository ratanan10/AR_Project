import { useState, useEffect } from 'react'
import './App.css'
import "aframe";
import "mind-ar/dist/mindar-image-aframe.prod.js";
import "./ar/playClips.js";
import models from './config/models.js';

function App() {
  const [status, setStatus] = useState("Allow Camera access and scan a image target to start AR experience");
  const [isEngineActive, setIsEngineActive] = useState(false);

  useEffect(() => {
    const listeners = [];

    models.forEach((model) => {
      const target = document.getElementById(`target-${model.id}`);

      if (!target) return;

      const onFound = () => {
        setStatus(`Found ${model.name} detected`);
        if (model.id === "engine") {
          setIsEngineActive(true);
        }
      };

      const onLost = () => {
        setStatus(`Lost ${model.name} detected`);
        if (model.id === "engine") {
          setIsEngineActive(false);
        }
      };

      target.addEventListener("targetFound", onFound);
      target.addEventListener("targetLost", onLost);

      listeners.push(() => {
        target.removeEventListener("targetFound", onFound);
        target.removeEventListener("targetLost", onLost);
      });
    });

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

      <a-scene
        mindar-image="imageTargetSrc: /targets_combined.mind;
          maxTrack: 3;
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

        {models.map((model) => (
          <a-entity
            key={model.id}
            id={`target-${model.id}`}
            mindar-image-target={`targetIndex: ${model.targetIndex}`}
          >
            <a-gltf-model
              id={`model-${model.id}`}
              src={`#asset-${model.id}`}
              position={model.position}
              rotation={model.rotation}
              scale={model.scale}
              gesture-rotation
              play-clips={`exclude: ${model.excludeClip ?? 0}; timeScale: ${model.timeScale ?? 1}; loop: ${model.loop ?? true}; autoplay: ${model.autoplay ?? true};`}
            />
          </a-entity>
        ))}
      </a-scene>
    </main>
  );
}

export default App;
