import {
  BehaviorSubject,
  Observable,
  distinctUntilKeyChanged,
  map,
  filter,
  startWith,
} from 'rxjs';

export type EventDriverState = {
  emailNotificationSettingsDialog: EmailNotificationSettingsDialogState;
  erc20BridgeDialog: Erc20BridgeDialogState;
};

export type EmailNotificationSettingsDialogState = {
  isOpen: boolean;
};

export type Erc20BridgeDialogState = {
  isOpen: boolean;
  step?: number;
};

const INITIAL_STATE = {
  emailNotificationSettingsDialog: {
    isOpen: false,
  },
  erc20BridgeDialog: {
    isOpen: false,
    step: 0,
  },
};

const store = new BehaviorSubject<EventDriverState>(INITIAL_STATE);

type State = (previousState: EventDriverState) => EventDriverState;

const dispatch = (state: State) => store.next(state(store.getValue()));

// Selectors
function select(): Observable<EventDriverState>;
function select<T extends keyof EventDriverState>(
  stateKey: T,
): Observable<EventDriverState[T]>;
function select<T extends keyof EventDriverState>(
  stateKey?: keyof EventDriverState,
): Observable<EventDriverState[T]> | Observable<EventDriverState> {
  if (!stateKey) return store.asObservable();

  const validStateKeys = Object.keys(store.getValue());

  if (!validStateKeys.includes(String(stateKey))) {
    throw new Error(`key: ${stateKey} does not exist on this store`);
  }

  return store.asObservable().pipe(
    startWith(store.getValue()),
    distinctUntilKeyChanged(stateKey),
    map(x => x?.[stateKey]),
    filter(value => value !== null && value !== undefined),
  ) as Observable<EventDriverState[T]>;
}

const get = (): EventDriverState => store.getValue();

// Actions
const openErc20BridgeDialog = (step: number = 0) =>
  dispatch(state => ({
    ...state,
    erc20BridgeDialog: {
      isOpen: true,
      step,
    },
  }));
const closeErc20BridgeDialog = () =>
  dispatch(state => ({
    ...state,
    erc20BridgeDialog: {
      ...state.erc20BridgeDialog,
      isOpen: false,
    },
  }));

const openEmailNotificationSettingsDialog = () =>
  dispatch(state => ({
    ...state,
    emailNotificationSettingsDialog: {
      isOpen: true,
    },
  }));

const closeEmailNotificationSettingsDialog = () =>
  dispatch(state => ({
    ...state,
    emailNotificationSettingsDialog: {
      isOpen: false,
    },
  }));

export const sharedState = {
  get,
  select,
  actions: {
    openEmailNotificationSettingsDialog,
    closeEmailNotificationSettingsDialog,
    openErc20BridgeDialog,
    closeErc20BridgeDialog,
  },
};
