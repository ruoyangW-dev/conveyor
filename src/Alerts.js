import React from 'react'

export const Alerts = ({ alerts, dismissAlert }) => (
  <div className='alerts'>
    {alerts.map((alert, idx) => (
      <div
        key={`alert-${idx}`}
        className={`conv-alert alert-${alert.type}`} role='alert'
      >
        {alert.message}
        <button type='button' aria-label='Close' onClick={() => dismissAlert(alert)}>&times;</button>
      </div>
    ))}
  </div>
)

export default Alerts
