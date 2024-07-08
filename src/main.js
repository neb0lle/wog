import Shader from "./Shader";
import Texture from "./Texture";
import { Lube } from "./Model";
import Framebuffer from "./Framebuffer"
import { keys, mouseX, mouseY } from "./Input";

import vertexShaderSource from "./shaders/vert.glsl";
import fragmentShaderSource from "./shaders/frag.glsl";
import copyShaderSource from "./shaders/copy.glsl";

import tex0 from "./tex0.jpg"

const canvas = document.querySelector("#glcanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const resolution = [canvas.width, canvas.height];

const gl = WebGLDebugUtils.makeDebugContext(canvas.getContext("webgl2"));

if (gl === null) {
	alert("Unable to initialize WebGL.");
} else {
	// SHADER
	const vert = Shader.compileShader(vertexShaderSource, gl.VERTEX_SHADER, gl);
	const frag = Shader.compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER, gl);

	const globalShader = new Shader(gl);
	globalShader.createShaders(vert, frag);

	const copyShader = new Shader(gl);
	const copy = Shader.compileShader(copyShaderSource, gl.FRAGMENT_SHADER, gl);
	copyShader.createShaders(vert, copy)

	// DATA
	const data = new Lube(gl);
	data.setup();

	// TEXTURE
	const texture = new Texture(gl, 0);
	texture.createTex(tex0, 256, 256);

	const targetTexture = new Texture(gl, 0);
	targetTexture.createEmptyTex(256, 256);

	// FB
	const fb = new Framebuffer(gl);
	fb.createFramebuff(targetTexture.texture);

	// UNIFORM DATA
	const startTime = performance.now();
	let currentTime, elapsedTime;

	let posX = 0;
	let posY = 0;
	function updatePos(movementSpeed) {
		if (keys[72]) posX -= movementSpeed;
		if (keys[76]) posX += movementSpeed;
		if (keys[75]) posY += movementSpeed;
		if (keys[74]) posY -= movementSpeed;
	}

	const fieldOfView = (45 * Math.PI) / 180;
	const aspect = resolution[0] / resolution[1];
	const zNear = 0.1;
	const zFar = 100.0;
	const projectionMatrix = mat4.create();
	mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
	const modelViewMatrix = mat4.create();
	mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -3.0]);
	mat4.rotate(modelViewMatrix, modelViewMatrix, 45.0 * Math.PI / 180, [1, 1, 0]);

	// UNIFORM LOCATION
	const uSamplerLocation = gl.getUniformLocation(globalShader.program, "uSampler");
	const uTimeLocation = gl.getUniformLocation(globalShader.program, "uTime");
	const uResolutionLocation = gl.getUniformLocation(globalShader.program, "uResolution");
	const uMouseLocation = gl.getUniformLocation(globalShader.program, "uMouse");
	const uPosLocation = gl.getUniformLocation(globalShader.program, "uPos");
	const uPMLocation = gl.getUniformLocation(globalShader.program, "uPM");
	const uMVMLocation = gl.getUniformLocation(globalShader.program, "uMVM");

	const uSamplerLocation1 = gl.getUniformLocation(copyShader.program, "uSampler");
	const uTimeLocation1 = gl.getUniformLocation(copyShader.program, "uTime");
	const uResolutionLocation1 = gl.getUniformLocation(copyShader.program, "uResolution");
	const uMouseLocation1 = gl.getUniformLocation(copyShader.program, "uMouse");
	const uPosLocation1 = gl.getUniformLocation(copyShader.program, "uPos");
	const uPMLocation1 = gl.getUniformLocation(copyShader.program, "uPM");
	const uMVMLocation1 = gl.getUniformLocation(copyShader.program, "uMVM");

	// UNIFORM PASSTHROUGH
	gl.useProgram(globalShader.program);
	gl.uniform1i(uSamplerLocation, 0);
	gl.uniformMatrix4fv(uPMLocation, false, projectionMatrix);
	gl.uniformMatrix4fv(uMVMLocation, false, modelViewMatrix);
	gl.uniform2fv(uResolutionLocation, resolution);

	gl.useProgram(copyShader.program)
	gl.uniform1i(uSamplerLocation1, 0);
	gl.uniformMatrix4fv(uPMLocation1, false, projectionMatrix);
	gl.uniformMatrix4fv(uMVMLocation1, false, modelViewMatrix);
	gl.uniform2fv(uResolutionLocation1, resolution);

	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);

	function renderLoop() {
		// UPDATE
		currentTime = performance.now();
		elapsedTime = (currentTime - startTime) / 1000;
		updatePos(0.01);
		mat4.rotate(modelViewMatrix, modelViewMatrix, (mouseX / resolution[0] - 0.5) * 2.0 * Math.PI / 180, [1, 0, 0]);
		mat4.rotate(modelViewMatrix, modelViewMatrix, (0.5 - mouseY / resolution[1]) * 2.0 * Math.PI / 180, [0, 1, 0]);


		// p1 
		gl.useProgram(globalShader.program);
		gl.uniform1f(uTimeLocation, elapsedTime);
		gl.uniform2f(uPosLocation, posX, posY);
		gl.uniform2f(uMouseLocation, mouseX / resolution[0] - 0.5, 0.5 - mouseY / resolution[1]);
		gl.uniformMatrix4fv(uMVMLocation, false, modelViewMatrix);

		fb.bind();
		texture.bind();
		gl.viewport(0, 0, 256, 256);
		gl.clearColor(0.1, 0.1, 0.1, 1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		data.render();

		// p2
		gl.useProgram(copyShader.program);
		gl.uniform1f(uTimeLocation1, elapsedTime);
		gl.uniform2f(uPosLocation1, posX, posY);
		gl.uniform2f(uMouseLocation1, mouseX / resolution[0] - 0.5, 0.5 - mouseY / resolution[1]);
		gl.uniformMatrix4fv(uMVMLocation1, false, modelViewMatrix);

		fb.unbind();
		targetTexture.bind();
		gl.viewport(0, 0, resolution[0], resolution[1]);
		gl.clearColor(1, 1, 1, 1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		data.render();

		requestAnimationFrame(renderLoop);
	}

	renderLoop();
}

