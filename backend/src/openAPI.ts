import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

export const registry = new OpenAPIRegistry();

export function getOpenApiDocumentation() {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "My API",
      description: "This is the API.",
    },
    servers: [{ url: "/" }],
  });
}

export function writeDocumentation() {
  const docs = getOpenApiDocumentation();
  const fileContent = JSON.stringify(docs, null, 2);
  fs.writeFileSync(`${__dirname}/openAPI.json`, fileContent, {
    encoding: "utf-8",
  });
}
