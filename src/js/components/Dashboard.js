import * as THREE from 'three'
import OrbitControls from 'orbit-controls-es6'
import { TweenMax } from 'gsap'
import WEBVR from './WebVR'
import paper from 'paper'

import vert from '../shaders/shader.vert'
import frag from '../shaders/shader.frag'

// Three Scene
let scene, camera, renderer, animationId, controls
let uniforms, geometry, plane, material, mesh

class Dashboard {

    constructor() {

        this.animate = this.animate.bind(this)
        this.resize = this.resize.bind(this)
        this.mousemove = this.mousemove.bind(this)

        this.setConfig()
        this.init()

    }

    setConfig() {

        this.c = {
            dpr: window.devicePixelRatio >= 2 ? 2 : 1,
            startTime: Date.now(),
            size: {
                w: window.innerWidth,
                h: window.innerHeight
            }
        }

        this.mousePerspective = new THREE.Vector2()

    }

    init() {

        this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false })
        this.renderer.setPixelRatio( this.c.dpr )
        this.renderer.setSize(this.c.size.w, this.c.size.h)

        scene = new THREE.Scene()
        // scene.background = new THREE.Color('0xFFFFFF')

        let cameraPosition = 1500;

        const fov = 180 * ( 2 * Math.atan( this.c.size.h / 2 / cameraPosition ) ) / Math.PI
        this.camera = new THREE.PerspectiveCamera( fov, this.c.size.w / this.c.size.h, 1, 5000 )
        this.camera.position.set( 0, 0, cameraPosition )

        controls = new OrbitControls( this.camera )

        this.hudCanvas = document.createElement('canvas')

        paper.setup(this.hudCanvas)

        this.hudTexture = new THREE.Texture(this.hudCanvas)
        this.hudTexture.minFilter = THREE.LinearFilter
        this.hudTexture.magFilter = THREE.LinearFilter
        this.hudTexture.anisotropy = this.renderer.capabilities.getMaxAnisotropy()
        this.hudTexture.needsUpdate = true

        uniforms = {
            u_time: { type: 'f', value: 1.0 },
            u_texture: { type: 't', value: this.hudTexture }
        }

        geometry = this.CylinderCurvedSurfaceGeometry( 2000, 1500, Math.PI*0.75, Math.PI*1.25, 100, 10)

        // geometry = new THREE.PlaneGeometry(1000, 800, 10, 10)
    
        // geometry = new THREE.SphereGeometry(1500, 50, 50, 0, 2, 1, 1);

        material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            fragmentShader: frag,
            vertexShader: vert,
            side: THREE.BackSide
        })
    
        mesh = new THREE.Mesh(geometry, material)
        mesh.position.z = 350
        mesh.scale.x = -1

        let box = new THREE.Box3().setFromObject( mesh )
        this.screenSize = new THREE.Vector3()
        box.getSize( this.screenSize )

        scene.add(mesh)

        // Again, set dimensions to fit the screen.
        this.hudCanvas.width = this.screenSize.x
        this.hudCanvas.height = this.screenSize.y

        // Get 2D context and draw something supercool.
        this.hudBitmap = this.hudCanvas.getContext('2d');
    
        document.body.appendChild(this.renderer.domElement)
        
        // document.body.appendChild( WEBVR.createButton( this.renderer ) )

        // this.renderer.vr.enabled = true
        this.renderer.domElement.addEventListener( 'wheel', this.scroll, false )
        window.addEventListener( 'mousemove', this.mousemove, false )

        // this.renderer.setAnimationLoop( this.animate )
        this.animate()

    }

    mousemove( e ) {
        
        this.mousePerspective.x = e.clientX / window.innerWidth - 0.5
        this.mousePerspective.y = e.clientY / window.innerHeight - 0.5
        this.updatingPerspective = true

    }

    updatePerspective() {

        // let deltaX = ( this.mousePerspective.x - this.camera.rotation.x ) / 5
        // let deltaY = ( this.mousePerspective.y - this.camera.rotation.y  ) / 5
        // this.camera.rotation.x = -deltaY
        // this.camera.rotation.y = -deltaX

        TweenMax.to( this.camera.rotation, 4, {
            x: -this.mousePerspective.y * 0.5,
            y: -this.mousePerspective.x * 0.5,
            ease: 'Power4.easeOut',
        })

        // if( Math.abs( deltaX ) > 0.1 || Math.abs( deltaY ) > 0.1 ) {
        //     this.updatingPerspective = true
        // } else {
        //     this.updatingPerspective = false
        // }

    }

    animate() {

        this.animationId = requestAnimationFrame(this.animate.bind(this))

        if( this.updatingPerspective ) {
            this.updatePerspective()
            this.updatingPerspective = false
        }

        let date = new Date()
        let elapsedMilliseconds = Date.now() - this.c.startTime
        uniforms.u_time.value = elapsedMilliseconds / 100

        this.hudBitmap.clearRect(0, 0, this.screenSize.x, this.screenSize.y)

        // this.hudBitmap.shadowColor = "#76A9E0"
        // this.hudBitmap.shadowOffsetX = 0
        // this.hudBitmap.shadowOffsetY = 0
        // this.hudBitmap.shadowBlur = 20

        this.hudBitmap.fillStyle = "black"
        this.hudBitmap.fillRect(0, 0, this.screenSize.x, this.screenSize.y)

        this.hudBitmap.strokeStyle = "#FFF";
        this.roundRect(this.hudBitmap, 5, 5, this.screenSize.x - 10, this.screenSize.y - 10, 0, false, true)
        this.hudBitmap.strokeStyle = null;

        this.hudBitmap.fillStyle = "#FFF"
        this.hudBitmap.font = "600 50px industry"
        this.hudBitmap.textAlign = 'left'
        this.hudBitmap.fillText('GC STUDIO | DASHBOARD', 30, 80)
        this.hudBitmap.font = "600 20px industry"
        this.hudBitmap.textAlign = 'right'
        this.hudBitmap.fillText(`${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}`, this.screenSize.x - 50, this.screenSize.y - 50)

        this.hudBitmap.strokeStyle = "#FFF";
        this.roundRect(this.hudBitmap, 30, 120, 210, 150, 0, false, true)
        this.hudBitmap.strokeStyle = null;

        this.hudBitmap.font = "600 30px industry"
        this.hudBitmap.textAlign = 'left';
        this.hudBitmap.fillText('DRIBBBLE', 50, 170)

        this.hudBitmap.font = "400 40px industry"
        this.hudBitmap.fillText(elapsedMilliseconds, 50, 232)

        this.hudBitmap.strokeStyle = "#FFF";
        this.roundRect(this.hudBitmap, 260, 120, 210, 150, 0, false, true)
        this.hudBitmap.strokeStyle = null;

        this.hudBitmap.font = "600 30px industry"
        this.hudBitmap.fillText('TWITTER', 280, 170)

        this.hudBitmap.font = "400 40px industry"
        this.hudBitmap.fillText(elapsedMilliseconds, 280, 232)

        this.hudBitmap.strokeStyle = "#FFF";
        this.roundRect(this.hudBitmap, 490, 120, 210, 150, 0, false, true)
        this.hudBitmap.strokeStyle = null;

        this.hudBitmap.font = "600 30px industry"
        this.hudBitmap.fillText('INSTAGRAM', 510, 170)

        this.hudBitmap.font = "400 40px industry"
        this.hudBitmap.fillText(elapsedMilliseconds, 510, 232)

        this.hudTexture.needsUpdate = true

        this.renderer.render(scene, this.camera)
    }

    // Event listeners
    resize() {
        this.camera.left = -window.innerWidth / 2
        this.camera.right = window.innerWidth / 2
        this.camera.top = window.innerHeight / 2
        this.camera.bottom = -window.innerHeight / 2
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }

    CylinderCurvedSurfaceGeometry(radius, height, startAngle, endAngle, horizontalSegments, verticalSegments) {
        var width = radius * 2 * Math.PI;
        var plane = new THREE.PlaneGeometry(width, height, horizontalSegments, verticalSegments);
        var index = 0;
    
        for(var i=0; i<=verticalSegments; i++) {
            for(var j=0; j<=horizontalSegments; j++) {
                var angle = startAngle + (j/horizontalSegments)*(endAngle - startAngle);
                plane.vertices[index].z = radius * Math.cos(angle);
                plane.vertices[index].x = radius * Math.sin(angle);
                index++;
            }
        }
    
        plane.computeFaceNormals();
        plane.computeVertexNormals();
    
        return plane;
    }

    /**
     * Draws a rounded rectangle using the current state of the canvas.
     * If you omit the last three params, it will draw a rectangle
     * outline with a 5 pixel border radius
     * @param {CanvasRenderingContext2D} ctx
     * @param {Number} x The top left x coordinate
     * @param {Number} y The top left y coordinate
     * @param {Number} width The width of the rectangle
     * @param {Number} height The height of the rectangle
     * @param {Number} [radius = 5] The corner radius; It can also be an object 
     *                 to specify different radii for corners
     * @param {Number} [radius.tl = 0] Top left
     * @param {Number} [radius.tr = 0] Top right
     * @param {Number} [radius.br = 0] Bottom right
     * @param {Number} [radius.bl = 0] Bottom left
     * @param {Boolean} [fill = false] Whether to fill the rectangle.
     * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
    */
    roundRect(ctx, x, y, width, height, radius, fill, stroke) {
        if (typeof stroke == 'undefined') {
        stroke = true;
        }
        if (typeof radius === 'undefined') {
        radius = 5;
        }
        if (typeof radius === 'number') {
        radius = {tl: radius, tr: radius, br: radius, bl: radius};
        } else {
        var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
        for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
        }
        ctx.beginPath();
        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + width - radius.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        ctx.closePath();
        if (fill) {
        ctx.fill();
        }
        if (stroke) {
        ctx.stroke();
        }
    
    }

}

export default Dashboard