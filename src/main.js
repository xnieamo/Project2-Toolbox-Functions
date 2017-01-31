
// Skybox texture from: https://github.com/mrdoob/three.js/tree/master/examples/textures/cube/skybox

const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'

var settings = {
	density : 40.0,
	bias : 0.5,
	nFeathers : 50,
	speed : 100,
    speedF : 100,
	scale : 1,
	size : 1,
    wind : 0,
    shoulderCurve : 0.5,
	outerColor : [255, 255, 255],
    innerColor : [255, 128, 128]
};

var time = 0;

function bias (b, t) {
	return Math.pow(t, Math.log(b) / Math.log(0.5));
};

// Basic Lambert white
var lambertWhite = new THREE.MeshLambertMaterial({ 
	color: new THREE.Vector3(settings.outerColor[0]/255, settings.outerColor[1]/255, settings.outerColor[2]/255),
 	side: THREE.DoubleSide 
});

// Basic Lambert white
var lambertGrey = new THREE.MeshLambertMaterial({ 
    color: new THREE.Vector3(settings.innerColor[0]/255, settings.innerColor[1]/255, settings.innerColor[2]/255),
    side: THREE.DoubleSide 
});

// Config for parts of the wing
var wingConfig = {
    name : function(n, p) {
        return 'feather' + p + n;
    },
    tip : {
        part : 'tip',
        pos : [0, 0, 0],
        colorMat : lambertWhite,
        x : function(b, t) {
            return bias(b, t);
        },
        rotation : function(t) {
            return Math.asin(1 - t);
        },
        scale : function(t) {
            return t;
        },
        wingy : function() {
            return (-Math.sin((new Date()).getTime() / settings.speedF) + 1)/2;
        }
    },
    shoulder : {
        part : 'shoulder',
        pos : [0, 0, 1],
        colorMat : lambertWhite,
        x : function(b, t) {
            return bias(b, 1) - settings.shoulderCurve * t * t;
        },
        rotation : function(t) {
            return 0;
        },
        scale : function(t) {
            return 1 - Math.abs(settings.shoulderCurve * t * t);
        },
        wingy : function() {
            return (Math.sin((new Date()).getTime() / settings.speedF) + 1)/2;
        }
    },
    shoulderInside : {
        part : 'shoulderInside',
        pos : [0, 0.2, 1],
        colorMat : lambertGrey,
        x : function(b, t) {
            return bias(b, 1) - settings.shoulderCurve * t * t;
        },
        rotation : function(t) {
            return 0;
        },
        scale : function(t) {
            return (1 - Math.abs(settings.shoulderCurve * t * t)) / 2;
        },
        wingy : function() {
            return (Math.sin((new Date()).getTime() / settings.speedF) + 1)/2;
        }
    },
    tipInside : {
        part : 'tipInside',
        pos : [0, 0.2, 0],
        colorMat : lambertGrey,
        x : function(b, t) {
            return bias(b, t);
        },
        rotation : function(t) {
            return Math.asin(1 - t);
        },
        scale : function(t) {
            return t * 0.5;
        },
        wingy : function() {
            return (-Math.sin((new Date()).getTime() / settings.speedF) + 1)/2;
        }
    },
    tipL : {
        part : 'tipL',
        pos : [0, 0, 4],
        colorMat : lambertWhite,
        x : function(b, t) {
            return bias(b, (1-t));
        },
        rotation : function(t) {
            return Math.asin(1 - (1-t));
        },
        scale : function(t) {
            return (1-t);
        },
        wingy : function() {
            return (-Math.sin((new Date()).getTime() / settings.speedF) + 1)/2;
        }
    },
    shoulderL : {
        part : 'shoulderL',
        pos : [0, 0, 3],
        colorMat : lambertWhite,
        x : function(b, t) {
            return bias(b, 1) - settings.shoulderCurve * (1-t) * (1-t);
        },
        rotation : function(t) {
            return 0;
        },
        scale : function(t) {
            return 1 - Math.abs(settings.shoulderCurve * (1-t) * (1-t));
        },
        wingy : function() {
            return (Math.sin((new Date()).getTime() / settings.speedF) + 1)/2;
        }
    },
    shoulderInsideL : {
        part : 'shoulderInsideL',
        pos : [0, 0.2, 3],
        colorMat : lambertGrey,
        x : function(b, t) {
            return bias(b, 1) - settings.shoulderCurve * (1-t) * (1-t);
        },
        rotation : function(t) {
            return 0;
        },
        scale : function(t) {
            return (1 - Math.abs(settings.shoulderCurve * (1-t) * (1-t)))/2;
        },
        wingy : function() {
            return (Math.sin((new Date()).getTime() / settings.speedF) + 1)/2;
        }
    },
    tipInsideL : {
        part : 'tipInsideL',
        pos : [0, 0.2, 4],
        colorMat : lambertGrey,
        x : function(b, t) {
            return bias(b, (1-t));
        },
        rotation : function(t) {
            return Math.asin(1 - (1-t));
        },
        scale : function(t) {
            return (1-t) * 0.5;
        },
        wingy : function() {
            return (-Math.sin((new Date()).getTime() / settings.speedF) + 1)/2;
        }
    },
};

var wing = [wingConfig.shoulder, 
            wingConfig.tip,
            wingConfig.shoulderInside,
            wingConfig.tipInside,
            wingConfig.shoulderL,
            wingConfig.tipL,
            wingConfig.shoulderInsideL,
            wingConfig.tipInsideL,];


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
    objLoader.load('./geo/feather.obj', function(obj) {

        // LOOK: This function runs after the obj has finished loading
        var featherGeo = obj.children[0].geometry;
        for (var j = 0; j < wing.length; j++) {
            var w = wing[j];
            for (var i = 0; i < settings.nFeathers; i++) {
                var z = 1 / settings.density * i;
                var x = w.x(settings.bias, z);
                var featherMesh = new THREE.Mesh(featherGeo, w.colorMat);
                featherMesh.position.z = z + w.pos[2];
                featherMesh.position.x = x + w.pos[0];


                featherMesh.scale.x = w.scale(z) * settings.size;

                featherMesh.rotation.y = w.rotation(z);


                featherMesh.name = wingConfig.name(w.part, i);
                scene.add(featherMesh);
            }
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

    gui.add(settings, 'density', 0.1, settings.nFeathers);

    gui.add(settings, 'bias', 0.05, 1);

    gui.add(settings, 'speed', 1, 1000);

    gui.add(settings, 'speedF', 1, 1000);

    gui.add(settings, 'scale', 0.1, 50);

    gui.add(settings, 'size', 0.1, 5);

    gui.add(settings, 'wind', 0, 90);

    gui.add(settings, 'shoulderCurve', -0.5, 0.5);

    // Color menu
	gui.addColor(settings, 'outerColor').onChange(function(newVal){
		lambertWhite.color = new THREE.Vector3(newVal[0]/255, newVal[1]/255, newVal[2]/255);
	});

        // Color menu
    gui.addColor(settings, 'innerColor').onChange(function(newVal){
        lambertGrey.color = new THREE.Vector3(newVal[0]/255, newVal[1]/255, newVal[2]/255);
    });
}

// called on frame updates
function onUpdate(framework) {

    var shoulderPos = wing[0].wingy();
    var tipPos = wing[1].wingy();

    for (var j = 0; j < wing.length; j++) {
        var w = wing[j];
        for (var i = 0; i < settings.nFeathers; i++) {
        	var feather = framework.scene.getObjectByName(wingConfig.name(w.part, i));    
    	    if (feather !== undefined) {
    	    	
    	    	// Update feather position
    	        var z = 1 / settings.density * i;
            	var x = w.x(settings.bias, z);
            	feather.position.z = z + w.pos[2];
                feather.position.x = x + w.pos[0];

                // Joint flap
                if (j == 0 || j == 2) {
                    feather.position.y = shoulderPos * z + (1-z) * tipPos;
                } else if (j == 4 || j == 6) {
                    feather.position.y = (1-z) * shoulderPos + z * tipPos;
                } else {
                    feather.position.y = w.wingy();
                }
                
            	// Length
            	feather.scale.x = w.scale(z) * settings.size;
            	
                // Simple flap
            	var date = new Date();
    	    	feather.rotation.z = (Math.sin(date.getTime() / settings.speed) * settings.scale * Math.PI / 180);  

                // Wind effects
                feather.rotation.x = settings.wind * Math.random() * Math.PI / 180;
                feather.rotation.y = settings.wind * Math.random() * Math.PI / 180;
    	        	
    		    if (i < settings.density) {
    				// feather.rotation.y = w.rotation(z);
    		        feather.visible = true; 
    	    	} else {
    	    		feather.visible = false;
    	    	}
       
    	    } 
        }
    }
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);