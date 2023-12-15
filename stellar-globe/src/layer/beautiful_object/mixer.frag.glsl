#define M_PI 3.14159265358979323846264
precision highp float;
uniform sampler2D  u_texture0;
uniform sampler2D  u_texture1;
uniform sampler2D  u_texture2;
uniform sampler2D  u_texture3;
uniform vec4       u_a;
uniform vec4       u_b;
uniform vec4       u_beta;
uniform vec4       u_bias;
uniform mat4       u_mix;
uniform float      u_exposure;
uniform float      u_gamma;
uniform float      u_ground;
varying vec2       v_coord;

// vec3 mySinh(in vec3 x) {
//     return 0.5 * (exp(x) - exp(-x));
// }

vec4 myAsinh(in vec4 x) {
    return log(x + sqrt(x*x + 1.));
}

void main(void){
    vec4 source = vec4(
        texture2D(u_texture0, v_coord).a,
        texture2D(u_texture1, v_coord).a,
        texture2D(u_texture2, v_coord).a,
        texture2D(u_texture3, v_coord).a
    );
    source = u_a * (source + u_b);
    source = myAsinh(u_beta * source) / myAsinh(u_beta) + u_bias;
    source = clamp(source, 0., 1.);
    source = -0.5 * (cos(M_PI * clamp(source, 0., 1.)) - 1.0);
    vec3 rgb = (u_mix * source).rgb;
    rgb = pow(u_exposure * max(vec3(0.), (rgb + u_ground)), vec3(u_gamma));
    gl_FragColor.rgb = rgb;
    gl_FragColor.a = 1.;
}