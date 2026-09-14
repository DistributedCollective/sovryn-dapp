import { rememberExits, rememberedExits } from './exitDelayHistory';

const ACCOUNT = '0x1111111111111111111111111111111111111111';
const OTHER = '0x2222222222222222222222222222222222222222';
const QUEUE = '0x9999999999999999999999999999999999999999';

describe('exitDelayHistory', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('remembers nothing until it is shown something', () => {
    expect(rememberedExits('30', ACCOUNT)).toEqual([]);
  });

  it('remembers a withdrawal by queue and id, and only those two fields', () => {
    rememberExits('30', ACCOUNT, [
      { queueAddress: QUEUE, id: '7', amount: 'not stored' } as never,
    ]);

    expect(rememberedExits('30', ACCOUNT)).toEqual([
      { queueAddress: QUEUE, id: '7' },
    ]);
  });

  it('keeps what it knew and adds only what is new', () => {
    rememberExits('30', ACCOUNT, [{ queueAddress: QUEUE, id: '7' }]);
    rememberExits('30', ACCOUNT, [
      { queueAddress: QUEUE.toUpperCase().replace('0X', '0x'), id: '7' },
      { queueAddress: QUEUE, id: '8' },
    ]);

    expect(rememberedExits('30', ACCOUNT)).toEqual([
      { queueAddress: QUEUE, id: '7' },
      { queueAddress: QUEUE, id: '8' },
    ]);
  });

  it('keeps each chain and account apart, and reads the account case-insensitively', () => {
    rememberExits('30', ACCOUNT, [{ queueAddress: QUEUE, id: '7' }]);
    rememberExits('31', ACCOUNT, [{ queueAddress: QUEUE, id: '9' }]);

    expect(
      rememberedExits('30', ACCOUNT.toUpperCase().replace('0X', '0x')),
    ).toEqual([{ queueAddress: QUEUE, id: '7' }]);
    expect(rememberedExits('31', ACCOUNT)).toEqual([
      { queueAddress: QUEUE, id: '9' },
    ]);
    expect(rememberedExits('30', OTHER)).toEqual([]);
  });

  it('treats a damaged store as empty rather than failing', () => {
    window.localStorage.setItem('perimeter/history/30/' + ACCOUNT, '{not json');

    expect(rememberedExits('30', ACCOUNT)).toEqual([]);

    window.localStorage.setItem(
      'perimeter/history/30/' + ACCOUNT,
      JSON.stringify([{ queueAddress: QUEUE, id: '7' }, 'junk', { id: 3 }]),
    );

    expect(rememberedExits('30', ACCOUNT)).toEqual([
      { queueAddress: QUEUE, id: '7' },
    ]);
  });
});
