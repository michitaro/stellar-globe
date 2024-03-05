import Ajv from "ajv";
import standaloneCode from "ajv/dist/standalone/index.js";
import { ArgumentParser } from "argparse";
import { writeFileSync, existsSync, readFileSync, mkdirSync } from "fs";
import * as TJS from "typescript-json-schema";
function walk(root, cb, {
  invokeOnRefs = false
} = {}) {
  const alreadyVisited = /* @__PURE__ */ new Set();
  const dig = (parent, depth) => {
    if (isRef(parent)) {
      if (alreadyVisited.has(parent.$ref)) {
        return;
      }
      alreadyVisited.add(parent.$ref);
      if (invokeOnRefs) {
        cb(parent, depth);
      }
      parent = dereference(parent.$ref, root.definitions);
    }
    cb(parent, depth);
    if (parent.properties) {
      Object.values(parent.properties).forEach((child) => {
        if (child instanceof Object) {
          dig(child, depth + 1);
        }
      });
    }
    if (parent.items) {
      if (parent.items instanceof Array) {
        parent.items.forEach((child) => {
          if (child instanceof Object) {
            dig(child, depth + 1);
          }
        });
      } else if (parent.items instanceof Object) {
        dig(parent.items, depth + 1);
      }
    }
    if (parent.anyOf) {
      parent.anyOf.forEach((child) => {
        if (child instanceof Object) {
          dig(child, depth + 1);
        }
      });
    }
    if (parent.allOf) {
      parent.allOf.forEach((child) => {
        if (child instanceof Object) {
          dig(child, depth + 1);
        }
      });
    }
    if (parent.oneOf) {
      parent.oneOf.forEach((child) => {
        if (child instanceof Object) {
          dig(child, depth + 1);
        }
      });
    }
  };
  dig(root, 0);
}
function dereference(ref, definitions) {
  if (!definitions) {
    throw new Error("Definitions are undefined.");
  }
  const key = ref.slice("#/definitions/".length);
  const def = definitions[key];
  if (!(def instanceof Object)) {
    throw new Error(`Definition ${key} not found.`);
  }
  return def;
}
function isRef(node) {
  return !!node.$ref;
}
const indexTemplate = "// @ts-ignore\nimport * as validators from './ajv'\n\n\nexport function createIs<Type>(validatorName: keyof typeof validators) {\n  function is(\n    obj: any,\n  ): obj is Type {\n    const v = validators[validatorName]\n    if (!v) {\n      // @ts-ignore\n      throw new Error(`Validator not found: ${validatorName}`)\n    }\n    const ok = v(obj)\n    if (!ok) {\n      Object.assign(is, { errors: (v as any).errors as string[] })\n    }\n    return ok\n  }\n  return Object.assign(is, { errors: [] as string[] })\n}\n";
function main() {
  const parser = new ArgumentParser({});
  parser.add_argument("--jsonschema", "-j", { action: "store_true", default: false });
  parser.add_argument("--typename", "-t", { type: String, required: true });
  parser.add_argument("--project", "-p", { type: String, default: "." });
  parser.add_argument("--out", "-o", { type: String, required: true });
  parser.add_argument("--useCache", "-c", { default: false, action: "store_true" });
  parser.add_argument("--validatorNameKey", "-k", { default: "__validatorName__", type: String });
  parser.add_argument("--onlyIndex", "-i", { default: false, action: "store_true" });
  const args = parser.parse_args();
  mkdirP(args.out);
  writeFileSync(`${args.out}/index.ts`, indexTemplate);
  if (args.onlyIndex) {
    return;
  }
  if (args.useCache && !args.jsonschema) {
    throw new Error("The useCache option requires the jsonschema option to be provided.");
  }
  const root = (() => {
    const jsonschemaFile = `${args.out}/jsonschema.json`;
    if (args.useCache && existsSync(jsonschemaFile)) {
      return JSON.parse(readFileSync(jsonschemaFile, "utf-8"));
    } else {
      const root2 = jsonSchemaFromTsconfig(`${args.project}/tsconfig.json`, args.typename);
      if (args.jsonschema) {
        writeFileSync(jsonschemaFile, JSON.stringify(root2, null, 2));
      }
      return root2;
    }
  })();
  const schemata = [];
  walk(root, (node) => {
    var _a, _b;
    const key = (_a = node.properties) == null ? void 0 : _a[args.validatorNameKey];
    if (isConstString(key)) {
      (_b = node.properties) == null ? true : delete _b[args.validatorNameKey];
      if (node.required) {
        node.required.splice(node.required.indexOf(args.validatorNameKey), 1);
      }
      const $id = key.const;
      schemata.push({
        $id,
        ...node,
        definitions: root.definitions
      });
    }
  });
  const ajv = new Ajv({
    schemas: schemata,
    code: { source: true, esm: true, es5: true, lines: true, optimize: true }
  });
  const validatorCode = standaloneCode(ajv);
  writeFileSync(`${args.out}/ajv.js`, validatorCode);
}
function isConstString(node) {
  return node && node.const !== void 0;
}
function jsonSchemaFromTsconfig(tsconfigPath, typeName) {
  const program = TJS.programFromConfig(tsconfigPath);
  const schema = TJS.generateSchema(program, typeName, {
    noExtraProps: true,
    required: true
  });
  return schema;
}
function mkdirP(path) {
  const parts = path.split("/");
  let current = "";
  for (const part of parts) {
    current += part + "/";
    if (!existsSync(current)) {
      mkdirSync(current);
    }
  }
}
main();
export {
  main
};
