vec3 mySinh(in vec3 x) {
    return 0.5 * (exp(x) - exp(-x));
}

float myAsinh(in float x) {
    return log(x + sqrt(x*x + 1.));
}

vec3 myAsinh(in vec3 x) {
    return log(x + sqrt(x*x + 1.));
}