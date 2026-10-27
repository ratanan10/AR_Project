
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
  }
];

export default models;
