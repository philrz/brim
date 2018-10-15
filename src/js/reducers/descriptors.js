/* @flow */

import createReducer from "./createReducer"

const initialState = {}

type Descriptor = {type: string, name: string}
type Slice = {[string]: Descriptor[]}
type State = {descriptors: Slice}

export default createReducer(initialState, {
  DESCRIPTOR_RECEIVE: (state, {space, id, descriptor}) => ({
    ...state,
    [space + "." + id]: descriptor
  })
})

export const getDescriptors = (state: State) => state.descriptors