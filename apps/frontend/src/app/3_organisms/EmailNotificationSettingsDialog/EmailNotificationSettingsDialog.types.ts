export type NotificationUser = {
  id: string;
  createdAt: string;
  updatedAt: string;
  walletAddress: string;
  email?: string;
  emailNotificationLastSent?: string;
  role: string;
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
}

export enum AlertGroup {
  MarginCalls = 'MarginCalls',
  Liquidations = 'Liquidations',
  StabilityPool = 'StabilityPool',
  System = 'System',
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
  ],
  Liquidations: [
    NotificationMessageType.ZeroLiquidation,
    NotificationMessageType.ZeroLiquidationSurplus,
  ],
  StabilityPool: [NotificationMessageType.ZeroGain],
  System: [
    NotificationMessageType.ZeroLowTcr,
    NotificationMessageType.ZeroRecovery,
  ],
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
];
