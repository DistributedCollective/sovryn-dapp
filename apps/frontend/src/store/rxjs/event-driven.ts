import { Subject } from 'rxjs';

const states = new Map<string, Subject<any>>();

export const eventDriven = <T>(key: string) => {
  if (!states.has(key)) {
    states.set(key, new Subject<T>());
  }

  const subject = states.get(key) as Subject<T>;

  const subscribe = (callback: (value: T) => void) =>
    subject.subscribe(callback);

  const push = (value: T) => subject.next(value);

  return {
    subscribe,
    push,
  };
};
