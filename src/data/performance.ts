export const performance = {
  'agent-jin': {
    image: '/images/performance/agent-jin-report.webp',
    title: 'AGENT JIN 1.1', status: 'Supplied historical report',
    metrics: [
      { label: 'Total PnL', value: '+$556,400.62', detail: '+556.40% return' },
      { label: 'Max drawdown', value: '11.89%', detail: '$11,896.94 USD' },
      { label: 'Profitable trades', value: '66.88%', detail: '2,348 / 3,511 trades' },
      { label: 'Profit factor', value: '1.478', detail: 'As shown in supplied report' },
    ],
    source: 'User-supplied Agent Jin 1.1 (ADMIN VERSION) screenshot.',
    period: '2020–2026, as shown on the report axis; exact end date not supplied.',
    platform: 'TradingView-style strategy report. Execution platform not confirmed.',
    statusNote: 'Historical report; live versus backtest status has not been independently confirmed. This is a v1.1 admin report, not evidence of v3 performance.',
  },
} as const;
