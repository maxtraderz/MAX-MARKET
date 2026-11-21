export const performance = {
  'agent-jin': {
    image: '/images/performance/jinzfx-orb-report.jpg',
    title: 'JINZFX ORB', status: 'Supplied historical report',
    metrics: [
      { label: 'Total PnL', value: '+$213,075.89', detail: '+2.13% return' },
      { label: 'Max drawdown', value: '0.36%', detail: '$36,270.55 USD' },
      { label: 'Profitable trades', value: '63.07%', detail: '2,815 / 4,463 trades' },
      { label: 'Profit factor', value: '1.131', detail: 'As shown in supplied report' },
    ],
    source: 'Supplied JINZFX ORB screenshot, displayed in a light theme.',
    period: '2022–2026, as labelled on the report axis.',
    platform: 'TradingView-style strategy report. Execution platform not confirmed.',
    statusNote: 'Historical report; live versus backtest status has not been independently confirmed. The screenshot is labelled JINZFX ORB. The product version and trading conditions are unconfirmed.',
  },
} as const;
