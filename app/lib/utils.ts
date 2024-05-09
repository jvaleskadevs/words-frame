import { fromBytes } from "viem";

export const deserializeState = (state: Uint8Array) => {
  if (!state || state.length === 0) return '';
  const stateStr: any = fromBytes(state, 'string');
  let deserializedState: any;
  if (stateStr) {
    try {
      deserializedState = JSON.parse(
        decodeURIComponent(stateStr.replace(/\+/g,  " "))
      );
    } catch (err) {
      console.log(err);
    }
  }
  return deserializedState;
}
