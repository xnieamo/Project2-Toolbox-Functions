
// Skybox texture from: https://github.com/mrdoob/three.js/tree/master/examples/textures/cube/skybox

const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'

var settings = {
	density : 40.0,
	bias : 0.5,
	nFeathers : 40,
	speed : 100,
	scale : 1,
	size : 1,
	color : [255, 255, 255]
};

var time = 0;

function bias (b, t) {
	return Math.pow(t, Math.log(b) / Math.log(0.5));
};

// Basic Lambert white
var lambertWhite = new THREE.MeshLambertMaterial({ 
	color: new THREE.Vector3(settings.color[0]/255, settings.color[1]/255, settings.color[2]/255),
 	side: THREE.DoubleSide 
});

// called after the scene loads
function onLoad(framework) {
    var scene = framework.scene;
    var camera = framework.camera;
    var renderer = framework.renderer;
    var gui = framework.gui;
    var stats = framework.stats;



    // Set light
    var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    directionalLight.color.setHSL(0.1, 1, 0.95);
    directionalLight.position.set(1, 3, 2);
    directionalLight.position.multiplyScalar(10);

    // set skybox
    var loader = new THREE.CubeTextureLoader();
    var urlPrefix = '/images/skymap/';

    var skymap = new THREE.CubeTextureLoader().load([
        urlPrefix + 'px.jpg', urlPrefix + 'nx.jpg',
        urlPrefix + 'py.jpg', urlPrefix + 'ny.jpg',
        urlPrefix + 'pz.jpg', urlPrefix + 'nz.jpg'
    ] );

    scene.background = skymap;

    // load a simple obj mesh
    var objLoader = new THREE.OBJLoader();
    objLoader.load('/geo/feather.obj', function(obj) {

        // LOOK: This function runs after the obj has finished loading
        var featherGeo = obj.children[0].geometry;

        for (var i = 0; i < settings.nFeathers; i++) {
        	var z = 1 / settings.density * i;
        	var x = bias(settings.bias, z);
        	var featherMesh = new THREE.Mesh(featherGeo, lambertWhite);
        	featherMesh.position.z = z;
        	featherMesh.position.x = x;

        	featherMesh.rotation.y = Math.asin(1 - z);


        	featherMesh.name = "feather" + i;
        	scene.add(featherMesh);
        }

    });

    // set camera position
    camera.position.set(0, 1, 5);
    camera.lookAt(new THREE.Vector3(0,0,0));

    // scene.add(lambertCube);
    scene.add(directionalLight);

    // edit params and listen to changes like this
    // more information here: https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
    gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
        camera.updateProjectionMatrix();
    });

    gui.add(settings, 'density', 0.1, 40);

    gui.add(settings, 'bias', 0, 1);

    gui.add(settings, 'speed', 1, 1000);

    gui.add(settings, 'scale', 0.1, 50);

    gui.add(settings, 'size', 0.1, 5);

    // Color menu
	gui.addColor(settings, 'color').onChange(function(newVal){
		lambertWhite.color = new THREE.Vector3(newVal[0]/255, newVal[1]/255, newVal[2]/255);
	});
}

// called on frame updates
function onUpdate(framework) {

    for (var i = 0; i < settings.nFeathers; i++) {
    	var feather = framework.scene.getObjectByName("feather" + i);    
	    if (feather !== undefined) {
	    	
	    	// Simply flap wing
	        var z = 1 / settings.density * i;
        	var x = bias(settings.bias, z);
        	feather.position.z = z;
        	feather.position.x = x;

        	feather.scale.x = z * settings.size;

        	var maxZ = settings.nFeathers / settings.density;
        	
        	var date = new Date();
	    	feather.rotation.z = (Math.sin(date.getTime() / settings.speed) * settings.scale * Math.PI / 180);  
	        	
		    if (i < settings.density) {
				feather.rotation.y = Math.asin(1 - z);
		        feather.visible = true; 
	    	} else {
	    		feather.visible = false;
	    	}
   
	    } 
    }
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);