const Card = ({ children, className = '', onClick, hover = false }) => {
  return (
    <div 
      className={`card ${hover ? 'cursor-pointer transform hover:scale-105' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
