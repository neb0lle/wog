import Shader from "./Shader";
import Texture from "./Texture";
import { TexMap } from "./Model";
import { keys, mouseX, mouseY } from "./Input";

import vertexShaderSource from "./shaders/vert.glsl";
import fragmentShaderSource from "./shaders/texture.glsl";

import t1 from "./black.png";
import t2 from "./white.png";

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
	const tex1 = new Texture(gl, 0);
	tex1.createTex(t1);

	const tex2 = new Texture(gl, 2);
	tex2.createTex(t2);

	gl.useProgram(globalShader.program);

	// UNIFORMS
	const uSampler1Location = gl.getUniformLocation(
		globalShader.program,
		"uSampler1",
	);
	gl.uniform1i(uSampler1Location, 0);

	const uSampler2Location = gl.getUniformLocation(
		globalShader.program,
		"uSampler2",
	);
	gl.uniform1i(uSampler2Location, 1);

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

	gl.uniform2fv(uResolutionLocation, resolution);

	gl.clearColor(1, 1, 1, 1);

	function renderLoop() {
		gl.clear(gl.COLOR_BUFFER_BIT);

		// UPDATE
		currentTime = performance.now();
		elapsedTime = (currentTime - startTime) / 1000;
		gl.uniform1f(uTimeLocation, elapsedTime);
		gl.uniform2f(
			uMouseLocation,
			mouseX / resolution[0],
			1.0 - mouseY / resolution[1],
		);
		data.render();

		requestAnimationFrame(renderLoop);
	}

	renderLoop();
}
