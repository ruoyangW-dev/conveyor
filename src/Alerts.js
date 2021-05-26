import React from 'react'

export const Alerts = ({ alerts, dismissAlert }) => (
  <div className="alerts conv-alerts">
    {alerts.map((alert, idx) => (
      <div
        key={`alert-${idx}`}
        className={`alert fade show alert-${alert.type}`}
        role="alert"
      >
        {alert.message}
        <button
          type="button"
          className="close"
          aria-label="Close"
          onClick={() => dismissAlert(alert)}
        >
          &times;
        </button>
      </div>
    ))}
  </div>
)

export default Alerts
