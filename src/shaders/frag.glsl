#version 300 es
precision highp float;

out vec4 fragColor;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec2 uPos;

uniform sampler2D uSampler;

in vec2 vCoord;

float getState(vec2 uv) {
    return texture(uSampler, uv).r;
}

int getAliveNeighbors(vec2 uv) {
    int count = 0;
    for (int x = -1; x <= 1; x++) {
        for (int y = -1; y <= 1; y++) {
            if (x == 0 && y == 0) continue;
            vec2 offset = vec2(float(x), float(y)) / uResolution;
            vec2 neighborUV = uv + offset;
            neighborUV = mod(neighborUV + 1.0, 1.0);
            if (getState(neighborUV) > 0.5) {
                count++;
            }
        }
    }
    return count;
}

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    float currentState = getState(uv);
    float radius = 0.01;
    float dist = distance(uv, uMouse);

    if (dist < radius) {
        fragColor = vec4(1.0, 1.0, 1.0, 1.0);
    } else {
        int aliveNeighbors = getAliveNeighbors(uv);
        if (currentState > 0.5) {
            if (aliveNeighbors < 2 || aliveNeighbors > 3) {
                currentState = 0.0;
            }
        } else {
            if (aliveNeighbors == 3) {
                currentState = 1.0;
            }
        }
        fragColor = vec4(vec3(currentState), 1.0);
    }
}
