import { v4 as uuidv4 } from "uuid";

export function useUUID() {
  return uuidv4();
}