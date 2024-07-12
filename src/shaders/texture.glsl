#version 300 es
precision highp float;

out vec4 fragColor;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec2 uPos;

uniform sampler2D uSampler1;
uniform sampler2D uSampler2;

in vec2 vTextureCoord;

void main() {
	if(uMouse.y>.5){
		fragColor = texture(uSampler1,vTextureCoord*4.0);
	}
	else{
		fragColor = texture(uSampler2,vTextureCoord*4.0);
	}
}
