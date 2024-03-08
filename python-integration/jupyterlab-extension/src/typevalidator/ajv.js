"use strict";
export const Close = validate10;
var schema11 = {"$id":"Close","additionalProperties":false,"type":"object","properties":{"type":{"type":"string","const":"Close"}},"required":["type"],"definitions":{"AddValidatorName<{type:\"Close\";},\"Close\">":{"additionalProperties":false,"type":"object","properties":{"type":{"type":"string","const":"Close"}},"required":["type"]},"AddValidatorName<{action:{type:string;payload:any;};}&{type:\"Dispatch\";},\"Dispatch\">":{"additionalProperties":false,"type":"object","properties":{"action":{"type":"object","properties":{"type":{"type":"string"},"payload":{}},"additionalProperties":false,"required":["payload","type"]},"type":{"type":"string","const":"Dispatch"}},"required":["action","type"]},"AddValidatorName<{params:{title:string;body:string;};}&{type:\"ShowError\";},\"ShowError\">":{"additionalProperties":false,"type":"object","properties":{"params":{"type":"object","properties":{"title":{"type":"string"},"body":{"type":"string"}},"additionalProperties":false,"required":["body","title"]},"type":{"type":"string","const":"ShowError"}},"required":["params","type"]},"AddValidatorName<{level:\"log\"|\"debug\"|\"info\"|\"warn\";args:any[];}&{type:\"FrontendConsole\";},\"FrontendConsole\">":{"additionalProperties":false,"type":"object","properties":{"level":{"enum":["debug","info","log","warn"],"type":"string"},"args":{"type":"array","items":{}},"type":{"type":"string","const":"FrontendConsole"}},"required":["args","level","type"]},"AddValidatorName<{title:string;}&{type:\"UpdateWidgetState\";},\"UpdateWidgetState\">":{"additionalProperties":false,"type":"object","properties":{"title":{"type":"string"},"type":{"type":"string","const":"UpdateWidgetState"}},"required":["title","type"]},"AddValidatorName<{window_ids:string[];}&{type:\"LockFrame\";},\"LockFrame\">":{"additionalProperties":false,"type":"object","properties":{"window_ids":{"type":"array","items":{"type":"string"}},"type":{"type":"string","const":"LockFrame"}},"required":["type","window_ids"]},"AddValidatorName<{window_ids:string[];}&{type:\"UnlockFrame\";},\"UnlockFrame\">":{"additionalProperties":false,"type":"object","properties":{"window_ids":{"type":"array","items":{"type":"string"}},"type":{"type":"string","const":"UnlockFrame"}},"required":["type","window_ids"]},"AddValidatorName<{queryId:string;}&{type:\"QueryState\";},\"QueryState\">":{"additionalProperties":false,"type":"object","properties":{"queryId":{"type":"string"},"type":{"type":"string","const":"QueryState"}},"required":["queryId","type"]},"AddValidatorName<{queryId:string;aspectRatio?:number|undefined;}&{type:\"QuerySnapshot\";},\"QuerySnapshot\">":{"additionalProperties":false,"type":"object","properties":{"queryId":{"type":"string"},"aspectRatio":{"type":"number"},"type":{"type":"string","const":"QuerySnapshot"}},"required":["queryId","type"]},"AddValidatorName<{ra:number;dec:number;fov?:number|undefined;duration:number;easingFunction?:\"linear\"|\"slowStart2\"|\"fastStart2\"|\"slowStart4\"|\"fastStart4\"|\"slowStartStop2\"|\"slowStartStop4\"|undefined;}&{type:\"JumpTo\";},\"JumpTo\">":{"additionalProperties":false,"type":"object","properties":{"ra":{"type":"number"},"dec":{"type":"number"},"fov":{"type":"number"},"duration":{"type":"number"},"easingFunction":{"enum":["fastStart2","fastStart4","linear","slowStart2","slowStart4","slowStartStop2","slowStartStop4"],"type":"string"},"type":{"type":"string","const":"JumpTo"}},"required":["dec","duration","ra","type"]},"AddValidatorName<StellarGlobeWidgetParams,\"StellarGlobeWidgetParams\">":{"additionalProperties":false,"type":"object","properties":{"id":{"type":"string"},"title":{"type":"string"},"layout":{"enum":["merge-bottom","merge-left","merge-right","merge-top","split-bottom","split-left","split-right","tab-after","tab-before"],"type":"string"},"initialState":{},"queryId":{"type":"string"}},"required":["id","queryId"]}}};

function validate10(data, valCxt){
"use strict"; /*# sourceURL="Close" */;
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
var missing0;
if((data.type === undefined) && (missing0 = "type")){
validate10.errors = [{instancePath:instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
var _errs1 = errors;
for(var key0 in data){
if(!(key0 === "type")){
validate10.errors = [{instancePath:instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.type !== undefined){
var data0 = data.type;
if(typeof data0 !== "string"){
validate10.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("Close" !== data0){
validate10.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "Close"},message:"must be equal to constant"}];
return false;
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

export const Dispatch = validate11;
var schema12 = {"$id":"Dispatch","additionalProperties":false,"type":"object","properties":{"action":{"type":"object","properties":{"type":{"type":"string"},"payload":{}},"additionalProperties":false,"required":["payload","type"]},"type":{"type":"string","const":"Dispatch"}},"required":["action","type"],"definitions":{"AddValidatorName<{type:\"Close\";},\"Close\">":{"additionalProperties":false,"type":"object","properties":{"type":{"type":"string","const":"Close"}},"required":["type"]},"AddValidatorName<{action:{type:string;payload:any;};}&{type:\"Dispatch\";},\"Dispatch\">":{"additionalProperties":false,"type":"object","properties":{"action":{"type":"object","properties":{"type":{"type":"string"},"payload":{}},"additionalProperties":false,"required":["payload","type"]},"type":{"type":"string","const":"Dispatch"}},"required":["action","type"]},"AddValidatorName<{params:{title:string;body:string;};}&{type:\"ShowError\";},\"ShowError\">":{"additionalProperties":false,"type":"object","properties":{"params":{"type":"object","properties":{"title":{"type":"string"},"body":{"type":"string"}},"additionalProperties":false,"required":["body","title"]},"type":{"type":"string","const":"ShowError"}},"required":["params","type"]},"AddValidatorName<{level:\"log\"|\"debug\"|\"info\"|\"warn\";args:any[];}&{type:\"FrontendConsole\";},\"FrontendConsole\">":{"additionalProperties":false,"type":"object","properties":{"level":{"enum":["debug","info","log","warn"],"type":"string"},"args":{"type":"array","items":{}},"type":{"type":"string","const":"FrontendConsole"}},"required":["args","level","type"]},"AddValidatorName<{title:string;}&{type:\"UpdateWidgetState\";},\"UpdateWidgetState\">":{"additionalProperties":false,"type":"object","properties":{"title":{"type":"string"},"type":{"type":"string","const":"UpdateWidgetState"}},"required":["title","type"]},"AddValidatorName<{window_ids:string[];}&{type:\"LockFrame\";},\"LockFrame\">":{"additionalProperties":false,"type":"object","properties":{"window_ids":{"type":"array","items":{"type":"string"}},"type":{"type":"string","const":"LockFrame"}},"required":["type","window_ids"]},"AddValidatorName<{window_ids:string[];}&{type:\"UnlockFrame\";},\"UnlockFrame\">":{"additionalProperties":false,"type":"object","properties":{"window_ids":{"type":"array","items":{"type":"string"}},"type":{"type":"string","const":"UnlockFrame"}},"required":["type","window_ids"]},"AddValidatorName<{queryId:string;}&{type:\"QueryState\";},\"QueryState\">":{"additionalProperties":false,"type":"object","properties":{"queryId":{"type":"string"},"type":{"type":"string","const":"QueryState"}},"required":["queryId","type"]},"AddValidatorName<{queryId:string;aspectRatio?:number|undefined;}&{type:\"QuerySnapshot\";},\"QuerySnapshot\">":{"additionalProperties":false,"type":"object","properties":{"queryId":{"type":"string"},"aspectRatio":{"type":"number"},"type":{"type":"string","const":"QuerySnapshot"}},"required":["queryId","type"]},"AddValidatorName<{ra:number;dec:number;fov?:number|undefined;duration:number;easingFunction?:\"linear\"|\"slowStart2\"|\"fastStart2\"|\"slowStart4\"|\"fastStart4\"|\"slowStartStop2\"|\"slowStartStop4\"|undefined;}&{type:\"JumpTo\";},\"JumpTo\">":{"additionalProperties":false,"type":"object","properties":{"ra":{"type":"number"},"dec":{"type":"number"},"fov":{"type":"number"},"duration":{"type":"number"},"easingFunction":{"enum":["fastStart2","fastStart4","linear","slowStart2","slowStart4","slowStartStop2","slowStartStop4"],"type":"string"},"type":{"type":"string","const":"JumpTo"}},"required":["dec","duration","ra","type"]},"AddValidatorName<StellarGlobeWidgetParams,\"StellarGlobeWidgetParams\">":{"additionalProperties":false,"type":"object","properties":{"id":{"type":"string"},"title":{"type":"string"},"layout":{"enum":["merge-bottom","merge-left","merge-right","merge-top","split-bottom","split-left","split-right","tab-after","tab-before"],"type":"string"},"initialState":{},"queryId":{"type":"string"}},"required":["id","queryId"]}}};

function validate11(data, valCxt){
"use strict"; /*# sourceURL="Dispatch" */;
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
var missing0;
if(((data.action === undefined) && (missing0 = "action")) || ((data.type === undefined) && (missing0 = "type"))){
validate11.errors = [{instancePath:instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
var _errs1 = errors;
for(var key0 in data){
if(!((key0 === "action") || (key0 === "type"))){
validate11.errors = [{instancePath:instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.action !== undefined){
var data0 = data.action;
var _errs2 = errors;
if(errors === _errs2){
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
var missing1;
if(((data0.payload === undefined) && (missing1 = "payload")) || ((data0.type === undefined) && (missing1 = "type"))){
validate11.errors = [{instancePath:instancePath+"/action",schemaPath:"#/properties/action/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
var _errs4 = errors;
for(var key1 in data0){
if(!((key1 === "type") || (key1 === "payload"))){
validate11.errors = [{instancePath:instancePath+"/action",schemaPath:"#/properties/action/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs4 === errors){
if(data0.type !== undefined){
if(typeof data0.type !== "string"){
validate11.errors = [{instancePath:instancePath+"/action/type",schemaPath:"#/properties/action/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
}
}
else {
validate11.errors = [{instancePath:instancePath+"/action",schemaPath:"#/properties/action/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.type !== undefined){
var data2 = data.type;
var _errs7 = errors;
if(typeof data2 !== "string"){
validate11.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("Dispatch" !== data2){
validate11.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "Dispatch"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate11.errors = [{instancePath:instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate11.errors = vErrors;
return errors === 0;
}

export const ShowError = validate12;
var schema13 = {"$id":"ShowError","additionalProperties":false,"type":"object","properties":{"params":{"type":"object","properties":{"title":{"type":"string"},"body":{"type":"string"}},"additionalProperties":false,"required":["body","title"]},"type":{"type":"string","const":"ShowError"}},"required":["params","type"],"definitions":{"AddValidatorName<{type:\"Close\";},\"Close\">":{"additionalProperties":false,"type":"object","properties":{"type":{"type":"string","const":"Close"}},"required":["type"]},"AddValidatorName<{action:{type:string;payload:any;};}&{type:\"Dispatch\";},\"Dispatch\">":{"additionalProperties":false,"type":"object","properties":{"action":{"type":"object","properties":{"type":{"type":"string"},"payload":{}},"additionalProperties":false,"required":["payload","type"]},"type":{"type":"string","const":"Dispatch"}},"required":["action","type"]},"AddValidatorName<{params:{title:string;body:string;};}&{type:\"ShowError\";},\"ShowError\">":{"additionalProperties":false,"type":"object","properties":{"params":{"type":"object","properties":{"title":{"type":"string"},"body":{"type":"string"}},"additionalProperties":false,"required":["body","title"]},"type":{"type":"string","const":"ShowError"}},"required":["params","type"]},"AddValidatorName<{level:\"log\"|\"debug\"|\"info\"|\"warn\";args:any[];}&{type:\"FrontendConsole\";},\"FrontendConsole\">":{"additionalProperties":false,"type":"object","properties":{"level":{"enum":["debug","info","log","warn"],"type":"string"},"args":{"type":"array","items":{}},"type":{"type":"string","const":"FrontendConsole"}},"required":["args","level","type"]},"AddValidatorName<{title:string;}&{type:\"UpdateWidgetState\";},\"UpdateWidgetState\">":{"additionalProperties":false,"type":"object","properties":{"title":{"type":"string"},"type":{"type":"string","const":"UpdateWidgetState"}},"required":["title","type"]},"AddValidatorName<{window_ids:string[];}&{type:\"LockFrame\";},\"LockFrame\">":{"additionalProperties":false,"type":"object","properties":{"window_ids":{"type":"array","items":{"type":"string"}},"type":{"type":"string","const":"LockFrame"}},"required":["type","window_ids"]},"AddValidatorName<{window_ids:string[];}&{type:\"UnlockFrame\";},\"UnlockFrame\">":{"additionalProperties":false,"type":"object","properties":{"window_ids":{"type":"array","items":{"type":"string"}},"type":{"type":"string","const":"UnlockFrame"}},"required":["type","window_ids"]},"AddValidatorName<{queryId:string;}&{type:\"QueryState\";},\"QueryState\">":{"additionalProperties":false,"type":"object","properties":{"queryId":{"type":"string"},"type":{"type":"string","const":"QueryState"}},"required":["queryId","type"]},"AddValidatorName<{queryId:string;aspectRatio?:number|undefined;}&{type:\"QuerySnapshot\";},\"QuerySnapshot\">":{"additionalProperties":false,"type":"object","properties":{"queryId":{"type":"string"},"aspectRatio":{"type":"number"},"type":{"type":"string","const":"QuerySnapshot"}},"required":["queryId","type"]},"AddValidatorName<{ra:number;dec:number;fov?:number|undefined;duration:number;easingFunction?:\"linear\"|\"slowStart2\"|\"fastStart2\"|\"slowStart4\"|\"fastStart4\"|\"slowStartStop2\"|\"slowStartStop4\"|undefined;}&{type:\"JumpTo\";},\"JumpTo\">":{"additionalProperties":false,"type":"object","properties":{"ra":{"type":"number"},"dec":{"type":"number"},"fov":{"type":"number"},"duration":{"type":"number"},"easingFunction":{"enum":["fastStart2","fastStart4","linear","slowStart2","slowStart4","slowStartStop2","slowStartStop4"],"type":"string"},"type":{"type":"string","const":"JumpTo"}},"required":["dec","duration","ra","type"]},"AddValidatorName<StellarGlobeWidgetParams,\"StellarGlobeWidgetParams\">":{"additionalProperties":false,"type":"object","properties":{"id":{"type":"string"},"title":{"type":"string"},"layout":{"enum":["merge-bottom","merge-left","merge-right","merge-top","split-bottom","split-left","split-right","tab-after","tab-before"],"type":"string"},"initialState":{},"queryId":{"type":"string"}},"required":["id","queryId"]}}};

function validate12(data, valCxt){
"use strict"; /*# sourceURL="ShowError" */;
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
var missing0;
if(((data.params === undefined) && (missing0 = "params")) || ((data.type === undefined) && (missing0 = "type"))){
validate12.errors = [{instancePath:instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
var _errs1 = errors;
for(var key0 in data){
if(!((key0 === "params") || (key0 === "type"))){
validate12.errors = [{instancePath:instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.params !== undefined){
var data0 = data.params;
var _errs2 = errors;
if(errors === _errs2){
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
var missing1;
if(((data0.body === undefined) && (missing1 = "body")) || ((data0.title === undefined) && (missing1 = "title"))){
validate12.errors = [{instancePath:instancePath+"/params",schemaPath:"#/properties/params/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
var _errs4 = errors;
for(var key1 in data0){
if(!((key1 === "title") || (key1 === "body"))){
validate12.errors = [{instancePath:instancePath+"/params",schemaPath:"#/properties/params/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs4 === errors){
if(data0.title !== undefined){
var _errs5 = errors;
if(typeof data0.title !== "string"){
validate12.errors = [{instancePath:instancePath+"/params/title",schemaPath:"#/properties/params/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid1 = _errs5 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data0.body !== undefined){
var _errs7 = errors;
if(typeof data0.body !== "string"){
validate12.errors = [{instancePath:instancePath+"/params/body",schemaPath:"#/properties/params/properties/body/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid1 = _errs7 === errors;
}
else {
var valid1 = true;
}
}
}
}
}
else {
validate12.errors = [{instancePath:instancePath+"/params",schemaPath:"#/properties/params/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.type !== undefined){
var data3 = data.type;
var _errs9 = errors;
if(typeof data3 !== "string"){
validate12.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("ShowError" !== data3){
validate12.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "ShowError"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate12.errors = [{instancePath:instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate12.errors = vErrors;
return errors === 0;
}

export const FrontendConsole = validate13;
var schema14 = {"$id":"FrontendConsole","additionalProperties":false,"type":"object","properties":{"level":{"enum":["debug","info","log","warn"],"type":"string"},"args":{"type":"array","items":{}},"type":{"type":"string","const":"FrontendConsole"}},"required":["args","level","type"],"definitions":{"AddValidatorName<{type:\"Close\";},\"Close\">":{"additionalProperties":false,"type":"object","properties":{"type":{"type":"string","const":"Close"}},"required":["type"]},"AddValidatorName<{action:{type:string;payload:any;};}&{type:\"Dispatch\";},\"Dispatch\">":{"additionalProperties":false,"type":"object","properties":{"action":{"type":"object","properties":{"type":{"type":"string"},"payload":{}},"additionalProperties":false,"required":["payload","type"]},"type":{"type":"string","const":"Dispatch"}},"required":["action","type"]},"AddValidatorName<{params:{title:string;body:string;};}&{type:\"ShowError\";},\"ShowError\">":{"additionalProperties":false,"type":"object","properties":{"params":{"type":"object","properties":{"title":{"type":"string"},"body":{"type":"string"}},"additionalProperties":false,"required":["body","title"]},"type":{"type":"string","const":"ShowError"}},"required":["params","type"]},"AddValidatorName<{level:\"log\"|\"debug\"|\"info\"|\"warn\";args:any[];}&{type:\"FrontendConsole\";},\"FrontendConsole\">":{"additionalProperties":false,"type":"object","properties":{"level":{"enum":["debug","info","log","warn"],"type":"string"},"args":{"type":"array","items":{}},"type":{"type":"string","const":"FrontendConsole"}},"required":["args","level","type"]},"AddValidatorName<{title:string;}&{type:\"UpdateWidgetState\";},\"UpdateWidgetState\">":{"additionalProperties":false,"type":"object","properties":{"title":{"type":"string"},"type":{"type":"string","const":"UpdateWidgetState"}},"required":["title","type"]},"AddValidatorName<{window_ids:string[];}&{type:\"LockFrame\";},\"LockFrame\">":{"additionalProperties":false,"type":"object","properties":{"window_ids":{"type":"array","items":{"type":"string"}},"type":{"type":"string","const":"LockFrame"}},"required":["type","window_ids"]},"AddValidatorName<{window_ids:string[];}&{type:\"UnlockFrame\";},\"UnlockFrame\">":{"additionalProperties":false,"type":"object","properties":{"window_ids":{"type":"array","items":{"type":"string"}},"type":{"type":"string","const":"UnlockFrame"}},"required":["type","window_ids"]},"AddValidatorName<{queryId:string;}&{type:\"QueryState\";},\"QueryState\">":{"additionalProperties":false,"type":"object","properties":{"queryId":{"type":"string"},"type":{"type":"string","const":"QueryState"}},"required":["queryId","type"]},"AddValidatorName<{queryId:string;aspectRatio?:number|undefined;}&{type:\"QuerySnapshot\";},\"QuerySnapshot\">":{"additionalProperties":false,"type":"object","properties":{"queryId":{"type":"string"},"aspectRatio":{"type":"number"},"type":{"type":"string","const":"QuerySnapshot"}},"required":["queryId","type"]},"AddValidatorName<{ra:number;dec:number;fov?:number|undefined;duration:number;easingFunction?:\"linear\"|\"slowStart2\"|\"fastStart2\"|\"slowStart4\"|\"fastStart4\"|\"slowStartStop2\"|\"slowStartStop4\"|undefined;}&{type:\"JumpTo\";},\"JumpTo\">":{"additionalProperties":false,"type":"object","properties":{"ra":{"type":"number"},"dec":{"type":"number"},"fov":{"type":"number"},"duration":{"type":"number"},"easingFunction":{"enum":["fastStart2","fastStart4","linear","slowStart2","slowStart4","slowStartStop2","slowStartStop4"],"type":"string"},"type":{"type":"string","const":"JumpTo"}},"required":["dec","duration","ra","type"]},"AddValidatorName<StellarGlobeWidgetParams,\"StellarGlobeWidgetParams\">":{"additionalProperties":false,"type":"object","properties":{"id":{"type":"string"},"title":{"type":"string"},"layout":{"enum":["merge-bottom","merge-left","merge-right","merge-top","split-bottom","split-left","split-right","tab-after","tab-before"],"type":"string"},"initialState":{},"queryId":{"type":"string"}},"required":["id","queryId"]}}};

function validate13(data, valCxt){
"use strict"; /*# sourceURL="FrontendConsole" */;
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
var missing0;
if((((data.args === undefined) && (missing0 = "args")) || ((data.level === undefined) && (missing0 = "level"))) || ((data.type === undefined) && (missing0 = "type"))){
validate13.errors = [{instancePath:instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
var _errs1 = errors;
for(var key0 in data){
if(!(((key0 === "level") || (key0 === "args")) || (key0 === "type"))){
validate13.errors = [{instancePath:instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.level !== undefined){
var data0 = data.level;
var _errs2 = errors;
if(typeof data0 !== "string"){
validate13.errors = [{instancePath:instancePath+"/level",schemaPath:"#/properties/level/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!((((data0 === "debug") || (data0 === "info")) || (data0 === "log")) || (data0 === "warn"))){
validate13.errors = [{instancePath:instancePath+"/level",schemaPath:"#/properties/level/enum",keyword:"enum",params:{allowedValues: schema14.properties.level.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.args !== undefined){
var _errs4 = errors;
if(errors === _errs4){
if(!(Array.isArray(data.args))){
validate13.errors = [{instancePath:instancePath+"/args",schemaPath:"#/properties/args/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.type !== undefined){
var data2 = data.type;
var _errs6 = errors;
if(typeof data2 !== "string"){
validate13.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("FrontendConsole" !== data2){
validate13.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "FrontendConsole"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
else {
validate13.errors = [{instancePath:instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate13.errors = vErrors;
return errors === 0;
}

export const UpdateWidgetState = validate14;
var schema15 = {"$id":"UpdateWidgetState","additionalProperties":false,"type":"object","properties":{"title":{"type":"string"},"type":{"type":"string","const":"UpdateWidgetState"}},"required":["title","type"],"definitions":{"AddValidatorName<{type:\"Close\";},\"Close\">":{"additionalProperties":false,"type":"object","properties":{"type":{"type":"string","const":"Close"}},"required":["type"]},"AddValidatorName<{action:{type:string;payload:any;};}&{type:\"Dispatch\";},\"Dispatch\">":{"additionalProperties":false,"type":"object","properties":{"action":{"type":"object","properties":{"type":{"type":"string"},"payload":{}},"additionalProperties":false,"required":["payload","type"]},"type":{"type":"string","const":"Dispatch"}},"required":["action","type"]},"AddValidatorName<{params:{title:string;body:string;};}&{type:\"ShowError\";},\"ShowError\">":{"additionalProperties":false,"type":"object","properties":{"params":{"type":"object","properties":{"title":{"type":"string"},"body":{"type":"string"}},"additionalProperties":false,"required":["body","title"]},"type":{"type":"string","const":"ShowError"}},"required":["params","type"]},"AddValidatorName<{level:\"log\"|\"debug\"|\"info\"|\"warn\";args:any[];}&{type:\"FrontendConsole\";},\"FrontendConsole\">":{"additionalProperties":false,"type":"object","properties":{"level":{"enum":["debug","info","log","warn"],"type":"string"},"args":{"type":"array","items":{}},"type":{"type":"string","const":"FrontendConsole"}},"required":["args","level","type"]},"AddValidatorName<{title:string;}&{type:\"UpdateWidgetState\";},\"UpdateWidgetState\">":{"additionalProperties":false,"type":"object","properties":{"title":{"type":"string"},"type":{"type":"string","const":"UpdateWidgetState"}},"required":["title","type"]},"AddValidatorName<{window_ids:string[];}&{type:\"LockFrame\";},\"LockFrame\">":{"additionalProperties":false,"type":"object","properties":{"window_ids":{"type":"array","items":{"type":"string"}},"type":{"type":"string","const":"LockFrame"}},"required":["type","window_ids"]},"AddValidatorName<{window_ids:string[];}&{type:\"UnlockFrame\";},\"UnlockFrame\">":{"additionalProperties":false,"type":"object","properties":{"window_ids":{"type":"array","items":{"type":"string"}},"type":{"type":"string","const":"UnlockFrame"}},"required":["type","window_ids"]},"AddValidatorName<{queryId:string;}&{type:\"QueryState\";},\"QueryState\">":{"additionalProperties":false,"type":"object","properties":{"queryId":{"type":"string"},"type":{"type":"string","const":"QueryState"}},"required":["queryId","type"]},"AddValidatorName<{queryId:string;aspectRatio?:number|undefined;}&{type:\"QuerySnapshot\";},\"QuerySnapshot\">":{"additionalProperties":false,"type":"object","properties":{"queryId":{"type":"string"},"aspectRatio":{"type":"number"},"type":{"type":"string","const":"QuerySnapshot"}},"required":["queryId","type"]},"AddValidatorName<{ra:number;dec:number;fov?:number|undefined;duration:number;easingFunction?:\"linear\"|\"slowStart2\"|\"fastStart2\"|\"slowStart4\"|\"fastStart4\"|\"slowStartStop2\"|\"slowStartStop4\"|undefined;}&{type:\"JumpTo\";},\"JumpTo\">":{"additionalProperties":false,"type":"object","properties":{"ra":{"type":"number"},"dec":{"type":"number"},"fov":{"type":"number"},"duration":{"type":"number"},"easingFunction":{"enum":["fastStart2","fastStart4","linear","slowStart2","slowStart4","slowStartStop2","slowStartStop4"],"type":"string"},"type":{"type":"string","const":"JumpTo"}},"required":["dec","duration","ra","type"]},"AddValidatorName<StellarGlobeWidgetParams,\"StellarGlobeWidgetParams\">":{"additionalProperties":false,"type":"object","properties":{"id":{"type":"string"},"title":{"type":"string"},"layout":{"enum":["merge-bottom","merge-left","merge-right","merge-top","split-bottom","split-left","split-right","tab-after","tab-before"],"type":"string"},"initialState":{},"queryId":{"type":"string"}},"required":["id","queryId"]}}};

function validate14(data, valCxt){
"use strict"; /*# sourceURL="UpdateWidgetState" */;
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
var missing0;
if(((data.title === undefined) && (missing0 = "title")) || ((data.type === undefined) && (missing0 = "type"))){
validate14.errors = [{instancePath:instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
var _errs1 = errors;
for(var key0 in data){
if(!((key0 === "title") || (key0 === "type"))){
validate14.errors = [{instancePath:instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.title !== undefined){
var _errs2 = errors;
if(typeof data.title !== "string"){
validate14.errors = [{instancePath:instancePath+"/title",schemaPath:"#/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.type !== undefined){
var data1 = data.type;
var _errs4 = errors;
if(typeof data1 !== "string"){
validate14.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("UpdateWidgetState" !== data1){
validate14.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "UpdateWidgetState"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate14.errors = [{instancePath:instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate14.errors = vErrors;
return errors === 0;
}

export const LockFrame = validate15;
var schema16 = {"$id":"LockFrame","additionalProperties":false,"type":"object","properties":{"window_ids":{"type":"array","items":{"type":"string"}},"type":{"type":"string","const":"LockFrame"}},"required":["type","window_ids"],"definitions":{"AddValidatorName<{type:\"Close\";},\"Close\">":{"additionalProperties":false,"type":"object","properties":{"type":{"type":"string","const":"Close"}},"required":["type"]},"AddValidatorName<{action:{type:string;payload:any;};}&{type:\"Dispatch\";},\"Dispatch\">":{"additionalProperties":false,"type":"object","properties":{"action":{"type":"object","properties":{"type":{"type":"string"},"payload":{}},"additionalProperties":false,"required":["payload","type"]},"type":{"type":"string","const":"Dispatch"}},"required":["action","type"]},"AddValidatorName<{params:{title:string;body:string;};}&{type:\"ShowError\";},\"ShowError\">":{"additionalProperties":false,"type":"object","properties":{"params":{"type":"object","properties":{"title":{"type":"string"},"body":{"type":"string"}},"additionalProperties":false,"required":["body","title"]},"type":{"type":"string","const":"ShowError"}},"required":["params","type"]},"AddValidatorName<{level:\"log\"|\"debug\"|\"info\"|\"warn\";args:any[];}&{type:\"FrontendConsole\";},\"FrontendConsole\">":{"additionalProperties":false,"type":"object","properties":{"level":{"enum":["debug","info","log","warn"],"type":"string"},"args":{"type":"array","items":{}},"type":{"type":"string","const":"FrontendConsole"}},"required":["args","level","type"]},"AddValidatorName<{title:string;}&{type:\"UpdateWidgetState\";},\"UpdateWidgetState\">":{"additionalProperties":false,"type":"object","properties":{"title":{"type":"string"},"type":{"type":"string","const":"UpdateWidgetState"}},"required":["title","type"]},"AddValidatorName<{window_ids:string[];}&{type:\"LockFrame\";},\"LockFrame\">":{"additionalProperties":false,"type":"object","properties":{"window_ids":{"type":"array","items":{"type":"string"}},"type":{"type":"string","const":"LockFrame"}},"required":["type","window_ids"]},"AddValidatorName<{window_ids:string[];}&{type:\"UnlockFrame\";},\"UnlockFrame\">":{"additionalProperties":false,"type":"object","properties":{"window_ids":{"type":"array","items":{"type":"string"}},"type":{"type":"string","const":"UnlockFrame"}},"required":["type","window_ids"]},"AddValidatorName<{queryId:string;}&{type:\"QueryState\";},\"QueryState\">":{"additionalProperties":false,"type":"object","properties":{"queryId":{"type":"string"},"type":{"type":"string","const":"QueryState"}},"required":["queryId","type"]},"AddValidatorName<{queryId:string;aspectRatio?:number|undefined;}&{type:\"QuerySnapshot\";},\"QuerySnapshot\">":{"additionalProperties":false,"type":"object","properties":{"queryId":{"type":"string"},"aspectRatio":{"type":"number"},"type":{"type":"string","const":"QuerySnapshot"}},"required":["queryId","type"]},"AddValidatorName<{ra:number;dec:number;fov?:number|undefined;duration:number;easingFunction?:\"linear\"|\"slowStart2\"|\"fastStart2\"|\"slowStart4\"|\"fastStart4\"|\"slowStartStop2\"|\"slowStartStop4\"|undefined;}&{type:\"JumpTo\";},\"JumpTo\">":{"additionalProperties":false,"type":"object","properties":{"ra":{"type":"number"},"dec":{"type":"number"},"fov":{"type":"number"},"duration":{"type":"number"},"easingFunction":{"enum":["fastStart2","fastStart4","linear","slowStart2","slowStart4","slowStartStop2","slowStartStop4"],"type":"string"},"type":{"type":"string","const":"JumpTo"}},"required":["dec","duration","ra","type"]},"AddValidatorName<StellarGlobeWidgetParams,\"StellarGlobeWidgetParams\">":{"additionalProperties":false,"type":"object","properties":{"id":{"type":"string"},"title":{"type":"string"},"layout":{"enum":["merge-bottom","merge-left","merge-right","merge-top","split-bottom","split-left","split-right","tab-after","tab-before"],"type":"string"},"initialState":{},"queryId":{"type":"string"}},"required":["id","queryId"]}}};

function validate15(data, valCxt){
"use strict"; /*# sourceURL="LockFrame" */;
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
var missing0;
if(((data.type === undefined) && (missing0 = "type")) || ((data.window_ids === undefined) && (missing0 = "window_ids"))){
validate15.errors = [{instancePath:instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
var _errs1 = errors;
for(var key0 in data){
if(!((key0 === "window_ids") || (key0 === "type"))){
validate15.errors = [{instancePath:instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.window_ids !== undefined){
var data0 = data.window_ids;
var _errs2 = errors;
if(errors === _errs2){
if(Array.isArray(data0)){
var valid1 = true;
var len0 = data0.length;
for(var i0=0; i0<len0; i0++){
var _errs4 = errors;
if(typeof data0[i0] !== "string"){
validate15.errors = [{instancePath:instancePath+"/window_ids/" + i0,schemaPath:"#/properties/window_ids/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid1 = _errs4 === errors;
if(!valid1){
break;
}
}
}
else {
validate15.errors = [{instancePath:instancePath+"/window_ids",schemaPath:"#/properties/window_ids/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.type !== undefined){
var data2 = data.type;
var _errs6 = errors;
if(typeof data2 !== "string"){
validate15.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("LockFrame" !== data2){
validate15.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "LockFrame"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate15.errors = [{instancePath:instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate15.errors = vErrors;
return errors === 0;
}

export const UnlockFrame = validate16;
var schema17 = {"$id":"UnlockFrame","additionalProperties":false,"type":"object","properties":{"window_ids":{"type":"array","items":{"type":"string"}},"type":{"type":"string","const":"UnlockFrame"}},"required":["type","window_ids"],"definitions":{"AddValidatorName<{type:\"Close\";},\"Close\">":{"additionalProperties":false,"type":"object","properties":{"type":{"type":"string","const":"Close"}},"required":["type"]},"AddValidatorName<{action:{type:string;payload:any;};}&{type:\"Dispatch\";},\"Dispatch\">":{"additionalProperties":false,"type":"object","properties":{"action":{"type":"object","properties":{"type":{"type":"string"},"payload":{}},"additionalProperties":false,"required":["payload","type"]},"type":{"type":"string","const":"Dispatch"}},"required":["action","type"]},"AddValidatorName<{params:{title:string;body:string;};}&{type:\"ShowError\";},\"ShowError\">":{"additionalProperties":false,"type":"object","properties":{"params":{"type":"object","properties":{"title":{"type":"string"},"body":{"type":"string"}},"additionalProperties":false,"required":["body","title"]},"type":{"type":"string","const":"ShowError"}},"required":["params","type"]},"AddValidatorName<{level:\"log\"|\"debug\"|\"info\"|\"warn\";args:any[];}&{type:\"FrontendConsole\";},\"FrontendConsole\">":{"additionalProperties":false,"type":"object","properties":{"level":{"enum":["debug","info","log","warn"],"type":"string"},"args":{"type":"array","items":{}},"type":{"type":"string","const":"FrontendConsole"}},"required":["args","level","type"]},"AddValidatorName<{title:string;}&{type:\"UpdateWidgetState\";},\"UpdateWidgetState\">":{"additionalProperties":false,"type":"object","properties":{"title":{"type":"string"},"type":{"type":"string","const":"UpdateWidgetState"}},"required":["title","type"]},"AddValidatorName<{window_ids:string[];}&{type:\"LockFrame\";},\"LockFrame\">":{"additionalProperties":false,"type":"object","properties":{"window_ids":{"type":"array","items":{"type":"string"}},"type":{"type":"string","const":"LockFrame"}},"required":["type","window_ids"]},"AddValidatorName<{window_ids:string[];}&{type:\"UnlockFrame\";},\"UnlockFrame\">":{"additionalProperties":false,"type":"object","properties":{"window_ids":{"type":"array","items":{"type":"string"}},"type":{"type":"string","const":"UnlockFrame"}},"required":["type","window_ids"]},"AddValidatorName<{queryId:string;}&{type:\"QueryState\";},\"QueryState\">":{"additionalProperties":false,"type":"object","properties":{"queryId":{"type":"string"},"type":{"type":"string","const":"QueryState"}},"required":["queryId","type"]},"AddValidatorName<{queryId:string;aspectRatio?:number|undefined;}&{type:\"QuerySnapshot\";},\"QuerySnapshot\">":{"additionalProperties":false,"type":"object","properties":{"queryId":{"type":"string"},"aspectRatio":{"type":"number"},"type":{"type":"string","const":"QuerySnapshot"}},"required":["queryId","type"]},"AddValidatorName<{ra:number;dec:number;fov?:number|undefined;duration:number;easingFunction?:\"linear\"|\"slowStart2\"|\"fastStart2\"|\"slowStart4\"|\"fastStart4\"|\"slowStartStop2\"|\"slowStartStop4\"|undefined;}&{type:\"JumpTo\";},\"JumpTo\">":{"additionalProperties":false,"type":"object","properties":{"ra":{"type":"number"},"dec":{"type":"number"},"fov":{"type":"number"},"duration":{"type":"number"},"easingFunction":{"enum":["fastStart2","fastStart4","linear","slowStart2","slowStart4","slowStartStop2","slowStartStop4"],"type":"string"},"type":{"type":"string","const":"JumpTo"}},"required":["dec","duration","ra","type"]},"AddValidatorName<StellarGlobeWidgetParams,\"StellarGlobeWidgetParams\">":{"additionalProperties":false,"type":"object","properties":{"id":{"type":"string"},"title":{"type":"string"},"layout":{"enum":["merge-bottom","merge-left","merge-right","merge-top","split-bottom","split-left","split-right","tab-after","tab-before"],"type":"string"},"initialState":{},"queryId":{"type":"string"}},"required":["id","queryId"]}}};

function validate16(data, valCxt){
"use strict"; /*# sourceURL="UnlockFrame" */;
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
var missing0;
if(((data.type === undefined) && (missing0 = "type")) || ((data.window_ids === undefined) && (missing0 = "window_ids"))){
validate16.errors = [{instancePath:instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
var _errs1 = errors;
for(var key0 in data){
if(!((key0 === "window_ids") || (key0 === "type"))){
validate16.errors = [{instancePath:instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.window_ids !== undefined){
var data0 = data.window_ids;
var _errs2 = errors;
if(errors === _errs2){
if(Array.isArray(data0)){
var valid1 = true;
var len0 = data0.length;
for(var i0=0; i0<len0; i0++){
var _errs4 = errors;
if(typeof data0[i0] !== "string"){
validate16.errors = [{instancePath:instancePath+"/window_ids/" + i0,schemaPath:"#/properties/window_ids/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid1 = _errs4 === errors;
if(!valid1){
break;
}
}
}
else {
validate16.errors = [{instancePath:instancePath+"/window_ids",schemaPath:"#/properties/window_ids/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.type !== undefined){
var data2 = data.type;
var _errs6 = errors;
if(typeof data2 !== "string"){
validate16.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("UnlockFrame" !== data2){
validate16.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "UnlockFrame"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate16.errors = [{instancePath:instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate16.errors = vErrors;
return errors === 0;
}

export const QueryState = validate17;
var schema18 = {"$id":"QueryState","additionalProperties":false,"type":"object","properties":{"queryId":{"type":"string"},"type":{"type":"string","const":"QueryState"}},"required":["queryId","type"],"definitions":{"AddValidatorName<{type:\"Close\";},\"Close\">":{"additionalProperties":false,"type":"object","properties":{"type":{"type":"string","const":"Close"}},"required":["type"]},"AddValidatorName<{action:{type:string;payload:any;};}&{type:\"Dispatch\";},\"Dispatch\">":{"additionalProperties":false,"type":"object","properties":{"action":{"type":"object","properties":{"type":{"type":"string"},"payload":{}},"additionalProperties":false,"required":["payload","type"]},"type":{"type":"string","const":"Dispatch"}},"required":["action","type"]},"AddValidatorName<{params:{title:string;body:string;};}&{type:\"ShowError\";},\"ShowError\">":{"additionalProperties":false,"type":"object","properties":{"params":{"type":"object","properties":{"title":{"type":"string"},"body":{"type":"string"}},"additionalProperties":false,"required":["body","title"]},"type":{"type":"string","const":"ShowError"}},"required":["params","type"]},"AddValidatorName<{level:\"log\"|\"debug\"|\"info\"|\"warn\";args:any[];}&{type:\"FrontendConsole\";},\"FrontendConsole\">":{"additionalProperties":false,"type":"object","properties":{"level":{"enum":["debug","info","log","warn"],"type":"string"},"args":{"type":"array","items":{}},"type":{"type":"string","const":"FrontendConsole"}},"required":["args","level","type"]},"AddValidatorName<{title:string;}&{type:\"UpdateWidgetState\";},\"UpdateWidgetState\">":{"additionalProperties":false,"type":"object","properties":{"title":{"type":"string"},"type":{"type":"string","const":"UpdateWidgetState"}},"required":["title","type"]},"AddValidatorName<{window_ids:string[];}&{type:\"LockFrame\";},\"LockFrame\">":{"additionalProperties":false,"type":"object","properties":{"window_ids":{"type":"array","items":{"type":"string"}},"type":{"type":"string","const":"LockFrame"}},"required":["type","window_ids"]},"AddValidatorName<{window_ids:string[];}&{type:\"UnlockFrame\";},\"UnlockFrame\">":{"additionalProperties":false,"type":"object","properties":{"window_ids":{"type":"array","items":{"type":"string"}},"type":{"type":"string","const":"UnlockFrame"}},"required":["type","window_ids"]},"AddValidatorName<{queryId:string;}&{type:\"QueryState\";},\"QueryState\">":{"additionalProperties":false,"type":"object","properties":{"queryId":{"type":"string"},"type":{"type":"string","const":"QueryState"}},"required":["queryId","type"]},"AddValidatorName<{queryId:string;aspectRatio?:number|undefined;}&{type:\"QuerySnapshot\";},\"QuerySnapshot\">":{"additionalProperties":false,"type":"object","properties":{"queryId":{"type":"string"},"aspectRatio":{"type":"number"},"type":{"type":"string","const":"QuerySnapshot"}},"required":["queryId","type"]},"AddValidatorName<{ra:number;dec:number;fov?:number|undefined;duration:number;easingFunction?:\"linear\"|\"slowStart2\"|\"fastStart2\"|\"slowStart4\"|\"fastStart4\"|\"slowStartStop2\"|\"slowStartStop4\"|undefined;}&{type:\"JumpTo\";},\"JumpTo\">":{"additionalProperties":false,"type":"object","properties":{"ra":{"type":"number"},"dec":{"type":"number"},"fov":{"type":"number"},"duration":{"type":"number"},"easingFunction":{"enum":["fastStart2","fastStart4","linear","slowStart2","slowStart4","slowStartStop2","slowStartStop4"],"type":"string"},"type":{"type":"string","const":"JumpTo"}},"required":["dec","duration","ra","type"]},"AddValidatorName<StellarGlobeWidgetParams,\"StellarGlobeWidgetParams\">":{"additionalProperties":false,"type":"object","properties":{"id":{"type":"string"},"title":{"type":"string"},"layout":{"enum":["merge-bottom","merge-left","merge-right","merge-top","split-bottom","split-left","split-right","tab-after","tab-before"],"type":"string"},"initialState":{},"queryId":{"type":"string"}},"required":["id","queryId"]}}};

function validate17(data, valCxt){
"use strict"; /*# sourceURL="QueryState" */;
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
var missing0;
if(((data.queryId === undefined) && (missing0 = "queryId")) || ((data.type === undefined) && (missing0 = "type"))){
validate17.errors = [{instancePath:instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
var _errs1 = errors;
for(var key0 in data){
if(!((key0 === "queryId") || (key0 === "type"))){
validate17.errors = [{instancePath:instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.queryId !== undefined){
var _errs2 = errors;
if(typeof data.queryId !== "string"){
validate17.errors = [{instancePath:instancePath+"/queryId",schemaPath:"#/properties/queryId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.type !== undefined){
var data1 = data.type;
var _errs4 = errors;
if(typeof data1 !== "string"){
validate17.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("QueryState" !== data1){
validate17.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "QueryState"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate17.errors = [{instancePath:instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate17.errors = vErrors;
return errors === 0;
}

export const QuerySnapshot = validate18;
var schema19 = {"$id":"QuerySnapshot","additionalProperties":false,"type":"object","properties":{"queryId":{"type":"string"},"aspectRatio":{"type":"number"},"type":{"type":"string","const":"QuerySnapshot"}},"required":["queryId","type"],"definitions":{"AddValidatorName<{type:\"Close\";},\"Close\">":{"additionalProperties":false,"type":"object","properties":{"type":{"type":"string","const":"Close"}},"required":["type"]},"AddValidatorName<{action:{type:string;payload:any;};}&{type:\"Dispatch\";},\"Dispatch\">":{"additionalProperties":false,"type":"object","properties":{"action":{"type":"object","properties":{"type":{"type":"string"},"payload":{}},"additionalProperties":false,"required":["payload","type"]},"type":{"type":"string","const":"Dispatch"}},"required":["action","type"]},"AddValidatorName<{params:{title:string;body:string;};}&{type:\"ShowError\";},\"ShowError\">":{"additionalProperties":false,"type":"object","properties":{"params":{"type":"object","properties":{"title":{"type":"string"},"body":{"type":"string"}},"additionalProperties":false,"required":["body","title"]},"type":{"type":"string","const":"ShowError"}},"required":["params","type"]},"AddValidatorName<{level:\"log\"|\"debug\"|\"info\"|\"warn\";args:any[];}&{type:\"FrontendConsole\";},\"FrontendConsole\">":{"additionalProperties":false,"type":"object","properties":{"level":{"enum":["debug","info","log","warn"],"type":"string"},"args":{"type":"array","items":{}},"type":{"type":"string","const":"FrontendConsole"}},"required":["args","level","type"]},"AddValidatorName<{title:string;}&{type:\"UpdateWidgetState\";},\"UpdateWidgetState\">":{"additionalProperties":false,"type":"object","properties":{"title":{"type":"string"},"type":{"type":"string","const":"UpdateWidgetState"}},"required":["title","type"]},"AddValidatorName<{window_ids:string[];}&{type:\"LockFrame\";},\"LockFrame\">":{"additionalProperties":false,"type":"object","properties":{"window_ids":{"type":"array","items":{"type":"string"}},"type":{"type":"string","const":"LockFrame"}},"required":["type","window_ids"]},"AddValidatorName<{window_ids:string[];}&{type:\"UnlockFrame\";},\"UnlockFrame\">":{"additionalProperties":false,"type":"object","properties":{"window_ids":{"type":"array","items":{"type":"string"}},"type":{"type":"string","const":"UnlockFrame"}},"required":["type","window_ids"]},"AddValidatorName<{queryId:string;}&{type:\"QueryState\";},\"QueryState\">":{"additionalProperties":false,"type":"object","properties":{"queryId":{"type":"string"},"type":{"type":"string","const":"QueryState"}},"required":["queryId","type"]},"AddValidatorName<{queryId:string;aspectRatio?:number|undefined;}&{type:\"QuerySnapshot\";},\"QuerySnapshot\">":{"additionalProperties":false,"type":"object","properties":{"queryId":{"type":"string"},"aspectRatio":{"type":"number"},"type":{"type":"string","const":"QuerySnapshot"}},"required":["queryId","type"]},"AddValidatorName<{ra:number;dec:number;fov?:number|undefined;duration:number;easingFunction?:\"linear\"|\"slowStart2\"|\"fastStart2\"|\"slowStart4\"|\"fastStart4\"|\"slowStartStop2\"|\"slowStartStop4\"|undefined;}&{type:\"JumpTo\";},\"JumpTo\">":{"additionalProperties":false,"type":"object","properties":{"ra":{"type":"number"},"dec":{"type":"number"},"fov":{"type":"number"},"duration":{"type":"number"},"easingFunction":{"enum":["fastStart2","fastStart4","linear","slowStart2","slowStart4","slowStartStop2","slowStartStop4"],"type":"string"},"type":{"type":"string","const":"JumpTo"}},"required":["dec","duration","ra","type"]},"AddValidatorName<StellarGlobeWidgetParams,\"StellarGlobeWidgetParams\">":{"additionalProperties":false,"type":"object","properties":{"id":{"type":"string"},"title":{"type":"string"},"layout":{"enum":["merge-bottom","merge-left","merge-right","merge-top","split-bottom","split-left","split-right","tab-after","tab-before"],"type":"string"},"initialState":{},"queryId":{"type":"string"}},"required":["id","queryId"]}}};

function validate18(data, valCxt){
"use strict"; /*# sourceURL="QuerySnapshot" */;
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
var missing0;
if(((data.queryId === undefined) && (missing0 = "queryId")) || ((data.type === undefined) && (missing0 = "type"))){
validate18.errors = [{instancePath:instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
var _errs1 = errors;
for(var key0 in data){
if(!(((key0 === "queryId") || (key0 === "aspectRatio")) || (key0 === "type"))){
validate18.errors = [{instancePath:instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.queryId !== undefined){
var _errs2 = errors;
if(typeof data.queryId !== "string"){
validate18.errors = [{instancePath:instancePath+"/queryId",schemaPath:"#/properties/queryId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.aspectRatio !== undefined){
var data1 = data.aspectRatio;
var _errs4 = errors;
if(!((typeof data1 == "number") && (isFinite(data1)))){
validate18.errors = [{instancePath:instancePath+"/aspectRatio",schemaPath:"#/properties/aspectRatio/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.type !== undefined){
var data2 = data.type;
var _errs6 = errors;
if(typeof data2 !== "string"){
validate18.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("QuerySnapshot" !== data2){
validate18.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "QuerySnapshot"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
else {
validate18.errors = [{instancePath:instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate18.errors = vErrors;
return errors === 0;
}

export const JumpTo = validate19;
var schema20 = {"$id":"JumpTo","additionalProperties":false,"type":"object","properties":{"ra":{"type":"number"},"dec":{"type":"number"},"fov":{"type":"number"},"duration":{"type":"number"},"easingFunction":{"enum":["fastStart2","fastStart4","linear","slowStart2","slowStart4","slowStartStop2","slowStartStop4"],"type":"string"},"type":{"type":"string","const":"JumpTo"}},"required":["dec","duration","ra","type"],"definitions":{"AddValidatorName<{type:\"Close\";},\"Close\">":{"additionalProperties":false,"type":"object","properties":{"type":{"type":"string","const":"Close"}},"required":["type"]},"AddValidatorName<{action:{type:string;payload:any;};}&{type:\"Dispatch\";},\"Dispatch\">":{"additionalProperties":false,"type":"object","properties":{"action":{"type":"object","properties":{"type":{"type":"string"},"payload":{}},"additionalProperties":false,"required":["payload","type"]},"type":{"type":"string","const":"Dispatch"}},"required":["action","type"]},"AddValidatorName<{params:{title:string;body:string;};}&{type:\"ShowError\";},\"ShowError\">":{"additionalProperties":false,"type":"object","properties":{"params":{"type":"object","properties":{"title":{"type":"string"},"body":{"type":"string"}},"additionalProperties":false,"required":["body","title"]},"type":{"type":"string","const":"ShowError"}},"required":["params","type"]},"AddValidatorName<{level:\"log\"|\"debug\"|\"info\"|\"warn\";args:any[];}&{type:\"FrontendConsole\";},\"FrontendConsole\">":{"additionalProperties":false,"type":"object","properties":{"level":{"enum":["debug","info","log","warn"],"type":"string"},"args":{"type":"array","items":{}},"type":{"type":"string","const":"FrontendConsole"}},"required":["args","level","type"]},"AddValidatorName<{title:string;}&{type:\"UpdateWidgetState\";},\"UpdateWidgetState\">":{"additionalProperties":false,"type":"object","properties":{"title":{"type":"string"},"type":{"type":"string","const":"UpdateWidgetState"}},"required":["title","type"]},"AddValidatorName<{window_ids:string[];}&{type:\"LockFrame\";},\"LockFrame\">":{"additionalProperties":false,"type":"object","properties":{"window_ids":{"type":"array","items":{"type":"string"}},"type":{"type":"string","const":"LockFrame"}},"required":["type","window_ids"]},"AddValidatorName<{window_ids:string[];}&{type:\"UnlockFrame\";},\"UnlockFrame\">":{"additionalProperties":false,"type":"object","properties":{"window_ids":{"type":"array","items":{"type":"string"}},"type":{"type":"string","const":"UnlockFrame"}},"required":["type","window_ids"]},"AddValidatorName<{queryId:string;}&{type:\"QueryState\";},\"QueryState\">":{"additionalProperties":false,"type":"object","properties":{"queryId":{"type":"string"},"type":{"type":"string","const":"QueryState"}},"required":["queryId","type"]},"AddValidatorName<{queryId:string;aspectRatio?:number|undefined;}&{type:\"QuerySnapshot\";},\"QuerySnapshot\">":{"additionalProperties":false,"type":"object","properties":{"queryId":{"type":"string"},"aspectRatio":{"type":"number"},"type":{"type":"string","const":"QuerySnapshot"}},"required":["queryId","type"]},"AddValidatorName<{ra:number;dec:number;fov?:number|undefined;duration:number;easingFunction?:\"linear\"|\"slowStart2\"|\"fastStart2\"|\"slowStart4\"|\"fastStart4\"|\"slowStartStop2\"|\"slowStartStop4\"|undefined;}&{type:\"JumpTo\";},\"JumpTo\">":{"additionalProperties":false,"type":"object","properties":{"ra":{"type":"number"},"dec":{"type":"number"},"fov":{"type":"number"},"duration":{"type":"number"},"easingFunction":{"enum":["fastStart2","fastStart4","linear","slowStart2","slowStart4","slowStartStop2","slowStartStop4"],"type":"string"},"type":{"type":"string","const":"JumpTo"}},"required":["dec","duration","ra","type"]},"AddValidatorName<StellarGlobeWidgetParams,\"StellarGlobeWidgetParams\">":{"additionalProperties":false,"type":"object","properties":{"id":{"type":"string"},"title":{"type":"string"},"layout":{"enum":["merge-bottom","merge-left","merge-right","merge-top","split-bottom","split-left","split-right","tab-after","tab-before"],"type":"string"},"initialState":{},"queryId":{"type":"string"}},"required":["id","queryId"]}}};

function validate19(data, valCxt){
"use strict"; /*# sourceURL="JumpTo" */;
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
var missing0;
if(((((data.dec === undefined) && (missing0 = "dec")) || ((data.duration === undefined) && (missing0 = "duration"))) || ((data.ra === undefined) && (missing0 = "ra"))) || ((data.type === undefined) && (missing0 = "type"))){
validate19.errors = [{instancePath:instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
var _errs1 = errors;
for(var key0 in data){
if(!((((((key0 === "ra") || (key0 === "dec")) || (key0 === "fov")) || (key0 === "duration")) || (key0 === "easingFunction")) || (key0 === "type"))){
validate19.errors = [{instancePath:instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.ra !== undefined){
var data0 = data.ra;
var _errs2 = errors;
if(!((typeof data0 == "number") && (isFinite(data0)))){
validate19.errors = [{instancePath:instancePath+"/ra",schemaPath:"#/properties/ra/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.dec !== undefined){
var data1 = data.dec;
var _errs4 = errors;
if(!((typeof data1 == "number") && (isFinite(data1)))){
validate19.errors = [{instancePath:instancePath+"/dec",schemaPath:"#/properties/dec/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.fov !== undefined){
var data2 = data.fov;
var _errs6 = errors;
if(!((typeof data2 == "number") && (isFinite(data2)))){
validate19.errors = [{instancePath:instancePath+"/fov",schemaPath:"#/properties/fov/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.duration !== undefined){
var data3 = data.duration;
var _errs8 = errors;
if(!((typeof data3 == "number") && (isFinite(data3)))){
validate19.errors = [{instancePath:instancePath+"/duration",schemaPath:"#/properties/duration/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.easingFunction !== undefined){
var data4 = data.easingFunction;
var _errs10 = errors;
if(typeof data4 !== "string"){
validate19.errors = [{instancePath:instancePath+"/easingFunction",schemaPath:"#/properties/easingFunction/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((((((data4 === "fastStart2") || (data4 === "fastStart4")) || (data4 === "linear")) || (data4 === "slowStart2")) || (data4 === "slowStart4")) || (data4 === "slowStartStop2")) || (data4 === "slowStartStop4"))){
validate19.errors = [{instancePath:instancePath+"/easingFunction",schemaPath:"#/properties/easingFunction/enum",keyword:"enum",params:{allowedValues: schema20.properties.easingFunction.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.type !== undefined){
var data5 = data.type;
var _errs12 = errors;
if(typeof data5 !== "string"){
validate19.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("JumpTo" !== data5){
validate19.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "JumpTo"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
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
validate19.errors = [{instancePath:instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate19.errors = vErrors;
return errors === 0;
}

export const StellarGlobeWidgetParams = validate20;
var schema21 = {"$id":"StellarGlobeWidgetParams","additionalProperties":false,"type":"object","properties":{"id":{"type":"string"},"title":{"type":"string"},"layout":{"enum":["merge-bottom","merge-left","merge-right","merge-top","split-bottom","split-left","split-right","tab-after","tab-before"],"type":"string"},"initialState":{},"queryId":{"type":"string"}},"required":["id","queryId"],"definitions":{"AddValidatorName<{type:\"Close\";},\"Close\">":{"additionalProperties":false,"type":"object","properties":{"type":{"type":"string","const":"Close"}},"required":["type"]},"AddValidatorName<{action:{type:string;payload:any;};}&{type:\"Dispatch\";},\"Dispatch\">":{"additionalProperties":false,"type":"object","properties":{"action":{"type":"object","properties":{"type":{"type":"string"},"payload":{}},"additionalProperties":false,"required":["payload","type"]},"type":{"type":"string","const":"Dispatch"}},"required":["action","type"]},"AddValidatorName<{params:{title:string;body:string;};}&{type:\"ShowError\";},\"ShowError\">":{"additionalProperties":false,"type":"object","properties":{"params":{"type":"object","properties":{"title":{"type":"string"},"body":{"type":"string"}},"additionalProperties":false,"required":["body","title"]},"type":{"type":"string","const":"ShowError"}},"required":["params","type"]},"AddValidatorName<{level:\"log\"|\"debug\"|\"info\"|\"warn\";args:any[];}&{type:\"FrontendConsole\";},\"FrontendConsole\">":{"additionalProperties":false,"type":"object","properties":{"level":{"enum":["debug","info","log","warn"],"type":"string"},"args":{"type":"array","items":{}},"type":{"type":"string","const":"FrontendConsole"}},"required":["args","level","type"]},"AddValidatorName<{title:string;}&{type:\"UpdateWidgetState\";},\"UpdateWidgetState\">":{"additionalProperties":false,"type":"object","properties":{"title":{"type":"string"},"type":{"type":"string","const":"UpdateWidgetState"}},"required":["title","type"]},"AddValidatorName<{window_ids:string[];}&{type:\"LockFrame\";},\"LockFrame\">":{"additionalProperties":false,"type":"object","properties":{"window_ids":{"type":"array","items":{"type":"string"}},"type":{"type":"string","const":"LockFrame"}},"required":["type","window_ids"]},"AddValidatorName<{window_ids:string[];}&{type:\"UnlockFrame\";},\"UnlockFrame\">":{"additionalProperties":false,"type":"object","properties":{"window_ids":{"type":"array","items":{"type":"string"}},"type":{"type":"string","const":"UnlockFrame"}},"required":["type","window_ids"]},"AddValidatorName<{queryId:string;}&{type:\"QueryState\";},\"QueryState\">":{"additionalProperties":false,"type":"object","properties":{"queryId":{"type":"string"},"type":{"type":"string","const":"QueryState"}},"required":["queryId","type"]},"AddValidatorName<{queryId:string;aspectRatio?:number|undefined;}&{type:\"QuerySnapshot\";},\"QuerySnapshot\">":{"additionalProperties":false,"type":"object","properties":{"queryId":{"type":"string"},"aspectRatio":{"type":"number"},"type":{"type":"string","const":"QuerySnapshot"}},"required":["queryId","type"]},"AddValidatorName<{ra:number;dec:number;fov?:number|undefined;duration:number;easingFunction?:\"linear\"|\"slowStart2\"|\"fastStart2\"|\"slowStart4\"|\"fastStart4\"|\"slowStartStop2\"|\"slowStartStop4\"|undefined;}&{type:\"JumpTo\";},\"JumpTo\">":{"additionalProperties":false,"type":"object","properties":{"ra":{"type":"number"},"dec":{"type":"number"},"fov":{"type":"number"},"duration":{"type":"number"},"easingFunction":{"enum":["fastStart2","fastStart4","linear","slowStart2","slowStart4","slowStartStop2","slowStartStop4"],"type":"string"},"type":{"type":"string","const":"JumpTo"}},"required":["dec","duration","ra","type"]},"AddValidatorName<StellarGlobeWidgetParams,\"StellarGlobeWidgetParams\">":{"additionalProperties":false,"type":"object","properties":{"id":{"type":"string"},"title":{"type":"string"},"layout":{"enum":["merge-bottom","merge-left","merge-right","merge-top","split-bottom","split-left","split-right","tab-after","tab-before"],"type":"string"},"initialState":{},"queryId":{"type":"string"}},"required":["id","queryId"]}}};

function validate20(data, valCxt){
"use strict"; /*# sourceURL="StellarGlobeWidgetParams" */;
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
var missing0;
if(((data.id === undefined) && (missing0 = "id")) || ((data.queryId === undefined) && (missing0 = "queryId"))){
validate20.errors = [{instancePath:instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
var _errs1 = errors;
for(var key0 in data){
if(!(((((key0 === "id") || (key0 === "title")) || (key0 === "layout")) || (key0 === "initialState")) || (key0 === "queryId"))){
validate20.errors = [{instancePath:instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.id !== undefined){
var _errs2 = errors;
if(typeof data.id !== "string"){
validate20.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.title !== undefined){
var _errs4 = errors;
if(typeof data.title !== "string"){
validate20.errors = [{instancePath:instancePath+"/title",schemaPath:"#/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.layout !== undefined){
var data2 = data.layout;
var _errs6 = errors;
if(typeof data2 !== "string"){
validate20.errors = [{instancePath:instancePath+"/layout",schemaPath:"#/properties/layout/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((((((((data2 === "merge-bottom") || (data2 === "merge-left")) || (data2 === "merge-right")) || (data2 === "merge-top")) || (data2 === "split-bottom")) || (data2 === "split-left")) || (data2 === "split-right")) || (data2 === "tab-after")) || (data2 === "tab-before"))){
validate20.errors = [{instancePath:instancePath+"/layout",schemaPath:"#/properties/layout/enum",keyword:"enum",params:{allowedValues: schema21.properties.layout.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.queryId !== undefined){
var _errs8 = errors;
if(typeof data.queryId !== "string"){
validate20.errors = [{instancePath:instancePath+"/queryId",schemaPath:"#/properties/queryId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
else {
validate20.errors = [{instancePath:instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate20.errors = vErrors;
return errors === 0;
}
