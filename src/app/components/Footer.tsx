import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer style={{ borderTop: '1px solid var(--foreground-color)', position: 'sticky', bottom: 0 }}>
      <p>&copy; {currentYear} Noah Wright. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
