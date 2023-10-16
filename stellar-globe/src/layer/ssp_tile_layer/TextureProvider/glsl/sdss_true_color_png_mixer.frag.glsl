precision highp float;

uniform sampler2D  u_texture0, u_texture1, u_texture2;
uniform float u_beta;
uniform float u_a;
uniform float u_bias;
uniform float u_b0;
varying vec2 v_coord;

//@import ./sinh;
//@import ./decode_png;
//@import ./sdss_true_color;

void main(void){
    vec3 raw = decode_png(vec3(
        texture2D(u_texture0, v_coord).r,
        texture2D(u_texture1, v_coord).r,
        texture2D(u_texture2, v_coord).r
    ));
    vec3 color = sdss_true_color(raw, u_beta, u_a, u_bias, u_b0);
    gl_FragColor = vec4(color, 1.);
}