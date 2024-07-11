import Shader from "./Shader";
import Texture from "./Texture";
import { TexMap } from "./Model";
import Framebuffer from "./Framebuffer"
import { mouseX, mouseY } from "./Input";

import vertexShaderSource from "./shaders/vert.glsl";
import fragmentShaderSource from "./shaders/frag.glsl";
import copyShaderSource from "./shaders/copy.glsl";

const canvas = document.querySelector("#glcanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const scaleFactor = 4;
const resolution = [canvas.width / scaleFactor, canvas.height / scaleFactor];

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
	const data = new TexMap(gl);
	data.setup();

	// TEXTURE
	var texture1 = new Texture(gl, 0);
	texture1.createEmptyTex(resolution[0], resolution[1]);

	var texture2 = new Texture(gl, 1);
	texture2.createEmptyTex(resolution[0], resolution[1]);

	// FB
	const fb = new Framebuffer(gl);
	fb.createFramebuff(texture2.texture, resolution[0], resolution[1]);

	function swapTextures() {
		let temp = texture1;
		texture1 = texture2;
		texture2 = temp;

		texture1.unit = 0;
		texture1.bind();
		texture2.unit = 1;
		texture2.bind();
		fb.setTexture(texture2.texture);
	}

	// UNIFORM DATA
	const startTime = performance.now();
	let currentTime, elapsedTime;


	// UNIFORM LOCATION
	const uSamplerLocation = gl.getUniformLocation(globalShader.program, "uSampler");
	const uTimeLocation = gl.getUniformLocation(globalShader.program, "uTime");
	const uResolutionLocation = gl.getUniformLocation(globalShader.program, "uResolution");
	const uMouseLocation = gl.getUniformLocation(globalShader.program, "uMouse");

	const uSamplerLocation1 = gl.getUniformLocation(copyShader.program, "uSampler");

	// UNIFORM PASSTHROUGH
	gl.useProgram(globalShader.program);
	gl.uniform1i(uSamplerLocation, 0);
	gl.uniform2fv(uResolutionLocation, resolution);

	gl.useProgram(copyShader.program)
	gl.uniform1i(uSamplerLocation1, 1);

	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);

	function renderLoop() {
		// UPDATE
		currentTime = performance.now();
		elapsedTime = (currentTime - startTime) / 1000;

		// p1 
		gl.useProgram(globalShader.program);
		gl.uniform1f(uTimeLocation, elapsedTime);
		gl.uniform2f(uMouseLocation, mouseX / resolution[0] / scaleFactor, 1 - mouseY / resolution[1] / scaleFactor);

		fb.bind();
		gl.viewport(0, 0, resolution[0], resolution[1]);
		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		data.render();

		swapTextures();

		// p2
		gl.useProgram(copyShader.program);
		fb.unbind();
		gl.viewport(0, 0, resolution[0] * scaleFactor, resolution[1] * scaleFactor);
		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		data.render();

		requestAnimationFrame(renderLoop);
	}


	renderLoop();
}

