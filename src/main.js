import Shader from "./Shader";
import Texture from "./Texture";
import Framebuffer from "./Framebuffer";
import { Frame } from "./Model";

import vertexSS from "./shaders/vert.glsl";
import fragSS from "./shaders/frag.glsl";
import copyFragSS from "./shaders/copy.glsl";

const canvas = document.querySelector("#glcanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const resolution = [canvas.width, canvas.height];

const gl = WebGLDebugUtils.makeDebugContext(canvas.getContext("webgl2"));

if (gl === null) {
	alert("Unable to initialize WebGL.");
} else {

	const vert = Shader.compileShader(vertexSS, gl.VERTEX_SHADER, gl);
	const frag = Shader.compileShader(fragSS, gl.FRAGMENT_SHADER, gl);
	const copyFrag = Shader.compileShader(copyFragSS, gl.FRAGMENT_SHADER, gl);

	const shaderProgram = new Shader(gl);
	shaderProgram.createShaders(vert, frag);

	const copyShaderProgram = new Shader(gl);
	copyShaderProgram.createShaders(vert, copyFrag);

	const data = new Frame(gl);
	data.setup();

	let frontTex = new Texture(gl, 0);
	frontTex.createEmptyTex(256, 256);

	let backTex = new Texture(gl, 1);
	backTex.createEmptyTex(256, 256);

	const fb = new Framebuffer(gl);
	fb.createFramebuff(backTex.texture);

	// Set uniforms for Game of Life shader
	gl.useProgram(shaderProgram.program);
	const uSamplerLocation = gl.getUniformLocation(shaderProgram.program, "uSampler");
	const uScaleLocation = gl.getUniformLocation(shaderProgram.program, "uScale");
	gl.uniform1i(uSamplerLocation, 0);
	gl.uniform2fv(uScaleLocation, [256, 256]);

	// Set uniforms for copy shader
	gl.useProgram(copyShaderProgram.program);
	const uCopySamplerLocation = gl.getUniformLocation(copyShaderProgram.program, "uSampler");
	const uCopyScaleLocation = gl.getUniformLocation(copyShaderProgram.program, "uScale");
	const uCopyResolutionLocation = gl.getUniformLocation(copyShaderProgram.program, "uResolution");
	gl.uniform1i(uCopySamplerLocation, 0);
	gl.uniform2fv(uCopyScaleLocation, [256, 256]);
	gl.uniform2fv(uCopyResolutionLocation, resolution);

	function swapTextures() {
		let temp = frontTex;
		frontTex = backTex;
		backTex = temp;
		fb.setTexture(backTex.texture);
	}

	function renderLoop() {
		// Simulate Game of Life
		fb.bind();
		gl.viewport(0, 0, 256, 256);
		gl.useProgram(shaderProgram.program);
		frontTex.bind();
		gl.clearColor(0, 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		data.render();

		fb.unbind();
		swapTextures();

		// Copy to canvas
		gl.useProgram(copyShaderProgram.program);
		gl.viewport(0, 0, resolution[0], resolution[1]);
		gl.clearColor(1, 1, 1, 1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		frontTex.bind();
		data.render();

		requestAnimationFrame(renderLoop);
	}

	renderLoop();
}
