import React from 'react';

interface Props {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

const ScreenHeader: React.FC<Props> = ({ title, subtitle, centered = true }) => (
  <div className={`screen-header${centered ? ' screen-header--centered' : ''}`}>
    <h1 className="screen-header__title">{title}</h1>
    {subtitle && <p className="screen-header__subtitle">{subtitle}</p>}
  </div>
);

export default ScreenHeader;
