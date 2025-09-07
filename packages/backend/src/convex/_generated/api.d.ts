/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as tasks from "../tasks.js";
import type * as user_error from "../user/error.js";
import type * as user_index from "../user/index.js";
import type * as user_mutation from "../user/mutation.js";
import type * as user_query from "../user/query.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  tasks: typeof tasks;
  "user/error": typeof user_error;
  "user/index": typeof user_index;
  "user/mutation": typeof user_mutation;
  "user/query": typeof user_query;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
