import React, { useState, createContext, useEffect } from 'react';
import Alert from './Alert'; // Importiere die Alert-Komponente

const AlertContext = createContext(); // Erstelle den Kontext

const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const setAlert = (type, message) => {
    const newAlert = { id: Date.now(), type, message };
    setAlerts(prevAlerts => {
      const updatedAlerts = [...prevAlerts, newAlert].slice(-5); // Maximal 5 Alerts anzeigen
      return updatedAlerts;
    });
  };

  const removeAlert = id => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (alerts.length > 0) {
        removeAlert(alerts[0].id);
      }
    }, 5000); // Entferne den ältesten Alert nach 5 Sekunden
    return () => clearInterval(timer);
  }, [alerts]);

  return (
    <AlertContext.Provider value={{ setAlert }}>
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: '9999' }}>
        {alerts.map(alert => (
          <Alert
            key={alert.id}
            className={alert.type}
            message={alert.message}
            onClose={() => removeAlert(alert.id)}
          />
        ))}
      </div>
      {children}
    </AlertContext.Provider>
  );
};

export { AlertProvider, AlertContext };
