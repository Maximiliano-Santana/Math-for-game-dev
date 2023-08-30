import './style.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import GUI from 'lil-gui';

//Three.js Setup
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(50, sizes.width/sizes.height, 0.1, 100);
camera.position.set(5, 5, 20);
camera.lookAt(new THREE.Vector3(0, 0, 0))

const canvas = document.querySelector('.experience')
const renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(sizes.width, sizes.height);

const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;
orbitControls.enabled = true;


window.addEventListener('resize', ()=>{
  //Update Sizes 
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //Update camera
  camera.aspect = sizes.width/sizes.height;
  camera.updateProjectionMatrix();

  //Update Renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//-----------------------------Producto Punto / Dot product
//El producto punto es una operacion muy utilizada a la hora de tratar con vectores.
//Hay varias formas de multiplicarlos y una de ellas es utilizando el producto punto.
//El producto punto consiste en sumar los productos cada eje de los vectores.
const a = new THREE.Vector3(2, 3,1);
const b = new THREE.Vector3(3, 1, 4);
const dotProductAB = ((a.x * b.x) + (a.y*b.y) + (a.z*b.z));

//Three.js cuenta con una funcion para realizar este calculo
const dotProduct = a.dot(b);
// console.log('Dot Product: ' + dotProduct);

//El producto punto devuelve un entero o numero escalar. Este numero representa la poryeccion  de un vector sobre otro en el espacio. Tiene muchas utilidades ya que si el producto es 0, entonces sifgnifica que ambos vectores son ortogonales.

//------------------------------- Normalizando vectores
//Normalizar vectores puede ser una herramienta util para obtener direccion y hacer matematicas con vectores
//Para normalizar un vector debemos seguir la siguiente logica

//Normalizando a
//Para normalizar un vector (que tenga longitud 1)
//Solo hay que dividir el vector sobre la distancia absoluta del vector
//Para obtener la distancia del vector podemos utilizar trigonometria a partir de Pitagoras
const aLength = Math.sqrt(a.x*a.x + a.y*a.y + a.z*b.z);

//Three.js cuenta con la misma funcion

// console.log('a lenth: ' + a.length())

//Ya que tenemos la longitud de a podemos dividirlo por su distancia para normalizarlo
const aNormaliced = new THREE.Vector3(
  a.x/Math.abs(aLength),
  a.y/Math.abs(aLength),
  a.z/Math.abs(aLength)
)
// console.log('a Normaliced: ')
// console.log(aNormaliced)

//Three.js cuenta con esta funcion
//a.normalize()

//------------------------------- Proyeccion escalar / Escalar projection
//Haciendo uso del producto punto podemos llegar a la proyeccion escalar, esta consiste en normalizar el vectore al que se va a aplicar el producto punto. Esto devolvera la distancia a la que se encuetnra la proyeccion del vector segundo vector. Por ejemplo. 

//Esto puede tener varios usos, entre ellos saber si un objeto esta en frente de otro o detras o perfectamente a un lado y la distancia hasta el objeto sobre el vector de direccion.

// console.log( 'Scalar projection: '+ aNormaliced.dot(b));

const aScalarProjection = aNormaliced.dot(b);
//------------------------------- Angulo entre dos vectores
//Ahora si ambos vectores estan normalizados podemos obtener la direccion. Si el producto punto devuelve 1 significa que estan perfectamente alineados, si se obtiene -1 significa que son opuestos, si se obtiene 0 es que son ortogonales
//A partir de esto podemos obtener el angulo entre los dos vectores, con ayuda del ArcoCoseno.


//-------------------------------Dot product Visualization

const origin = new THREE.Vector3(0, 0, 0);

const vectorA = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints([origin, a]),
  new THREE.LineBasicMaterial({ color: 0xff0000 })
);
const vectorANormaliced = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints([origin, aNormaliced]),
  new THREE.LineBasicMaterial({ color: 0x0000ff })
);

const vectorB = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints([origin, b]),
  new THREE.LineBasicMaterial({ color: 0x00ff00 })
);

const vectorBproyectedA = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints([origin, new THREE.Vector3(aNormaliced.x*aScalarProjection, aNormaliced.y*aScalarProjection, aNormaliced.z*aScalarProjection
    )]),
  new THREE.LineBasicMaterial({ color: 0xffff00 })
);

const vectorScalarProjectionAB = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(aNormaliced.x*aScalarProjection, aNormaliced.y*aScalarProjection, aNormaliced.z*aScalarProjection),
      b
  ]),
  new THREE.LineBasicMaterial({ color: 0xff00ff })
);


scene.add(vectorA);
scene.add(vectorANormaliced)
scene.add(vectorB);
scene.add(vectorScalarProjectionAB)
scene.add(vectorBproyectedA)

const gridY = new THREE.GridHelper();
const gridX = new THREE.GridHelper();
gridY.rotation.x = -Math.PI/2
scene.add(gridY, gridX)

const boxA = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.25), new THREE.MeshBasicMaterial());
const boxB = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.25), new THREE.MeshBasicMaterial());
boxA.position.copy(a);
boxB.position.copy(b);
scene.add(boxA, boxB)
boxA.lookAt(new THREE.Vector3(0, 0, 0));
boxB.lookAt(new THREE.Vector3(0, 0, 0));

const gui = new GUI();

const dotProductVisualization = gui.addFolder('dot product visualization').close();

let dotProductVisualizationVisible = {value: false};

vectorA.visible = dotProductVisualizationVisible.value
vectorB.visible = dotProductVisualizationVisible.value
vectorANormaliced.visible = dotProductVisualizationVisible.value
vectorScalarProjectionAB.visible = dotProductVisualizationVisible.value
vectorBproyectedA.visible = dotProductVisualizationVisible.value
boxA.visible = dotProductVisualizationVisible.value
boxB.visible = dotProductVisualizationVisible.value

dotProductVisualization.add(dotProductVisualizationVisible, 'value').name('View').onChange((value)=>{
  vectorA.visible = value
  vectorB.visible = value
  vectorANormaliced.visible = value
  vectorScalarProjectionAB.visible = value
  vectorBproyectedA.visible = value
  boxA.visible = value
  boxB.visible = value
});

dotProductVisualization.add(vectorA, 'visible').name('Vector A');
dotProductVisualization.add(vectorANormaliced, 'visible').name('Vector A normaliced');
dotProductVisualization.add(vectorB, 'visible').name('Vector B');
dotProductVisualization.add(vectorScalarProjectionAB, 'visible').name('Vector A Scalar Projection B');
dotProductVisualization.add(vectorBproyectedA, 'visible').name('Vector B proyected on Vector A');
//-------------------------------------------------------------------------------------


//--------------------------------------------- Case of use 1 --------------------------------------
//------------------------- Detect a if a object is inside a range
const range = {value: 3};
let rangeSphere = new THREE.Mesh(new THREE.SphereGeometry(range.value, 8, 8), new THREE.MeshBasicMaterial({wireframe: true}))
const objectOnRange = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), new THREE.MeshBasicMaterial({color: 'red'}))

scene.add(rangeSphere, objectOnRange);

//GUI

const CaseOne = gui.addFolder('Case of use 1').close();

const caseOneVisible = { value: false }

rangeSphere.visible = caseOneVisible.value
objectOnRange.visible = caseOneVisible.value

CaseOne.add(caseOneVisible, 'value').onChange((value)=>{
  rangeSphere.visible = value
  objectOnRange.visible = value
})

CaseOne.add(range, 'value', 0, 5).onChange(()=>{
  rangeSphere.geometry.dispose();
  rangeSphere.material.dispose();
  scene.remove(rangeSphere);
  rangeSphere = new THREE.Mesh(new THREE.SphereGeometry(range.value, 8, 8), new THREE.MeshBasicMaterial({wireframe: true}))
  scene.add(rangeSphere)
});
CaseOne.add(objectOnRange.position, 'x', -5, 5)
CaseOne.add(objectOnRange.position, 'y', -5, 5)
CaseOne.add(objectOnRange.position, 'z', -5, 5)

//----------------------------------------------- Case of use 2 ----------------------------------------
//--------------------------- Laser reflection with ray caster 
const mouse = new THREE.Vector2();

addEventListener('mousemove', (event)=>{
  mouse.x = event.clientX/sizes.width*2-1
  mouse.y = -(event.clientY/sizes.height*2)+1
})

const mirrorPlane = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.MeshBasicMaterial({color: 'gary'}))
const objectToTest = [];
scene.add(mirrorPlane)
mirrorPlane.position.z = -5
objectToTest.push(mirrorPlane);

const mirrorSphere = new THREE.Mesh(new THREE.SphereGeometry(1, 50, 35), new THREE.MeshNormalMaterial());
scene.add(mirrorSphere);
mirrorSphere.position.set(-2, -2, -1);
objectToTest.push(mirrorSphere);


const rayCaster = new THREE.Raycaster();
let laser = null;

const drawLaser = (laserOrigin, direction)=>{
  if(laser){
    scene.remove(laser)
    laser.geometry.dispose();
    laser.material.dispose();
  }
  laser = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([laserOrigin, direction]),
    new THREE.LineBasicMaterial({color:'red'})
  )
  scene.add(laser)
}

let laserBounce = null;

const drawLaserBounce = (laserOrigin, direction)=>{
  if(laserBounce){
    scene.remove(laserBounce)
    laserBounce.geometry.dispose();
    laserBounce.material.dispose();
  }
  laserBounce = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([laserOrigin, direction]),
    new THREE.LineBasicMaterial({color:'red'})
  )
  scene.add(laserBounce)
}


//Animate
const clock = new THREE.Clock();

const tick = ()=>{

  //Test object in range
  if(objectOnRange.position.distanceTo(rangeSphere.position)-0.5 < range.value){
    rangeSphere.material.color = new THREE.Color('red')
  }else{
    rangeSphere.material.color = new THREE.Color('white')
  }

  //Raycaster
  rayCaster.setFromCamera(mouse, camera);
  const mouseIntesrsects = rayCaster.intersectObjects(objectToTest);

  
  if(mouseIntesrsects.length > 0){
    console.log(mouseIntesrsects)
    
    //Take the first intersect on the ray caster and draw the laser
    //Se toma la primera interseccion en el ray caster y dibuja un laser
    const laserEndPoint = mouseIntesrsects[0]
    drawLaser(origin, laserEndPoint.point);
    
    //Create a direction laser and normal vector to modify 
    //Copio los vectores de direccion y normal para mofigucarlos
    const laserDirection = new THREE.Vector3().copy(laserEndPoint.point);
    const normalDirection = new THREE.Vector3().copy(laserEndPoint.normal);
    laserDirection.normalize();
    normalDirection.normalize();

    //Distance of the direction vector projected on the normal vector
    //Obtengo las longitud del vector de direccion proyectado en el vector de la normal
    const laserDirectionDot = new THREE.Vector3().copy(laserEndPoint.point).normalize();
    const projectedDistance = Math.abs(laserDirectionDot.dot(normalDirection));

    //Create a vector with 2 times projectedDistance and the direction of the normal vector
    //Creo un vector que adquiere dos veces la longitd del vector proyectado y la direccion del vector de la normal y 
    let reflectionVector = new THREE.Vector3().copy(normalDirection);
    reflectionVector = reflectionVector.multiplyScalar(projectedDistance*2);

    
    //Adding the reflection vector to the laser direction to get the new vector with the direction of the reflection
    //Ahora agrego el vector de refleccion al vector normalizado de la direccion para obtener la el vector de la direccion de rebote
    let bounceLaserDirection = new THREE.Vector3();
    bounceLaserDirection.addVectors(laserDirection, reflectionVector);
    
    //Sumo el vector donde colisiona el laser y el vector de la direccion del rebote y los muestro en pantalla
    const laserReflection = new THREE.Vector3().addVectors(laserEndPoint.point, bounceLaserDirection.multiplyScalar(5));
    
    drawLaserBounce(laserEndPoint.point, laserReflection);
    

    // bounceLaserDirection = bounceLaserDirection.addVectors(laserEndPoint.point, reflectionVector).normalize();
    


    // bounceLaserDirection.addVectors(laserEndPoint.point, laserEndPoint.normal)
    // drawLaserBounce(laserEndPoint.point, bounceLaserDirection);
  }
  

  //Controls
  orbitControls.update();
  //Render
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}
tick();