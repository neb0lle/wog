#version 300 es
precision highp float;

out vec4 fragColor;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec2 uPos;

float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (a - b) / k, 0.0, 1.0);
    return mix(a, b, h) - k * h * (1.0 - h);
}

float sdSphere(vec3 p, float radius) {
    return length(p) - radius;
}

float map(vec3 p) {
    vec3 sphere1Pos = vec3(uPos, 1.0);
    vec3 sphere2Pos = vec3(-uPos, 1.0);
    float dist1 = sdSphere(p - sphere1Pos, 0.5);
    float dist2 = sdSphere(p - sphere2Pos, 0.5);
    return smin(dist1, dist2, 2.0);
}

vec3 calculateNormal(vec3 p) {
    vec3 sphere1Pos = vec3(uPos, 1.0);
    vec3 sphere2Pos = vec3(-uPos, 1.0);
    float dist1 = sdSphere(p - sphere1Pos, 0.5);
    float dist2 = sdSphere(p - sphere2Pos, 0.5);
    return normalize(mix(normalize(p - sphere1Pos), normalize(p - sphere2Pos), step(dist2, dist1)));
}

void main() {
    vec2 uv = (2.0 * gl_FragCoord.xy - uResolution.xy) / uResolution.y;

    vec3 camPos = vec3(0.0, 0.0, -1.0);
    vec3 rayDir = normalize(vec3(uv, 1.0));

    vec3 lightPos = vec3(0.0, 0.0, -1.0);

    float t = 0.0;
    float maxDist = 100.0;
    for (int i = 0; i < 100; i++) {
        vec3 p = camPos + t * rayDir;
        float dist = map(p);
        if (dist < 0.001 || t > maxDist) {
            break;
        }
        t += dist;
    }

    vec3 color = vec3(0.0);
    if (t < maxDist) {
        vec3 intersectionPoint = camPos + t * rayDir;
        vec3 normal = calculateNormal(intersectionPoint);

        vec3 lightDir = normalize(lightPos - intersectionPoint);
        float diffuseIntensity = max(dot(normal, lightDir), 0.0);

        color = vec3(1.0) * diffuseIntensity;
    }

    fragColor = vec4(color, 1.0);
}
