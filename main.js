import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

//canvas
const canvas = document.querySelector("canvas");

//シーン
const scene = new THREE.Scene();

//サイズ
const sizes = {
  width: innerWidth,
  height: innerHeight,
};

//カメラ
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  3000
);
camera.position.set(0,500,1000);

//レンダラー
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias:true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

//envimage
const urls = [
  "./envImage/right.png",
  "./envImage/left.png",
  "./envImage/up.png",
  "./envImage/down.png",
  "./envImage/front.png",
  "./envImage/back.png",
];

const loader = new THREE.CubeTextureLoader();
scene.background = loader.load(urls);

//controls
const controls = new OrbitControls(camera,canvas);
controls.enableDamping= true;

//cameraの設置
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(100);

//cubecamera
const cubeCamera = new THREE.CubeCamera(1,1000,cubeRenderTarget);
scene.add(cubeCamera);

//material
const material = new THREE.MeshBasicMaterial({
  envMap:cubeRenderTarget.texture,
});
const geometry = new THREE.SphereGeometry(350,50,50);
const sphere = new THREE.Mesh(geometry,material);
sphere.position.set(0,100,0);
scene.add(sphere);



//アニメーション
function animate(){
  controls.update();
  cubeCamera.update(renderer,scene);
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
};

animate();

//ブラウザのリサイズ操作
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
});
