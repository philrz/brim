import {Store as ReduxStore, Action as ReduxAction} from "redux"
import {ThunkAction, ThunkDispatch} from "redux-thunk"
import {ErrorsState} from "./Errors/types"
import {HandlersState} from "./Handlers/types"
import {InvestigationState} from "./Investigation/types"
import {ModalState} from "./Modal/types"
import {NoticeState} from "./Notice/types"
import {PrefsState} from "./Prefs/types"
import {PoolsState} from "./Pools/types"
import {TabsState} from "./Tabs/types"
import {ToolbarsState} from "./Toolbars"
import {ViewState} from "./View/types"
import {createZealot, Zealot} from "zealot"
import {QueriesState} from "./Queries/types"
import {SystemTestState} from "./SystemTest"
import {FeatureState} from "./Feature"
import {WorkspacesState} from "./Workspaces/types"
import {WorkspaceStatusesState} from "./WorkspaceStatuses/types"
import {TabHistoriesState} from "./TabHistories/types"
import BrimApi from "../api"
import {PluginStorageState} from "./PluginStorage"
import {ConfigsState} from "./Configs"
import {ConfigPropValuesState} from "./ConfigPropValues"
import {LaunchesState} from "./Launches"

export type GetState = () => State
export type ThunkExtraArg = {
  zealot: Zealot
  createZealot: typeof createZealot
  dispatch: AppDispatch
  api: BrimApi
}

export type Action = ReduxAction<string>
export type Thunk<R = void> = ThunkAction<R, State, ThunkExtraArg, Action>
export type Store = ReduxStore<State, any>
export type AppDispatch = ThunkDispatch<State, ThunkExtraArg, Action>
export type Dispatch = AppDispatch

export type DispatchProps = {dispatch: Dispatch}
export type State = {
  launches: LaunchesState
  configs: ConfigsState
  configPropValues: ConfigPropValuesState
  tabHistories: TabHistoriesState
  handlers: HandlersState
  workspaces: WorkspacesState
  errors: ErrorsState
  pools: PoolsState
  view: ViewState
  investigation: InvestigationState
  modal: ModalState
  notice: NoticeState
  tabs: TabsState
  prefs: PrefsState
  pluginStorage: PluginStorageState
  workspaceStatuses: WorkspaceStatusesState
  queries: QueriesState
  systemTest: SystemTestState
  feature: FeatureState
  toolbars: ToolbarsState
}
