#version 300 es
precision highp float;

out vec4 fragColor;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec2 uPos;

uniform sampler2D uSampler;

in vec2 vCoord;

void main() {
	fragColor = vec4(texture(uSampler,vCoord));
}
