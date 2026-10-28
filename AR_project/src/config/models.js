const models = [
  {
    id: "drone",
    name: "Drone",
    modelUrl: "/models/Drone GLB.glb",
    targetIndex: 0,
    excludeClip: 0,
    timeScale: 1,
    scale: "1 1 1",
    position: "0 0 0.1",
    rotation: "0 0 0",
    loop: true,
    autoplay: true,
  },
  {
    id: "heart",
    name: "Heart",
    modelUrl: "/models/heart1.glb",
    targetIndex: 1,
    excludeClip: -1, // -1 so the heartbeat animation plays
    timeScale: 1,
    scale: "9 9 9",
    position: "0 0 0.1",
    rotation: "0 0 0",
    loop: true,
    autoplay: true,
  },
  {
    id: "engine",
    name: "V6 Engine",
    modelUrl: "/models/v6(1).glb",
    targetIndex: 2,
    excludeClip: -1,
    timeScale: 1,
    scale: "0.025 0.025 0.025",
    position: "0 0 0.1",
    rotation: "0 90 0",
    loop: false,
    autoplay: false,
  }
];

export default models;
