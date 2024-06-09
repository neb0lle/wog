#version 300 es

layout (location=0) in vec3 position;
layout (location=1) in vec2 coord;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec2 uPos;

uniform mat4 uPM;
uniform mat4 uMVM;

out vec2 vCoord;

void main() {
	gl_Position = uPM * uMVM * vec4(position, 1.0);
	vCoord = coord;
}
