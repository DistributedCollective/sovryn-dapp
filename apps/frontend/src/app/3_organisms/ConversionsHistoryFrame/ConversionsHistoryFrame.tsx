import React from 'react';

import { useGetConversionsHistory } from './hooks/useGetConversionsHistory';

export const ConversionsHistoryFrame: React.FC = () => {
  const { data } = useGetConversionsHistory();

  console.log(`data returned: ${JSON.stringify(data)}`);
  return (
    <>
      <div>This is conversions history frame</div>
    </>
  );
};
