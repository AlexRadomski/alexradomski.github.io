#ifdef GL_ES

precision mediump float;

#endif

uniform vec2 u_resolution;
uniform float u_add;
uniform float u_time;

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(10, 2342.423)) + u_add) * 100000.0);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;

    float rnd = step(0.98, random(st));

    gl_FragColor = vec4(vec3(rnd),1.0);
}
