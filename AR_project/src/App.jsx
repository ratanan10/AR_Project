import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import "aframe";
import "mind-ar/dist/mindar-image-aframe.prod.js";
import "./ar/playClips.js";
import { useEffect } from 'react';
import  models  from './config/models.js';


function App() {
  const [status, setStatus] = useState("Allow Camera access and scan a image target to start AR experience");

  useEffect(() => {

    const listeners = [];

    models.forEach((model)=>{
      const target = document.getElementById(`target-${model.id}`);


      if (!target) return;

      const onFound = () => {
        setStatus(`Found ${model.name} detected`);
      }


      const onLost = () => {
        setStatus(`Lost ${model.name} detected`);
      }

      target.addEventListener("targetFound", onFound);
      target.addEventListener("targetLost", onLost);

      listeners.push(()=>{
        target.removeEventListener("targetFound", onFound);
        target.removeEventListener("targetLost", onLost);
      });

    });


    return () => {
      listeners.forEach((removeListener) => removeListener());  

    };
  }, []);


  return (
    <main className="ar-app">
      <div className="ar-status">{status}</div>
       <a-scene
        mindar-image="imageTargetSrc: /targets.mind; autoStart: true;
      
    uiLoading: no;
    uiScanning:yes;
    uiError: no;"
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
              src={`#asset-${model.id}`}
              position={model.position}
              rotation={model.rotation}
              scale={model.scale}
            />
          </a-entity>
        ))}

      </a-scene>

    </main>
  );
}

export default App
