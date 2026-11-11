  V6 Engine — Interactive WebAR Experience

An interactive **Web-Based Augmented Reality (WebAR) experience** that brings a 3D V6 engine to life through image-target tracking.

Scan a predefined image target using a smartphone or computer camera to view and interact with a detailed 3D V6 engine directly in your web browser.

Built using **React, MindAR, A-Frame, and Three.js**, this project demonstrates how augmented reality can make complex mechanical systems more accessible and interactive without requiring a dedicated mobile application.

  Key Features

- **Image-Based AR Tracking:** Detects and tracks a predefined image target using MindAR.
- **Interactive 3D V6 Engine:** Displays a detailed 3D engine model anchored to the scanned image.
- **42 Animation Tracks:** Features synchronized mechanical animations involving pistons, camshafts, crankshaft, valves, and pulleys.
- **Open Engine:** Plays the engine animation in reverse to demonstrate its disassembled or exploded view.
- **Close Engine:** Plays the animation forward to restore the assembled engine.
- **Touch & Drag Rotation:** Allows users to rotate and explore the 3D engine.
- **Real-Time AR Experience:** Renders the engine in the camera view while tracking the image target.
- **Browser-Based:** No separate AR application installation is required.

  Technology Stack

| Technology | Purpose |
|---|---|
| React 19 | User interface and application components |
| MindAR | Image-target detection and tracking |
| A-Frame | Web-based AR scene integration |
| Three.js | 3D rendering and animation control |
| Vite | Development server and build tool |
| JavaScript | Application logic and interactions |

  Project Structure

```text
AR_project/
├── public/
│   ├── models/
│   │   └── v6(1).glb
│   └── targets_combined.mind
│
├── src/
│   ├── ar/
│   │   └── playClips.js
│   ├── config/
│   │   └── models.js
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
│
├── package.json
├── vite.config.js
└── README.md
```

 ⚙️ How It Works

1. **Image Target Preparation:** The reference image is processed into a MindAR `.mind` target file.
2. **Target Detection:** MindAR accesses the device camera and detects the predefined image.
3. **3D Model Display:** When the target is recognized, the V6 engine model is displayed in the AR scene.
4. **Animation Management:** Three.js AnimationMixer manages the model's animation clips.
5. **Engine Interaction:** Open Engine and Close Engine controls play the animation in reverse and forward directions.
6. **Model Rotation:** Touch and drag interactions allow users to rotate the 3D engine.

 💻 Getting Started

 Prerequisites

- Node.js
- npm
- A webcam or smartphone camera
- A modern web browser
- Camera access permission

 1. Clone the Repository

```bash
git clone https://github.com/ratanan10/AR_Project.git
```

 2. Navigate to the Project Folder

```bash
cd AR_Project
```

If the React application is inside the `AR_project` subfolder, run:

```bash
cd AR_project
```

 3. Install Dependencies

```bash
npm install
```

 4. Start the Development Server

```bash
npm run dev
```

Open the local URL displayed in the terminal and allow camera access.

**Note:** Camera access on deployed websites generally requires HTTPS. For local development, `localhost` is supported by modern browsers.

## 📦 Production Build

To generate the production build:

```bash
npm run build
```

The optimized output will be generated in the `dist/` directory.

Project Objective

The objective of this project is to demonstrate the potential of WebAR in visualizing complex mechanical systems.

By combining image recognition, 3D modelling, animation, and user interaction, the V6 Engine WebAR experience provides an engaging way to explore engine components in an augmented reality environment.

## 👨‍💻 Developer

Developed as an interactive WebAR project using modern web technologies.
