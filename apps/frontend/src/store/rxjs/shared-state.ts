import {
  BehaviorSubject,
  Observable,
  distinctUntilKeyChanged,
  map,
  filter,
  startWith,
} from 'rxjs';

export type EventDriverState = {
  fastBtcDialog: FastBtcDialogState;
  emailNotificationSettingsDialog: EmailNotificationSettingsDialogState;
  runeBridgeDialog: RuneBridgeDialogState;
};

export type FastBtcDialogState = {
  isOpen: boolean;
  shouldHideSend: boolean;
  step?: number;
};

export type EmailNotificationSettingsDialogState = {
  isOpen: boolean;
};

export type RuneBridgeDialogState = {
  isOpen: boolean;
  step?: number;
};

const INITIAL_STATE = {
  fastBtcDialog: {
    isOpen: false,
    shouldHideSend: false,
    step: 0,
  },
  emailNotificationSettingsDialog: {
    isOpen: false,
  },
  runeBridgeDialog: {
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
const openFastBtcDialog = (shouldHideSend: boolean = false, step: number = 0) =>
  dispatch(state => ({
    ...state,
    fastBtcDialog: {
      isOpen: true,
      shouldHideSend,
      step,
    },
  }));

const closeFastBtcDialog = () =>
  dispatch(state => ({
    ...state,
    fastBtcDialog: {
      ...state.fastBtcDialog,
      isOpen: false,
    },
  }));
const openRuneBridgeDialog = (step: number = 0) =>
  dispatch(state => ({
    ...state,
    runeBridgeDialog: {
      isOpen: true,
      step,
    },
  }));

const closeRuneBridgeDialog = () =>
  dispatch(state => ({
    ...state,
    runeBridgeDialog: {
      ...state.runeBridgeDialog,
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
    openFastBtcDialog,
    closeFastBtcDialog,
    openEmailNotificationSettingsDialog,
    closeEmailNotificationSettingsDialog,
    openRuneBridgeDialog,
    closeRuneBridgeDialog,
  },
};
