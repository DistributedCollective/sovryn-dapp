import { BehaviorSubject, Subject } from 'rxjs';

export const createEventBag = <T>(initialValue?: T) => {
  const subject =
    initialValue !== undefined
      ? new BehaviorSubject<T>(initialValue)
      : new Subject<T>();

  const subscribe = (callback: (value: T) => void) =>
    subject.subscribe(callback);

  const push = (value: T) => subject.next(value);

  return {
    subscribe,
    push,
  };
};
