const Alert = ({ className, message }) => {
    const [visible, setVisible] = useState(true);
  
    useEffect(() => {
      const timeout = setTimeout(() => {
        setVisible(false);
      }, 5000);
  
      return () => {
        clearTimeout(timeout);
      };
    }, []);
  
    return (
      visible && (
        <div className={`alert alert-${className} slide-in-bottom-left`} role="alert">
          <strong>{message}</strong>
          <div className="bottom-bar" />
        </div>
      )
    );
  };
  
  export default Alert;
  