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

float edgeFunction(vec2 a, vec2 b, vec2 c) {
    return (c.x - a.x) * (b.y - a.y) - (c.y - a.y) * (b.x - a.x);
}

bool isPointInTriangle(vec2 p, vec2 v1, vec2 v2, vec2 v3) {
    float d1, d2, d3;
    bool has_neg, has_pos;

    d1 = edgeFunction(v1, v2, p);
    d2 = edgeFunction(v2, v3, p);
    d3 = edgeFunction(v3, v1, p);

    has_neg = (d1 < 0.0) || (d2 < 0.0) || (d3 < 0.0);
    has_pos = (d1 > 0.0) || (d2 > 0.0) || (d3 > 0.0);

    return !(has_neg && has_pos);
}

void main() {
    float sf = 40.0;
    vec2 uv = gl_FragCoord.xy / uResolution;
    vec2 t = floor(uv * sf) / sf;

    // vec2 v1 = uMouse + vec2(-0.1, -0.1);
    // vec2 v2 = uMouse + vec2(0.1, -0.1);
    // vec2 v3 = uMouse + vec2(0.0, 0.18);
    //
    // if (isPointInTriangle(t, v1, v2, v3)) {
    //     fragColor = vec4(1.0) - vec4(texture(uSampler1, vTextureCoord * sf).rgb, 0.0);
    // } else {
    //     fragColor = vec4(1.0) - vec4(texture(uSampler2, vTextureCoord * sf).rgb, 0.0);
    // }

	// circle
	float radius = 0.1;
    if (distance(t,uMouse)<radius) {
        fragColor = vec4(1.0) - vec4(texture(uSampler1, vTextureCoord * sf).rgb, 0.0);
    } else {
        fragColor = vec4(1.0) - vec4(texture(uSampler2, vTextureCoord * sf).rgb, 0.0);
    }

}
