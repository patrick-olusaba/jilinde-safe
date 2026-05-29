import React from 'react';

interface Props {
  icon?: string;
  children: React.ReactNode;
  variant?: 'gold' | 'default';
}

const InfoBox: React.FC<Props> = ({ icon = '💡', children, variant = 'gold' }) => (
  <div className={`info-box${variant === 'default' ? ' info-box--default' : ''}`}>
    <span className="info-box__icon">{icon}</span>
    <p className="info-box__text">{children}</p>
  </div>
);

export default InfoBox;
