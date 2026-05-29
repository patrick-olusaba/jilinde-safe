import { useApp } from '../context/AppContext';
import ScreenHeader from '../components/ui/ScreenHeader';
import '../styles/PlanScreen.css';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '0',
    period: 'forever',
    badge: 'Basic',
    features: [
      { included: true, label: 'Basic SOS alert' },
      { included: true, label: '2 guardians' },
      { included: true, label: 'SMS emergency text' },
      { included: true, label: 'Alert history (7 days)' },
      { included: false, label: 'Live location tracking' },
      { included: false, label: 'Audio & video recording' },
      { included: false, label: 'Cloud evidence backup' },
      { included: false, label: 'Fake call feature' },
      { included: false, label: 'Safe timer auto-SOS' },
      { included: false, label: 'Battery/offline alerts' },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '200',
    period: 'month',
    badge: 'Most Popular',
    highlight: true,
    features: [
      { included: true, label: 'Instant SOS with live tracking' },
      { included: true, label: 'Unlimited guardians' },
      { included: true, label: 'SMS + call + WhatsApp alerts' },
      { included: true, label: 'Unlimited alert history' },
      { included: true, label: 'Live location tracking' },
      { included: true, label: 'Audio & video recording' },
      { included: true, label: 'Cloud evidence backup' },
      { included: true, label: 'Fake call feature' },
      { included: true, label: 'Safe timer auto-SOS' },
      { included: true, label: 'Battery/offline alerts' },
    ],
  },
  {
    id: 'family',
    name: 'Family',
    price: '500',
    period: 'month',
    badge: 'Best Value',
    features: [
      { included: true, label: 'Everything in Premium' },
      { included: true, label: 'Up to 5 family members' },
      { included: true, label: 'Family dashboard' },
      { included: true, label: 'Group SOS alerts' },
      { included: true, label: 'GPS family map' },
      { included: true, label: 'Shared evidence vault' },
      { included: true, label: 'Priority support' },
      { included: true, label: 'Monthly safety report' },
      { included: true, label: 'Custom SOS message per member' },
      { included: true, label: 'Admin controls for parents' },
    ],
  },
];

export default function PlanScreen() {
  const { state, upgradePlan, upgradeToFamily } = useApp();
  const current = state.user.plan;

  return (
    <div className="plan-screen">
      <ScreenHeader title="Choose Your Plan" subtitle="Everyone deserves someone watching over them" />

      <div className="plan-grid">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`plan-card${plan.highlight ? ' highlight' : ''}${current === plan.id ? ' current' : ''}`}
          >
            {plan.badge && (
              <span className={`plan-card__badge${plan.highlight ? ' gold' : ''}`}>
                {plan.badge}
              </span>
            )}

            <div className="plan-card__header">
              <h3 className="plan-card__name">{plan.name}</h3>
              <div className="plan-card__price">
                <span className="plan-card__currency">KSh</span>
                <span className="plan-card__amount">{plan.price}</span>
                <span className="plan-card__period">/{plan.period}</span>
              </div>
            </div>

            <ul className="plan-card__features">
              {plan.features.map((f) => (
                <li
                  key={f.label}
                  className={`plan-feature${f.included ? '' : ' excluded'}`}
                >
                  <span className="plan-feature__check">
                    {f.included ? '✓' : '✕'}
                  </span>
                  {f.label}
                </li>
              ))}
            </ul>

            {current === plan.id ? (
              <button className="plan-card__btn current" disabled>
                Current Plan
              </button>
            ) : (
              <button
                className={`plan-card__btn${plan.highlight ? ' gold' : ''}`}
                onClick={() => {
                  if (plan.id === 'premium') upgradePlan();
                  if (plan.id === 'family') upgradeToFamily();
                }}
              >
                {plan.id === 'free' ? 'Downgrade' : `Upgrade to ${plan.name}`}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Partnership */}
      <div className="partnership-card">
        <div className="partnership-card__icon">🤝</div>
        <div className="partnership-card__text">
          <span className="partnership-card__title">Partnerships</span>
          <span className="partnership-card__desc">
            Schools, universities, security firms, estates — contact us for bulk pricing and custom solutions.
          </span>
        </div>
      </div>
    </div>
  );
}
