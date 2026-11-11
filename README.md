AR_project — WebAR Interactive Experience
An interactive Web-Based Augmented Reality (WebAR) calendar application built with React 19, A-Frame, MindAR, and Three.js.

Scan printed target images directly using a smartphone browser to trigger animated 3D models anchored in real-time. No app downloads, Unity plugins, or native ARKit/ARCore dependencies required — pure browser-based computer vision and WebGL rendering.

Key Features
Multi-Target Real-Time Tracking: Powered by MindAR and TensorFlow.js, tracking image targets across calendar pages with low jitter and fast pose estimation.
Interactive 3D Experiences:
 Drone: Floating aerial drone with continuous spinning propeller animation.
 Anatomical Heart: Realistic pulsing heartbeat loop.
 V6 Mechanical Engine:
 42 synchronized mechanical animation tracks (pistons, camshafts, crankshaft, valves, pulleys).
Interactive Open/Close Controls: Dynamic UI buttons trigger full exploded disassembly and seamless reverse reassembly in real time.
 Gantry Crane: Transports cargo along port rails with hoisting and container drop sequences.
 Cargo Ship: Scaled, detailed maritime vessel anchored directly to the calendar surface.
 Door & Window Switch: Shared image target with instantaneous toggle between 3D door and window models (sub-16ms switch in GPU memory).
Touch & Drag 360° Rotation: Custom A-Frame component allowing users to drag horizontally with finger/mouse to inspect any model from all angles.
Adaptive HUD Overlay: Status notifications and contextual floating control buttons that mount only when relevant targets are detected.
 Tech Stack
Technology	Role
React 19	Modern UI framework, component lifecycle, and reactive AR HUD state
MindAR (v1.2.5)	Computer vision, feature point detection, image tracking
A-Frame (v1.8.0)	Declarative WebVR/WebXR entity-component framework
Three.js	3D rendering pipeline, scene graph management, and AnimationMixer
Vite 8	Next-generation frontend build tool and dev server
MessagePack (@msgpack/msgpack)	Binary serialization for compiling and bundling multi-target .mind files
 Project Architecture
text


AR_project/
├── public/
│   ├── models/                   # 3D assets (.glb)
│   │   ├── Drone GLB.glb
│   │   ├── heart1.glb
│   │   ├── v6(1).glb
│   │   ├── crane.glb
│   │   ├── ship.glb
│   │   ├── door.glb
│   │   └── window.glb
│   ├── targets_combined.mind     # Bundled MindAR binary tracking targets
│   └── targets_*.mind            # Individual target binaries
├── src/
│   ├── ar/
│   │   └── playClips.js          # Custom A-Frame components (play-clips, gesture-rotation)
│   ├── config/
│   │   └── models.js             # Model definitions, offsets, scales, and animation configs
│   ├── App.jsx                   # Main AR scene, target listeners, and interactive UI
│   ├── App.css                   # Glassmorphic UI HUD styling and mobile responsiveness
│   └── main.jsx                  # React entry point
├── package.json
└── vite.config.js
 Getting Started
Prerequisites
Node.js
 (v18.x or later recommended)
A smartphone or webcam with camera permissions enabled
HTTPS connection (required by mobile browsers to access the camera)
Installation
Clone the repository:

bash


git clone https://github.com/<your-username>/<your-repo-name>.git
cd AR_cal_2027/AR_project
Install dependencies:

bash


npm install
Start local development server:

bash


npm run dev
 Tip: To test on a mobile device on your local Wi-Fi, run:

bash


npx vite --host
Open the provided local IP URL in your smartphone browser (or use an HTTPS tunnel like ngrok / localtunnel).

Build for production:

bash


npm run build
 How It Works
Target Compilation: Calendar images are converted into feature descriptor files (.mind). Individual target files are merged into targets_combined.mind using MessagePack binary encoding.
Detection & Pose Matrix: MindAR analyzes camera frames at 30–60 FPS. Once a keypoint cluster matches a target, it calculates the 
4
×
4
4×4 transform matrix (position, tilt, rotation) and updates the corresponding <a-entity>.
Animation Dispatching:
playClips.js interfaces directly with Three.js AnimationMixer.
Forward playback (timeScale: 1) smoothly expands models into exploded views.
Reverse playback (timeScale: -1) with clampWhenFinished cleanly resets models back to their original assembled state.
Touch Interaction: gesture-rotation listens to pointer/touch deltas on the viewport and applies angular offsets to the tracked model while ignoring button click events.
 License
This project is open-source and available under the 
MIT License
.

You can save this directly as README.md in the root of your project directory or repository.
