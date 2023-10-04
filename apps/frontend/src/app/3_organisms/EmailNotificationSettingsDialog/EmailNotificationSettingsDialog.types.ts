export type NotificationUser = {
  id: string;
  createdAt: string;
  updatedAt: string;
  walletAddress: string;
  email?: string;
  emailNotificationLastSent?: string;
  role: string;
  isEmailConfirmed?: boolean;
};

export enum NotificationMessageType {
  ZeroBelowCcr = 'ZeroBelowCcr',
  ZeroCcr = 'ZeroCcr',
  ZeroCriticalIcrNormal = 'ZeroCriticalIcrNormal',
  ZeroCriticalIcrRecovery = 'ZeroCriticalIcrRecovery',
  ZeroGain = 'ZeroGain',
  ZeroLiquidation = 'ZeroLiquidation',
  ZeroLiquidationSurplus = 'ZeroLiquidationSurplus',
  ZeroLowTcr = 'ZeroLowTcr',
  ZeroRecovery = 'ZeroRecovery',
  ZeroRedemptionFull = 'ZeroRedemptionFull',
  ZeroRedemptionPartial = 'ZeroRedemptionPartial',
  LoanMarginCall = 'LoanMarginCall',
  LoanLiquidation = 'LoanLiquidation',
  LoanMarginCallUndercollateralized = 'LoanMarginCallUndercollateralized',
  BitocracyVote = 'BitocracyVote',
}

export enum AlertGroup {
  MarginCalls = 'MarginCalls',
  Liquidations = 'Liquidations',
  StabilityPool = 'StabilityPool',
  System = 'System',
  BitocracyVote = 'BitocracyVote',
}

export const AlertGroupToNotificationsMapping: Record<
  AlertGroup,
  NotificationMessageType[]
> = {
  MarginCalls: [
    NotificationMessageType.ZeroBelowCcr,
    NotificationMessageType.ZeroCcr,
    NotificationMessageType.ZeroCriticalIcrNormal,
    NotificationMessageType.ZeroCriticalIcrRecovery,
    NotificationMessageType.LoanMarginCall,
    NotificationMessageType.LoanMarginCallUndercollateralized,
  ],
  Liquidations: [
    NotificationMessageType.ZeroLiquidation,
    NotificationMessageType.ZeroLiquidationSurplus,
    NotificationMessageType.ZeroRedemptionFull,
    NotificationMessageType.ZeroRedemptionPartial,
    NotificationMessageType.LoanLiquidation,
  ],
  StabilityPool: [NotificationMessageType.ZeroGain],
  System: [
    NotificationMessageType.ZeroLowTcr,
    NotificationMessageType.ZeroRecovery,
  ],
  BitocracyVote: [NotificationMessageType.BitocracyVote],
};

export type Notification = {
  notification: NotificationMessageType;
  isSubscribed: boolean;
};

export const defaultSubscriptionsArray: Notification[] = [
  {
    notification: NotificationMessageType.ZeroBelowCcr,
    isSubscribed: false,
  },
  {
    notification: NotificationMessageType.ZeroCcr,
    isSubscribed: false,
  },
  {
    notification: NotificationMessageType.ZeroCriticalIcrNormal,
    isSubscribed: false,
  },
  {
    notification: NotificationMessageType.ZeroCriticalIcrRecovery,
    isSubscribed: false,
  },
  {
    notification: NotificationMessageType.ZeroGain,
    isSubscribed: false,
  },
  {
    notification: NotificationMessageType.ZeroLiquidation,
    isSubscribed: false,
  },
  {
    notification: NotificationMessageType.ZeroLiquidationSurplus,
    isSubscribed: false,
  },
  {
    notification: NotificationMessageType.ZeroLowTcr,
    isSubscribed: false,
  },
  {
    notification: NotificationMessageType.ZeroRecovery,
    isSubscribed: false,
  },
  {
    notification: NotificationMessageType.ZeroRedemptionFull,
    isSubscribed: false,
  },
  {
    notification: NotificationMessageType.ZeroRedemptionPartial,
    isSubscribed: false,
  },
  {
    notification: NotificationMessageType.LoanMarginCall,
    isSubscribed: false,
  },
  {
    notification: NotificationMessageType.LoanMarginCallUndercollateralized,
    isSubscribed: false,
  },
  {
    notification: NotificationMessageType.LoanLiquidation,
    isSubscribed: false,
  },
  {
    notification: NotificationMessageType.BitocracyVote,
    isSubscribed: false,
  },
];
