import { AppProvider } from './context/AppContext';
import AppShell from './components/layout/AppShell';
import './styles/global.css';
import './components/layout/layout.css';
import './components/ui/ui.css';
import './styles/App.css';

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
