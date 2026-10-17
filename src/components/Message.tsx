import { Alert } from 'react-bootstrap';

const Message = ({ variant = 'info', children, className }: { variant?: string; children: React.ReactNode; className?: string }) => (
    <Alert variant={variant} className={className}>{children}</Alert>
  );
  
export default Message;
