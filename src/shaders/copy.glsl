#version 300 es
precision mediump float;

uniform sampler2D uSampler;
uniform vec2 uScale;
uniform vec2 uResolution;

out vec4 outColor;

void main() {
    vec2 texCoord = gl_FragCoord.xy / uResolution * uScale;
    outColor = texture(uSampler, texCoord);
}
