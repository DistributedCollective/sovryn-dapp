import { Proposal } from '../../../utils/graphql/rsk/generated';

export enum ProposalState {
  Pending,
  Active,
  Canceled,
  Defeated,
  Succeeded,
  Queued,
  Expired,
  Executed,
}

export type ProposalProps = {
  proposal: Proposal;
};
