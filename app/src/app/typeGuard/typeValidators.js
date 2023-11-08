"use strict";
export const HashState = validate10;
var schema11 = {"$id":"HashState","additionalProperties":false,"properties":{"cameraParams":{"additionalProperties":false,"properties":{"fovy":{"type":"number"},"phi":{"type":"number"},"roll":{"type":"number"},"skyCoord":{"additionalProperties":false,"properties":{"dec":{"type":"number"},"ra":{"type":"number"}},"required":["dec","ra"],"type":"object"},"theta":{"type":"number"},"za":{"type":"number"},"zd":{"type":"number"},"zp":{"type":"number"}},"required":["fovy","phi","roll","skyCoord","theta","za","zd","zp"],"type":"object"},"datasets":{"items":{"type":"string"},"type":"array"},"tractTileLayerColorParams":{"anyOf":[{"additionalProperties":false,"properties":{"filters":{"items":{"type":"string"},"type":"array"},"simpleRgb":{"additionalProperties":false,"properties":{"a":{"type":"number"},"b0":{"type":"number"},"beta":{"type":"number"},"bias":{"type":"number"}},"required":["a","b0","beta","bias"],"type":"object"},"type":{"const":"simpleRgb","type":"string"}},"required":["filters","simpleRgb","type"],"type":"object"},{"additionalProperties":false,"properties":{"filters":{"items":{"type":"string"},"type":"array"},"simpleColorMatrix":{"additionalProperties":false,"properties":{"a":{"type":"number"},"b0":{"type":"number"},"beta":{"type":"number"},"bias":{"type":"number"},"colors":{"items":{"items":[{"type":"number"},{"type":"number"},{"type":"number"}],"maxItems":3,"minItems":3,"type":"array"},"type":"array"}},"required":["a","b0","beta","bias","colors"],"type":"object"},"type":{"const":"simpleColorMatrix","type":"string"}},"required":["filters","simpleColorMatrix","type"],"type":"object"},{"additionalProperties":false,"properties":{"filters":{"items":{"type":"string"},"type":"array"},"sdssTrueColor":{"additionalProperties":false,"properties":{"a":{"type":"number"},"b0":{"type":"number"},"beta":{"type":"number"},"bias":{"type":"number"}},"required":["a","b0","beta","bias"],"type":"object"},"type":{"const":"sdssTrueColor","type":"string"}},"required":["filters","sdssTrueColor","type"],"type":"object"},{"additionalProperties":false,"properties":{"filters":{"items":{"type":"string"},"type":"array"},"sdssTrueColorMatrix":{"additionalProperties":false,"properties":{"a":{"type":"number"},"b0":{"type":"number"},"beta":{"type":"number"},"bias":{"type":"number"},"colors":{"items":{"items":[{"type":"number"},{"type":"number"},{"type":"number"}],"maxItems":3,"minItems":3,"type":"array"},"type":"array"}},"required":["a","b0","beta","bias","colors"],"type":"object"},"type":{"const":"sdssTrueColorMatrix","type":"string"}},"required":["filters","sdssTrueColorMatrix","type"],"type":"object"}]}},"type":"object","definitions":{}};

function validate10(data, valCxt){
"use strict"; /*# sourceURL="HashState" */;
if(valCxt){
var instancePath = valCxt.instancePath;
var parentData = valCxt.parentData;
var parentDataProperty = valCxt.parentDataProperty;
var rootData = valCxt.rootData;
}
else {
var instancePath = "";
var parentData = undefined;
var parentDataProperty = undefined;
var rootData = data;
}
var vErrors = null;
var errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
var _errs1 = errors;
for(var key0 in data){
if(!(((key0 === "cameraParams") || (key0 === "datasets")) || (key0 === "tractTileLayerColorParams"))){
validate10.errors = [{instancePath:instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.cameraParams !== undefined){
var data0 = data.cameraParams;
var _errs2 = errors;
if(errors === _errs2){
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
var missing0;
if(((((((((data0.fovy === undefined) && (missing0 = "fovy")) || ((data0.phi === undefined) && (missing0 = "phi"))) || ((data0.roll === undefined) && (missing0 = "roll"))) || ((data0.skyCoord === undefined) && (missing0 = "skyCoord"))) || ((data0.theta === undefined) && (missing0 = "theta"))) || ((data0.za === undefined) && (missing0 = "za"))) || ((data0.zd === undefined) && (missing0 = "zd"))) || ((data0.zp === undefined) && (missing0 = "zp"))){
validate10.errors = [{instancePath:instancePath+"/cameraParams",schemaPath:"#/properties/cameraParams/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
var _errs4 = errors;
for(var key1 in data0){
if(!((((((((key1 === "fovy") || (key1 === "phi")) || (key1 === "roll")) || (key1 === "skyCoord")) || (key1 === "theta")) || (key1 === "za")) || (key1 === "zd")) || (key1 === "zp"))){
validate10.errors = [{instancePath:instancePath+"/cameraParams",schemaPath:"#/properties/cameraParams/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs4 === errors){
if(data0.fovy !== undefined){
var data1 = data0.fovy;
var _errs5 = errors;
if(!((typeof data1 == "number") && (isFinite(data1)))){
validate10.errors = [{instancePath:instancePath+"/cameraParams/fovy",schemaPath:"#/properties/cameraParams/properties/fovy/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid1 = _errs5 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data0.phi !== undefined){
var data2 = data0.phi;
var _errs7 = errors;
if(!((typeof data2 == "number") && (isFinite(data2)))){
validate10.errors = [{instancePath:instancePath+"/cameraParams/phi",schemaPath:"#/properties/cameraParams/properties/phi/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid1 = _errs7 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data0.roll !== undefined){
var data3 = data0.roll;
var _errs9 = errors;
if(!((typeof data3 == "number") && (isFinite(data3)))){
validate10.errors = [{instancePath:instancePath+"/cameraParams/roll",schemaPath:"#/properties/cameraParams/properties/roll/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid1 = _errs9 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data0.skyCoord !== undefined){
var data4 = data0.skyCoord;
var _errs11 = errors;
if(errors === _errs11){
if(data4 && typeof data4 == "object" && !Array.isArray(data4)){
var missing1;
if(((data4.dec === undefined) && (missing1 = "dec")) || ((data4.ra === undefined) && (missing1 = "ra"))){
validate10.errors = [{instancePath:instancePath+"/cameraParams/skyCoord",schemaPath:"#/properties/cameraParams/properties/skyCoord/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
var _errs13 = errors;
for(var key2 in data4){
if(!((key2 === "dec") || (key2 === "ra"))){
validate10.errors = [{instancePath:instancePath+"/cameraParams/skyCoord",schemaPath:"#/properties/cameraParams/properties/skyCoord/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs13 === errors){
if(data4.dec !== undefined){
var data5 = data4.dec;
var _errs14 = errors;
if(!((typeof data5 == "number") && (isFinite(data5)))){
validate10.errors = [{instancePath:instancePath+"/cameraParams/skyCoord/dec",schemaPath:"#/properties/cameraParams/properties/skyCoord/properties/dec/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid2 = _errs14 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data4.ra !== undefined){
var data6 = data4.ra;
var _errs16 = errors;
if(!((typeof data6 == "number") && (isFinite(data6)))){
validate10.errors = [{instancePath:instancePath+"/cameraParams/skyCoord/ra",schemaPath:"#/properties/cameraParams/properties/skyCoord/properties/ra/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid2 = _errs16 === errors;
}
else {
var valid2 = true;
}
}
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/cameraParams/skyCoord",schemaPath:"#/properties/cameraParams/properties/skyCoord/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid1 = _errs11 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data0.theta !== undefined){
var data7 = data0.theta;
var _errs18 = errors;
if(!((typeof data7 == "number") && (isFinite(data7)))){
validate10.errors = [{instancePath:instancePath+"/cameraParams/theta",schemaPath:"#/properties/cameraParams/properties/theta/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid1 = _errs18 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data0.za !== undefined){
var data8 = data0.za;
var _errs20 = errors;
if(!((typeof data8 == "number") && (isFinite(data8)))){
validate10.errors = [{instancePath:instancePath+"/cameraParams/za",schemaPath:"#/properties/cameraParams/properties/za/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid1 = _errs20 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data0.zd !== undefined){
var data9 = data0.zd;
var _errs22 = errors;
if(!((typeof data9 == "number") && (isFinite(data9)))){
validate10.errors = [{instancePath:instancePath+"/cameraParams/zd",schemaPath:"#/properties/cameraParams/properties/zd/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid1 = _errs22 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data0.zp !== undefined){
var data10 = data0.zp;
var _errs24 = errors;
if(!((typeof data10 == "number") && (isFinite(data10)))){
validate10.errors = [{instancePath:instancePath+"/cameraParams/zp",schemaPath:"#/properties/cameraParams/properties/zp/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid1 = _errs24 === errors;
}
else {
var valid1 = true;
}
}
}
}
}
}
}
}
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/cameraParams",schemaPath:"#/properties/cameraParams/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.datasets !== undefined){
var data11 = data.datasets;
var _errs26 = errors;
if(errors === _errs26){
if(Array.isArray(data11)){
var valid3 = true;
var len0 = data11.length;
for(var i0=0; i0<len0; i0++){
var _errs28 = errors;
if(typeof data11[i0] !== "string"){
validate10.errors = [{instancePath:instancePath+"/datasets/" + i0,schemaPath:"#/properties/datasets/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid3 = _errs28 === errors;
if(!valid3){
break;
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/datasets",schemaPath:"#/properties/datasets/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs26 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.tractTileLayerColorParams !== undefined){
var data13 = data.tractTileLayerColorParams;
var _errs30 = errors;
var _errs31 = errors;
var valid4 = false;
var _errs32 = errors;
if(errors === _errs32){
if(data13 && typeof data13 == "object" && !Array.isArray(data13)){
var missing2;
if((((data13.filters === undefined) && (missing2 = "filters")) || ((data13.simpleRgb === undefined) && (missing2 = "simpleRgb"))) || ((data13.type === undefined) && (missing2 = "type"))){
var err0 = {instancePath:instancePath+"/tractTileLayerColorParams",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/0/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
else {
var _errs34 = errors;
for(var key3 in data13){
if(!(((key3 === "filters") || (key3 === "simpleRgb")) || (key3 === "type"))){
var err1 = {instancePath:instancePath+"/tractTileLayerColorParams",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/0/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
break;
}
}
if(_errs34 === errors){
if(data13.filters !== undefined){
var data14 = data13.filters;
var _errs35 = errors;
if(errors === _errs35){
if(Array.isArray(data14)){
var valid6 = true;
var len1 = data14.length;
for(var i1=0; i1<len1; i1++){
var _errs37 = errors;
if(typeof data14[i1] !== "string"){
var err2 = {instancePath:instancePath+"/tractTileLayerColorParams/filters/" + i1,schemaPath:"#/properties/tractTileLayerColorParams/anyOf/0/properties/filters/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
var valid6 = _errs37 === errors;
if(!valid6){
break;
}
}
}
else {
var err3 = {instancePath:instancePath+"/tractTileLayerColorParams/filters",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/0/properties/filters/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
var valid5 = _errs35 === errors;
}
else {
var valid5 = true;
}
if(valid5){
if(data13.simpleRgb !== undefined){
var data16 = data13.simpleRgb;
var _errs39 = errors;
if(errors === _errs39){
if(data16 && typeof data16 == "object" && !Array.isArray(data16)){
var missing3;
if(((((data16.a === undefined) && (missing3 = "a")) || ((data16.b0 === undefined) && (missing3 = "b0"))) || ((data16.beta === undefined) && (missing3 = "beta"))) || ((data16.bias === undefined) && (missing3 = "bias"))){
var err4 = {instancePath:instancePath+"/tractTileLayerColorParams/simpleRgb",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/0/properties/simpleRgb/required",keyword:"required",params:{missingProperty: missing3},message:"must have required property '"+missing3+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
else {
var _errs41 = errors;
for(var key4 in data16){
if(!((((key4 === "a") || (key4 === "b0")) || (key4 === "beta")) || (key4 === "bias"))){
var err5 = {instancePath:instancePath+"/tractTileLayerColorParams/simpleRgb",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/0/properties/simpleRgb/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
break;
}
}
if(_errs41 === errors){
if(data16.a !== undefined){
var data17 = data16.a;
var _errs42 = errors;
if(!((typeof data17 == "number") && (isFinite(data17)))){
var err6 = {instancePath:instancePath+"/tractTileLayerColorParams/simpleRgb/a",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/0/properties/simpleRgb/properties/a/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
var valid7 = _errs42 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data16.b0 !== undefined){
var data18 = data16.b0;
var _errs44 = errors;
if(!((typeof data18 == "number") && (isFinite(data18)))){
var err7 = {instancePath:instancePath+"/tractTileLayerColorParams/simpleRgb/b0",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/0/properties/simpleRgb/properties/b0/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
var valid7 = _errs44 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data16.beta !== undefined){
var data19 = data16.beta;
var _errs46 = errors;
if(!((typeof data19 == "number") && (isFinite(data19)))){
var err8 = {instancePath:instancePath+"/tractTileLayerColorParams/simpleRgb/beta",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/0/properties/simpleRgb/properties/beta/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
var valid7 = _errs46 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data16.bias !== undefined){
var data20 = data16.bias;
var _errs48 = errors;
if(!((typeof data20 == "number") && (isFinite(data20)))){
var err9 = {instancePath:instancePath+"/tractTileLayerColorParams/simpleRgb/bias",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/0/properties/simpleRgb/properties/bias/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
var valid7 = _errs48 === errors;
}
else {
var valid7 = true;
}
}
}
}
}
}
}
else {
var err10 = {instancePath:instancePath+"/tractTileLayerColorParams/simpleRgb",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/0/properties/simpleRgb/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
var valid5 = _errs39 === errors;
}
else {
var valid5 = true;
}
if(valid5){
if(data13.type !== undefined){
var data21 = data13.type;
var _errs50 = errors;
if(typeof data21 !== "string"){
var err11 = {instancePath:instancePath+"/tractTileLayerColorParams/type",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/0/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if("simpleRgb" !== data21){
var err12 = {instancePath:instancePath+"/tractTileLayerColorParams/type",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/0/properties/type/const",keyword:"const",params:{allowedValue: "simpleRgb"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
var valid5 = _errs50 === errors;
}
else {
var valid5 = true;
}
}
}
}
}
}
else {
var err13 = {instancePath:instancePath+"/tractTileLayerColorParams",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
var _valid0 = _errs32 === errors;
valid4 = valid4 || _valid0;
if(!valid4){
var _errs52 = errors;
if(errors === _errs52){
if(data13 && typeof data13 == "object" && !Array.isArray(data13)){
var missing4;
if((((data13.filters === undefined) && (missing4 = "filters")) || ((data13.simpleColorMatrix === undefined) && (missing4 = "simpleColorMatrix"))) || ((data13.type === undefined) && (missing4 = "type"))){
var err14 = {instancePath:instancePath+"/tractTileLayerColorParams",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/1/required",keyword:"required",params:{missingProperty: missing4},message:"must have required property '"+missing4+"'"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
else {
var _errs54 = errors;
for(var key5 in data13){
if(!(((key5 === "filters") || (key5 === "simpleColorMatrix")) || (key5 === "type"))){
var err15 = {instancePath:instancePath+"/tractTileLayerColorParams",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/1/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
break;
}
}
if(_errs54 === errors){
if(data13.filters !== undefined){
var data22 = data13.filters;
var _errs55 = errors;
if(errors === _errs55){
if(Array.isArray(data22)){
var valid9 = true;
var len2 = data22.length;
for(var i2=0; i2<len2; i2++){
var _errs57 = errors;
if(typeof data22[i2] !== "string"){
var err16 = {instancePath:instancePath+"/tractTileLayerColorParams/filters/" + i2,schemaPath:"#/properties/tractTileLayerColorParams/anyOf/1/properties/filters/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
var valid9 = _errs57 === errors;
if(!valid9){
break;
}
}
}
else {
var err17 = {instancePath:instancePath+"/tractTileLayerColorParams/filters",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/1/properties/filters/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
var valid8 = _errs55 === errors;
}
else {
var valid8 = true;
}
if(valid8){
if(data13.simpleColorMatrix !== undefined){
var data24 = data13.simpleColorMatrix;
var _errs59 = errors;
if(errors === _errs59){
if(data24 && typeof data24 == "object" && !Array.isArray(data24)){
var missing5;
if((((((data24.a === undefined) && (missing5 = "a")) || ((data24.b0 === undefined) && (missing5 = "b0"))) || ((data24.beta === undefined) && (missing5 = "beta"))) || ((data24.bias === undefined) && (missing5 = "bias"))) || ((data24.colors === undefined) && (missing5 = "colors"))){
var err18 = {instancePath:instancePath+"/tractTileLayerColorParams/simpleColorMatrix",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/1/properties/simpleColorMatrix/required",keyword:"required",params:{missingProperty: missing5},message:"must have required property '"+missing5+"'"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
else {
var _errs61 = errors;
for(var key6 in data24){
if(!(((((key6 === "a") || (key6 === "b0")) || (key6 === "beta")) || (key6 === "bias")) || (key6 === "colors"))){
var err19 = {instancePath:instancePath+"/tractTileLayerColorParams/simpleColorMatrix",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/1/properties/simpleColorMatrix/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key6},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
break;
}
}
if(_errs61 === errors){
if(data24.a !== undefined){
var data25 = data24.a;
var _errs62 = errors;
if(!((typeof data25 == "number") && (isFinite(data25)))){
var err20 = {instancePath:instancePath+"/tractTileLayerColorParams/simpleColorMatrix/a",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/1/properties/simpleColorMatrix/properties/a/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
var valid10 = _errs62 === errors;
}
else {
var valid10 = true;
}
if(valid10){
if(data24.b0 !== undefined){
var data26 = data24.b0;
var _errs64 = errors;
if(!((typeof data26 == "number") && (isFinite(data26)))){
var err21 = {instancePath:instancePath+"/tractTileLayerColorParams/simpleColorMatrix/b0",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/1/properties/simpleColorMatrix/properties/b0/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
var valid10 = _errs64 === errors;
}
else {
var valid10 = true;
}
if(valid10){
if(data24.beta !== undefined){
var data27 = data24.beta;
var _errs66 = errors;
if(!((typeof data27 == "number") && (isFinite(data27)))){
var err22 = {instancePath:instancePath+"/tractTileLayerColorParams/simpleColorMatrix/beta",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/1/properties/simpleColorMatrix/properties/beta/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
var valid10 = _errs66 === errors;
}
else {
var valid10 = true;
}
if(valid10){
if(data24.bias !== undefined){
var data28 = data24.bias;
var _errs68 = errors;
if(!((typeof data28 == "number") && (isFinite(data28)))){
var err23 = {instancePath:instancePath+"/tractTileLayerColorParams/simpleColorMatrix/bias",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/1/properties/simpleColorMatrix/properties/bias/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
var valid10 = _errs68 === errors;
}
else {
var valid10 = true;
}
if(valid10){
if(data24.colors !== undefined){
var data29 = data24.colors;
var _errs70 = errors;
if(errors === _errs70){
if(Array.isArray(data29)){
var valid11 = true;
var len3 = data29.length;
for(var i3=0; i3<len3; i3++){
var data30 = data29[i3];
var _errs72 = errors;
if(errors === _errs72){
if(Array.isArray(data30)){
if(data30.length > 3){
var err24 = {instancePath:instancePath+"/tractTileLayerColorParams/simpleColorMatrix/colors/" + i3,schemaPath:"#/properties/tractTileLayerColorParams/anyOf/1/properties/simpleColorMatrix/properties/colors/items/maxItems",keyword:"maxItems",params:{limit: 3},message:"must NOT have more than 3 items"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
else {
if(data30.length < 3){
var err25 = {instancePath:instancePath+"/tractTileLayerColorParams/simpleColorMatrix/colors/" + i3,schemaPath:"#/properties/tractTileLayerColorParams/anyOf/1/properties/simpleColorMatrix/properties/colors/items/minItems",keyword:"minItems",params:{limit: 3},message:"must NOT have fewer than 3 items"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
else {
var len4 = data30.length;
if(len4 > 0){
var data31 = data30[0];
var _errs74 = errors;
if(!((typeof data31 == "number") && (isFinite(data31)))){
var err26 = {instancePath:instancePath+"/tractTileLayerColorParams/simpleColorMatrix/colors/" + i3+"/0",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/1/properties/simpleColorMatrix/properties/colors/items/items/0/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
var valid12 = _errs74 === errors;
}
if(valid12){
if(len4 > 1){
var data32 = data30[1];
var _errs76 = errors;
if(!((typeof data32 == "number") && (isFinite(data32)))){
var err27 = {instancePath:instancePath+"/tractTileLayerColorParams/simpleColorMatrix/colors/" + i3+"/1",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/1/properties/simpleColorMatrix/properties/colors/items/items/1/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
var valid12 = _errs76 === errors;
}
if(valid12){
if(len4 > 2){
var data33 = data30[2];
var _errs78 = errors;
if(!((typeof data33 == "number") && (isFinite(data33)))){
var err28 = {instancePath:instancePath+"/tractTileLayerColorParams/simpleColorMatrix/colors/" + i3+"/2",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/1/properties/simpleColorMatrix/properties/colors/items/items/2/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
var valid12 = _errs78 === errors;
}
}
}
}
}
}
else {
var err29 = {instancePath:instancePath+"/tractTileLayerColorParams/simpleColorMatrix/colors/" + i3,schemaPath:"#/properties/tractTileLayerColorParams/anyOf/1/properties/simpleColorMatrix/properties/colors/items/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
var valid11 = _errs72 === errors;
if(!valid11){
break;
}
}
}
else {
var err30 = {instancePath:instancePath+"/tractTileLayerColorParams/simpleColorMatrix/colors",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/1/properties/simpleColorMatrix/properties/colors/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
var valid10 = _errs70 === errors;
}
else {
var valid10 = true;
}
}
}
}
}
}
}
}
else {
var err31 = {instancePath:instancePath+"/tractTileLayerColorParams/simpleColorMatrix",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/1/properties/simpleColorMatrix/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
var valid8 = _errs59 === errors;
}
else {
var valid8 = true;
}
if(valid8){
if(data13.type !== undefined){
var data34 = data13.type;
var _errs80 = errors;
if(typeof data34 !== "string"){
var err32 = {instancePath:instancePath+"/tractTileLayerColorParams/type",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/1/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
if("simpleColorMatrix" !== data34){
var err33 = {instancePath:instancePath+"/tractTileLayerColorParams/type",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/1/properties/type/const",keyword:"const",params:{allowedValue: "simpleColorMatrix"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
var valid8 = _errs80 === errors;
}
else {
var valid8 = true;
}
}
}
}
}
}
else {
var err34 = {instancePath:instancePath+"/tractTileLayerColorParams",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
}
var _valid0 = _errs52 === errors;
valid4 = valid4 || _valid0;
if(!valid4){
var _errs82 = errors;
if(errors === _errs82){
if(data13 && typeof data13 == "object" && !Array.isArray(data13)){
var missing6;
if((((data13.filters === undefined) && (missing6 = "filters")) || ((data13.sdssTrueColor === undefined) && (missing6 = "sdssTrueColor"))) || ((data13.type === undefined) && (missing6 = "type"))){
var err35 = {instancePath:instancePath+"/tractTileLayerColorParams",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/2/required",keyword:"required",params:{missingProperty: missing6},message:"must have required property '"+missing6+"'"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
else {
var _errs84 = errors;
for(var key7 in data13){
if(!(((key7 === "filters") || (key7 === "sdssTrueColor")) || (key7 === "type"))){
var err36 = {instancePath:instancePath+"/tractTileLayerColorParams",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/2/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key7},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
break;
}
}
if(_errs84 === errors){
if(data13.filters !== undefined){
var data35 = data13.filters;
var _errs85 = errors;
if(errors === _errs85){
if(Array.isArray(data35)){
var valid14 = true;
var len5 = data35.length;
for(var i4=0; i4<len5; i4++){
var _errs87 = errors;
if(typeof data35[i4] !== "string"){
var err37 = {instancePath:instancePath+"/tractTileLayerColorParams/filters/" + i4,schemaPath:"#/properties/tractTileLayerColorParams/anyOf/2/properties/filters/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
var valid14 = _errs87 === errors;
if(!valid14){
break;
}
}
}
else {
var err38 = {instancePath:instancePath+"/tractTileLayerColorParams/filters",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/2/properties/filters/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
}
var valid13 = _errs85 === errors;
}
else {
var valid13 = true;
}
if(valid13){
if(data13.sdssTrueColor !== undefined){
var data37 = data13.sdssTrueColor;
var _errs89 = errors;
if(errors === _errs89){
if(data37 && typeof data37 == "object" && !Array.isArray(data37)){
var missing7;
if(((((data37.a === undefined) && (missing7 = "a")) || ((data37.b0 === undefined) && (missing7 = "b0"))) || ((data37.beta === undefined) && (missing7 = "beta"))) || ((data37.bias === undefined) && (missing7 = "bias"))){
var err39 = {instancePath:instancePath+"/tractTileLayerColorParams/sdssTrueColor",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/2/properties/sdssTrueColor/required",keyword:"required",params:{missingProperty: missing7},message:"must have required property '"+missing7+"'"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
else {
var _errs91 = errors;
for(var key8 in data37){
if(!((((key8 === "a") || (key8 === "b0")) || (key8 === "beta")) || (key8 === "bias"))){
var err40 = {instancePath:instancePath+"/tractTileLayerColorParams/sdssTrueColor",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/2/properties/sdssTrueColor/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key8},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
break;
}
}
if(_errs91 === errors){
if(data37.a !== undefined){
var data38 = data37.a;
var _errs92 = errors;
if(!((typeof data38 == "number") && (isFinite(data38)))){
var err41 = {instancePath:instancePath+"/tractTileLayerColorParams/sdssTrueColor/a",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/2/properties/sdssTrueColor/properties/a/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
var valid15 = _errs92 === errors;
}
else {
var valid15 = true;
}
if(valid15){
if(data37.b0 !== undefined){
var data39 = data37.b0;
var _errs94 = errors;
if(!((typeof data39 == "number") && (isFinite(data39)))){
var err42 = {instancePath:instancePath+"/tractTileLayerColorParams/sdssTrueColor/b0",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/2/properties/sdssTrueColor/properties/b0/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
var valid15 = _errs94 === errors;
}
else {
var valid15 = true;
}
if(valid15){
if(data37.beta !== undefined){
var data40 = data37.beta;
var _errs96 = errors;
if(!((typeof data40 == "number") && (isFinite(data40)))){
var err43 = {instancePath:instancePath+"/tractTileLayerColorParams/sdssTrueColor/beta",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/2/properties/sdssTrueColor/properties/beta/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
var valid15 = _errs96 === errors;
}
else {
var valid15 = true;
}
if(valid15){
if(data37.bias !== undefined){
var data41 = data37.bias;
var _errs98 = errors;
if(!((typeof data41 == "number") && (isFinite(data41)))){
var err44 = {instancePath:instancePath+"/tractTileLayerColorParams/sdssTrueColor/bias",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/2/properties/sdssTrueColor/properties/bias/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
var valid15 = _errs98 === errors;
}
else {
var valid15 = true;
}
}
}
}
}
}
}
else {
var err45 = {instancePath:instancePath+"/tractTileLayerColorParams/sdssTrueColor",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/2/properties/sdssTrueColor/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
}
var valid13 = _errs89 === errors;
}
else {
var valid13 = true;
}
if(valid13){
if(data13.type !== undefined){
var data42 = data13.type;
var _errs100 = errors;
if(typeof data42 !== "string"){
var err46 = {instancePath:instancePath+"/tractTileLayerColorParams/type",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/2/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
if("sdssTrueColor" !== data42){
var err47 = {instancePath:instancePath+"/tractTileLayerColorParams/type",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/2/properties/type/const",keyword:"const",params:{allowedValue: "sdssTrueColor"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
var valid13 = _errs100 === errors;
}
else {
var valid13 = true;
}
}
}
}
}
}
else {
var err48 = {instancePath:instancePath+"/tractTileLayerColorParams",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/2/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
}
var _valid0 = _errs82 === errors;
valid4 = valid4 || _valid0;
if(!valid4){
var _errs102 = errors;
if(errors === _errs102){
if(data13 && typeof data13 == "object" && !Array.isArray(data13)){
var missing8;
if((((data13.filters === undefined) && (missing8 = "filters")) || ((data13.sdssTrueColorMatrix === undefined) && (missing8 = "sdssTrueColorMatrix"))) || ((data13.type === undefined) && (missing8 = "type"))){
var err49 = {instancePath:instancePath+"/tractTileLayerColorParams",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/3/required",keyword:"required",params:{missingProperty: missing8},message:"must have required property '"+missing8+"'"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
else {
var _errs104 = errors;
for(var key9 in data13){
if(!(((key9 === "filters") || (key9 === "sdssTrueColorMatrix")) || (key9 === "type"))){
var err50 = {instancePath:instancePath+"/tractTileLayerColorParams",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/3/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key9},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
break;
}
}
if(_errs104 === errors){
if(data13.filters !== undefined){
var data43 = data13.filters;
var _errs105 = errors;
if(errors === _errs105){
if(Array.isArray(data43)){
var valid17 = true;
var len6 = data43.length;
for(var i5=0; i5<len6; i5++){
var _errs107 = errors;
if(typeof data43[i5] !== "string"){
var err51 = {instancePath:instancePath+"/tractTileLayerColorParams/filters/" + i5,schemaPath:"#/properties/tractTileLayerColorParams/anyOf/3/properties/filters/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
var valid17 = _errs107 === errors;
if(!valid17){
break;
}
}
}
else {
var err52 = {instancePath:instancePath+"/tractTileLayerColorParams/filters",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/3/properties/filters/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
}
var valid16 = _errs105 === errors;
}
else {
var valid16 = true;
}
if(valid16){
if(data13.sdssTrueColorMatrix !== undefined){
var data45 = data13.sdssTrueColorMatrix;
var _errs109 = errors;
if(errors === _errs109){
if(data45 && typeof data45 == "object" && !Array.isArray(data45)){
var missing9;
if((((((data45.a === undefined) && (missing9 = "a")) || ((data45.b0 === undefined) && (missing9 = "b0"))) || ((data45.beta === undefined) && (missing9 = "beta"))) || ((data45.bias === undefined) && (missing9 = "bias"))) || ((data45.colors === undefined) && (missing9 = "colors"))){
var err53 = {instancePath:instancePath+"/tractTileLayerColorParams/sdssTrueColorMatrix",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/3/properties/sdssTrueColorMatrix/required",keyword:"required",params:{missingProperty: missing9},message:"must have required property '"+missing9+"'"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
else {
var _errs111 = errors;
for(var key10 in data45){
if(!(((((key10 === "a") || (key10 === "b0")) || (key10 === "beta")) || (key10 === "bias")) || (key10 === "colors"))){
var err54 = {instancePath:instancePath+"/tractTileLayerColorParams/sdssTrueColorMatrix",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/3/properties/sdssTrueColorMatrix/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key10},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
break;
}
}
if(_errs111 === errors){
if(data45.a !== undefined){
var data46 = data45.a;
var _errs112 = errors;
if(!((typeof data46 == "number") && (isFinite(data46)))){
var err55 = {instancePath:instancePath+"/tractTileLayerColorParams/sdssTrueColorMatrix/a",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/3/properties/sdssTrueColorMatrix/properties/a/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
var valid18 = _errs112 === errors;
}
else {
var valid18 = true;
}
if(valid18){
if(data45.b0 !== undefined){
var data47 = data45.b0;
var _errs114 = errors;
if(!((typeof data47 == "number") && (isFinite(data47)))){
var err56 = {instancePath:instancePath+"/tractTileLayerColorParams/sdssTrueColorMatrix/b0",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/3/properties/sdssTrueColorMatrix/properties/b0/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
var valid18 = _errs114 === errors;
}
else {
var valid18 = true;
}
if(valid18){
if(data45.beta !== undefined){
var data48 = data45.beta;
var _errs116 = errors;
if(!((typeof data48 == "number") && (isFinite(data48)))){
var err57 = {instancePath:instancePath+"/tractTileLayerColorParams/sdssTrueColorMatrix/beta",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/3/properties/sdssTrueColorMatrix/properties/beta/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
var valid18 = _errs116 === errors;
}
else {
var valid18 = true;
}
if(valid18){
if(data45.bias !== undefined){
var data49 = data45.bias;
var _errs118 = errors;
if(!((typeof data49 == "number") && (isFinite(data49)))){
var err58 = {instancePath:instancePath+"/tractTileLayerColorParams/sdssTrueColorMatrix/bias",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/3/properties/sdssTrueColorMatrix/properties/bias/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
var valid18 = _errs118 === errors;
}
else {
var valid18 = true;
}
if(valid18){
if(data45.colors !== undefined){
var data50 = data45.colors;
var _errs120 = errors;
if(errors === _errs120){
if(Array.isArray(data50)){
var valid19 = true;
var len7 = data50.length;
for(var i6=0; i6<len7; i6++){
var data51 = data50[i6];
var _errs122 = errors;
if(errors === _errs122){
if(Array.isArray(data51)){
if(data51.length > 3){
var err59 = {instancePath:instancePath+"/tractTileLayerColorParams/sdssTrueColorMatrix/colors/" + i6,schemaPath:"#/properties/tractTileLayerColorParams/anyOf/3/properties/sdssTrueColorMatrix/properties/colors/items/maxItems",keyword:"maxItems",params:{limit: 3},message:"must NOT have more than 3 items"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
else {
if(data51.length < 3){
var err60 = {instancePath:instancePath+"/tractTileLayerColorParams/sdssTrueColorMatrix/colors/" + i6,schemaPath:"#/properties/tractTileLayerColorParams/anyOf/3/properties/sdssTrueColorMatrix/properties/colors/items/minItems",keyword:"minItems",params:{limit: 3},message:"must NOT have fewer than 3 items"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
else {
var len8 = data51.length;
if(len8 > 0){
var data52 = data51[0];
var _errs124 = errors;
if(!((typeof data52 == "number") && (isFinite(data52)))){
var err61 = {instancePath:instancePath+"/tractTileLayerColorParams/sdssTrueColorMatrix/colors/" + i6+"/0",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/3/properties/sdssTrueColorMatrix/properties/colors/items/items/0/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
var valid20 = _errs124 === errors;
}
if(valid20){
if(len8 > 1){
var data53 = data51[1];
var _errs126 = errors;
if(!((typeof data53 == "number") && (isFinite(data53)))){
var err62 = {instancePath:instancePath+"/tractTileLayerColorParams/sdssTrueColorMatrix/colors/" + i6+"/1",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/3/properties/sdssTrueColorMatrix/properties/colors/items/items/1/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
var valid20 = _errs126 === errors;
}
if(valid20){
if(len8 > 2){
var data54 = data51[2];
var _errs128 = errors;
if(!((typeof data54 == "number") && (isFinite(data54)))){
var err63 = {instancePath:instancePath+"/tractTileLayerColorParams/sdssTrueColorMatrix/colors/" + i6+"/2",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/3/properties/sdssTrueColorMatrix/properties/colors/items/items/2/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
var valid20 = _errs128 === errors;
}
}
}
}
}
}
else {
var err64 = {instancePath:instancePath+"/tractTileLayerColorParams/sdssTrueColorMatrix/colors/" + i6,schemaPath:"#/properties/tractTileLayerColorParams/anyOf/3/properties/sdssTrueColorMatrix/properties/colors/items/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
}
var valid19 = _errs122 === errors;
if(!valid19){
break;
}
}
}
else {
var err65 = {instancePath:instancePath+"/tractTileLayerColorParams/sdssTrueColorMatrix/colors",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/3/properties/sdssTrueColorMatrix/properties/colors/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
}
var valid18 = _errs120 === errors;
}
else {
var valid18 = true;
}
}
}
}
}
}
}
}
else {
var err66 = {instancePath:instancePath+"/tractTileLayerColorParams/sdssTrueColorMatrix",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/3/properties/sdssTrueColorMatrix/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
}
var valid16 = _errs109 === errors;
}
else {
var valid16 = true;
}
if(valid16){
if(data13.type !== undefined){
var data55 = data13.type;
var _errs130 = errors;
if(typeof data55 !== "string"){
var err67 = {instancePath:instancePath+"/tractTileLayerColorParams/type",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/3/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err67];
}
else {
vErrors.push(err67);
}
errors++;
}
if("sdssTrueColorMatrix" !== data55){
var err68 = {instancePath:instancePath+"/tractTileLayerColorParams/type",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/3/properties/type/const",keyword:"const",params:{allowedValue: "sdssTrueColorMatrix"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
var valid16 = _errs130 === errors;
}
else {
var valid16 = true;
}
}
}
}
}
}
else {
var err69 = {instancePath:instancePath+"/tractTileLayerColorParams",schemaPath:"#/properties/tractTileLayerColorParams/anyOf/3/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err69];
}
else {
vErrors.push(err69);
}
errors++;
}
}
var _valid0 = _errs102 === errors;
valid4 = valid4 || _valid0;
}
}
}
if(!valid4){
var err70 = {instancePath:instancePath+"/tractTileLayerColorParams",schemaPath:"#/properties/tractTileLayerColorParams/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
validate10.errors = vErrors;
return false;
}
else {
errors = _errs31;
if(vErrors !== null){
if(_errs31){
vErrors.length = _errs31;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs30 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate10.errors = [{instancePath:instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate10.errors = vErrors;
return errors === 0;
}
