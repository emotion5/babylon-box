import { Link } from 'react-router-dom';
// App.css is already imported in App.tsx, so classes are available globally

function Home() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      width: '100vw'
    }}>
      <div className="glass-card">
        <h1 style={{ margin: 0, fontSize: '2rem', color: 'var(--primary-color)' }}>Babylon Box</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Select a demo to start</p>
        
        <Link to="/glbloader" className="glass-link">
          GLB Loader
        </Link>
        <Link to="/materialdemo" className="glass-link">
          Material & Edges
        </Link>
        <Link to="/boxresizer" className="glass-link">
          Box Resizer
        </Link>
      </div>
    </div>
  );
}

export default Home;