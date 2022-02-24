#ifdef GL_ES

precision mediump float;

#endif

//varying vec2 vTexCoord;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_modulo;
uniform float u_add;

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(10, 2342.423)) + u_add) * 100000.0);
}

void main() {
    //vec2 st = vec2((gl_FragCoord.x + mod(float(gl_FragCoord.x), u_modulo)) / u_resolution.x, (gl_FragCoord.y + mod(float(gl_FragCoord.y), u_modulo)) / u_resolution.y);
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.y = 1.0 - st.y;

    vec4 color = texture2D(u_texture, st);
    //float grey = step(u_time, 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b);
    float grey = step(0.5, mod((0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b) * 8.0 + u_time * 4.0, 2.0 + u_time * -1.5));
    if (random(st) * 20.0 < u_time) {
      grey = 1.0 - grey;
    }
    //grey = step(1.0, floor(mod(grey * 20.0, 2.0)));




    gl_FragColor = vec4(grey, grey, grey, 0.1);//vec4(coord.x, coord.y, 0.0, 1.0);

}
