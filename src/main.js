import Shader from "./Shader";
import Texture from "./Texture";
import { Triangle, TexMap, Mesh } from "./Model";
import { keys, mouseX, mouseY } from "./Input";

import vertexShaderSource from "./shaders/vert.glsl";
import fragmentShaderSource from "./shaders/test.glsl";

import sampleTexture from "./tex.jpg";
// import sampleTexture from "./tex2.png";

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
	const frag0 = Shader.compileShader(
		fragmentShaderSource,
		gl.FRAGMENT_SHADER,
		gl,
	);

	const globalShader = new Shader(gl);
	globalShader.createShaders(vert, frag0);

	// DATA
	const data = new TexMap(gl);
	data.setup();

	// TEXTURE
	const texture = new Texture(gl, 0);
	texture.createTexture(sampleTexture);

	gl.useProgram(globalShader.program);

	// UNIFORMS
	const uSamplerLocation = gl.getUniformLocation(
		globalShader.program,
		"uSampler",
	);
	gl.uniform1i(uSamplerLocation, 0);

	const startTime = performance.now();
	let currentTime, elapsedTime;
	const uTimeLocation = gl.getUniformLocation(globalShader.program, "uTime");
	const uResolutionLocation = gl.getUniformLocation(
		globalShader.program,
		"uResolution",
	);
	const uMouseLocation = gl.getUniformLocation(
		globalShader.program,
		"uMouse",
	);
	let posX = 0;
	let posY = 0;
	function updatePos(movementSpeed) {
		if (keys[72]) posX -= movementSpeed;
		if (keys[76]) posX += movementSpeed;
		if (keys[75]) posY += movementSpeed;
		if (keys[74]) posY -= movementSpeed;
	}
	const uPosLocation = gl.getUniformLocation(globalShader.program, "uPos");

	gl.useProgram(globalShader.program);
	gl.uniform2fv(uResolutionLocation, resolution);

	gl.clearColor(0, 0, 0, 1);
	function renderLoop() {
		gl.clear(gl.COLOR_BUFFER_BIT);

		// UPDATE
		currentTime = performance.now();
		elapsedTime = (currentTime - startTime) / 1000;
		gl.uniform1f(uTimeLocation, elapsedTime);

		updatePos(0.01);
		gl.uniform2f(uPosLocation, posX, posY);

		gl.uniform2f(
			uMouseLocation,
			mouseX / resolution[0] - 0.5,
			0.5 - mouseY / resolution[1],
		);

		data.render();

		requestAnimationFrame(renderLoop);
	}

	renderLoop();
}
