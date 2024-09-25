import {
  ReactNode,
  ReducerState,
  createContext,
  useContext,
  useMemo,
  useReducer,
} from "react";

// Define interfaces for your state
interface AppState {}

export const initialState: AppState = {};

type Validate<T extends Record<string, string>> = {
  [Name in keyof T]: Name extends T[Name] ? T[Name] : never;
};

const validator = <
  Key extends string,
  Value extends string,
  Data extends Record<Key, Value>
>(
  data: Validate<Data>
) => data;

export const actionTypes = Object.freeze(
  validator({
    // ACTION_TYPE: "ACTION_TYPE",
  })
);

export type ActionType = keyof typeof actionTypes;

type IAction = {
  type: ActionType;
  payload?: any;
};

export const AppContext = createContext({
  state: initialState,
  dispatch: (() => {}) as React.Dispatch<IAction>,
});

const reducer = (
  state: typeof initialState,
  action: IAction
): typeof initialState => {
  switch (action.type) {
    default:
      return state;
  }
};

const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(
    reducer,
    initialState as ReducerState<typeof reducer>
  );
  const contextState = useMemo(() => ({ state, dispatch }), [state]);
  return (
    <AppContext.Provider value={contextState}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
export default AppContextProvider;
