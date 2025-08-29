import React, { useState } from 'react';

const ProveedoresDirectory = () => {
  const navigate = () => {
    // Navegar a la página principal
    window.location.href = '/';
  };
  const [searchTerm, setSearchTerm] = useState('');
  
  const proveedores = [
    {
      id: 1,
      category: "COMPONENTES POR COLOMBIA (IMCORPSA)",
      service: "IMPRESORAS",
      icon: "🖨️",
      contacts: [
        { name: "MARCELA OCAMPO", email: "lm.ocampo@componentescolombia.com" },
        { name: "ANDRES RAMIREZ", email: "a.ramirez@componentescolombia.com", phone: "+57 317 7658206" }
      ]
    },
    {
      id: 2,
      category: "TECNOLOGIA INFORMATICA (TECINF)",
      service: "COTIZACIONES Y REPARACIONES",
      icon: "🔧",
      contacts: [
        { name: "PAOLA AMAYA", email: "pamaya@tinformatica.com", phone: "+57 314 3960268" },
        { name: "SANDRA SIERRA", email: "ssierra@tinformatica.com" },
        { name: "SERGIO URREGO", email: "salfonso@tinformatica.com", phone: "+57 300 2763075" },
        { name: "DAVID GOMEZ", email: "leondavid626@outlook.com", phone: "+57 321 2531414" }
      ]
    },
    {
      id: 3,
      category: "MANTENIMICROS",
      service: "COTIZACIONES Y REPARACIONES",
      icon: "⚙️",
      contacts: [
        { name: "GLADYS VILLAMIZAR", email: "gladys@mantenimicros.com", phone: "+57 317 4239746" }
      ]
    },
    {
      id: 4,
      category: "TRANS INTERNATIONAL COURIER (TRANSINTCO)",
      service: "ENVIOS",
      icon: "📦",
      contacts: [
        { name: "JHON PUERTA", email: "comercial@transintco.com", phone: "+57 311 5190002" }
      ]
    },
    {
      id: 5,
      category: "EVERGREEN",
      service: "SOPORTE CON SOL",
      icon: "🌲",
      contacts: [
        { name: "ALEJANDRO DIMAS", email: "alejandrodimas@evergreen-shipping.com.co", phone: "+57 318 215 3668" },
        { name: "CARLOS GARZON", email: "carlosgarzon@evergreen-shipping.com.co", phone: "+57 317 5061376" }
      ]
    },
    {
      id: 6,
      category: "INGENIERIA Y TECNOLOGIA INTEGRAL (COMSEIN)",
      service: "AIRE ACONDICIONADO DATACENTER BOGOTA",
      icon: "❄️",
      contacts: [
        { name: "SANTIAGO", email: "comseiningenieria@gmail.com", phone: "+57 320 9847005" }
      ]
    },
    {
      id: 7,
      category: "AATELCOM",
      service: "SOPORTE TECNICO BUENAVENTURA",
      icon: "🔌",
      contacts: [
        { name: "ARIS ARIAS", phone: "+57 300 6830828" }
      ]
    },
    {
      id: 8,
      category: "TECNOLOGIA Y SOLUCIONES DEL CARIBE",
      service: "SOPORTE TECNICO CARTAGENA HAPAG",
      icon: "💻",
      contacts: [
        { name: "KEVIN", email: "tyscsas@gmail.com", phone: "+57 305 3734554" }
      ]
    },
    {
      id: 9,
      category: "LT SEGURIDAD ELECTRONICA",
      service: "SOPORTE BIOMETRICO CARTAGENA HAPAG",
      icon: "🔐",
      contacts: [
        { name: "GERENCIA", email: "gerencia@ltseguridadelectronica.com", phone: "+57 318 8706147" }
      ]
    },
    {
      id: 10,
      category: "DISTRIBUIDORA REPPLICTRNCÓN",
      service: "AIRE ACONDICIONADO CARTAGENA HAPAG",
      icon: "🌡️",
      contacts: [
        { name: "JORGE AYALA", phone: "+57 350 7457159" }
      ]
    },
    {
      id: 11,
      category: "SOLUCIONES INTEGRALES DE TECNOLOGIA (SOINDETEC DR)",
      service: "SOPORTE TECNICO BARRANQUILLA",
      icon: "🛠️",
      contacts: [
        { name: "DIOSCAR ROJAS", email: "soindetec@gmail.com", phone: "+57 300 7210534" }
      ]
    },
    {
      id: 12,
      category: "IFX",
      service: "SERVICIOS TECNOLOGICOS",
      icon: "📡",
      contacts: [
        { name: "JHON GOMEZ", phone: "+57 316 5278058", alt_phone: "(601) 3693024" }
      ]
    },
    {
      id: 13,
      category: "CLARO",
      service: "TELECOMUNICACIONES",
      icon: "📱",
      contacts: [
        { name: "GINA NOVOA", email: "jgomez@ifxcorp.com", alt_email: "care@ifxcorp.com", phone: "310 2013937" }
      ]
    },
    {
      id: 14,
      category: "ETB",
      service: "TELECOMUNICACIONES",
      icon: "☎️",
      contacts: [
        { name: "LIBIA YISETH SANTOS CHARRY", email: "libia.santosc.pr@etb.com.co", phone: "6013777777" }
      ]
    },
    {
      id: 15,
      category: "TIGO",
      service: "TELECOMUNICACIONES",
      icon: "📞",
      contacts: [
        { name: "EDWIN MOVIL", email: "Edwin.Movil@tigo.com.co", phone: "+57 315 8885764" }
      ]
    },
    {
      id: 16,
      category: "DIALNET COLOMBIA S.A.",
      service: "CONTRATO DE INTERNET SANTA MARTA",
      icon: "🌐",
      contacts: [
        { name: "OSCAR EDUARDO QUINTANA", email: "comercialhogar7@dialnet.net.co", phone: "+57 301 4893601" }
      ]
    }
  ];

  const filteredProveedores = proveedores.filter(proveedor =>
    proveedor.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      {/* Header similar al de la página principal */}
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo">
              <div className="logo-icon">N</div>
              <div className="logo-text">
                <span className="logo-name">Navesoft</span>
                <span className="logo-subtitle">Tecnología y servicios</span>
              </div>
            </div>
          </div>
          

        </div>
      </header>

      {/* Main content */}
      <main className="main-content">
        <div className="content-wrapper">
          <div className="page-header">
            <h1 className="page-title">Directorio Proveedores</h1>
            <button className="back-button" onClick={() => navigate("/")}>
              ← Volver al Inicio
            </button>
          </div>

          {/* Search bar */}
          <div className="search-section">
            <div className="search-container">
              <input
                type="text"
                placeholder="Buscar proveedor o servicio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {/* Providers grid */}
          <div className="providers-grid">
            {filteredProveedores.map((proveedor) => (
              <div key={proveedor.id} className="provider-card">
                <div className="card-header">
                  <div className="icon-container">
                    <span className="provider-icon">{proveedor.icon}</span>
                  </div>
                  <div className="card-title-section">
                    <h3 className="card-title">{proveedor.category}</h3>
                    <span className="card-subtitle">{proveedor.service}</span>
                  </div>
                </div>
                
                <div className="card-content">
                  <div className="contacts-section">
                    <h4 className="contacts-title">Contactos</h4>
                    {proveedor.contacts.map((contact, index) => (
                      <div key={index} className="contact-item">
                        <div className="contact-name">{contact.name}</div>
                        {contact.email && (
                          <div className="contact-detail">
                            <span className="detail-icon">📧</span>
                            <span className="detail-text">{contact.email}</span>
                          </div>
                        )}
                        {contact.alt_email && (
                          <div className="contact-detail">
                            <span className="detail-icon">📧</span>
                            <span className="detail-text">{contact.alt_email}</span>
                          </div>
                        )}
                        {contact.phone && (
                          <div className="contact-detail">
                            <span className="detail-icon">📱</span>
                            <span className="detail-text">{contact.phone}</span>
                          </div>
                        )}
                        {contact.alt_phone && (
                          <div className="contact-detail">
                            <span className="detail-icon">☎️</span>
                            <span className="detail-text">{contact.alt_phone}</span>
                          </div>
                        )}
                        {index < proveedor.contacts.length - 1 && <div className="contact-divider"></div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          © 2025 Navesoft. Todos los derechos reservados.
        </div>
      </footer>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .app-container {
          min-height: 100vh;
          background-color: #f8fafc;
          font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
          display: flex;
          flex-direction: column;
        }

        /* Header Styles */
        .header {
          background: #304173;
          color: white;
          padding: 0 2rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 70px;
        }

        .logo-section {
          display: flex;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: #264163;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.2rem;
          color: white;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
        }

        .logo-name {
          font-size: 1.4rem;
          font-weight: 600;
          line-height: 1;
        }

        .logo-subtitle {
          font-size: 0.75rem;
          opacity: 0.8;
          line-height: 1;
        }

        /* Main Content */
        .main-content {
          flex: 1;
          padding: 2rem 0;
        }

        .content-wrapper {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 600;
          color: #2d3748;
          margin: 0;
        }

        .back-button {
          background: #304173;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(48, 65, 115, 0.2);
          font-family: inherit;
        }

        .back-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(48, 65, 115, 0.3);
          background: #264163;
        }

        /* Search Section */
        .search-section {
          margin-bottom: 3rem;
        }

        .search-container {
          max-width: 500px;
          margin: 0 auto;
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 1rem 1.5rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          background: white;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .search-input:focus {
          outline: none;
          border-color: #304173;
          box-shadow: 0 0 0 3px rgba(48, 65, 115, 0.1);
        }

        /* Providers Grid */
        .providers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .provider-card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
          border: 1px solid #e2e8f0;
        }

        .provider-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
          border-color: #304173;
        }

        .card-header {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .icon-container {
          background: #304173;
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .provider-icon {
          font-size: 1.8rem;
        }

        .card-title-section {
          flex: 1;
        }

        .card-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }

        .card-subtitle {
          font-size: 0.9rem;
          color: #304173;
          font-weight: 500;
          background: linear-gradient(135deg, #ebf4ff 0%, #dbeafe 100%);
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          display: inline-block;
          border: 1px solid rgba(48, 65, 115, 0.1);
        }

        .card-content {
          border-top: 1px solid #f1f5f9;
          padding-top: 1.5rem;
        }

        .contacts-title {
          font-size: 1rem;
          font-weight: 600;
          color: #304173;
          margin-bottom: 1rem;
        }

        .contact-item {
          margin-bottom: 1.5rem;
        }

        .contact-item:last-child {
          margin-bottom: 0;
        }

        .contact-name {
          font-size: 1rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.8rem;
        }

        .contact-detail {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-bottom: 0.5rem;
          padding: 0.5rem;
          border-radius: 6px;
          transition: background-color 0.2s ease;
        }

        .contact-detail:hover {
          background-color: #f8fafc;
        }

        .detail-icon {
          font-size: 0.9rem;
          width: 20px;
          text-align: center;
        }

        .detail-text {
          font-size: 0.9rem;
          color: #4a5568;
          word-break: break-all;
        }

        .contact-divider {
          height: 1px;
          background: linear-gradient(to right, #e2e8f0, transparent);
          margin: 1rem 0;
        }

        /* Footer */
        .footer {
          background: #304173;
          color: white;
          padding: 2rem 0;
          margin-top: auto;
        }

        .footer-content {
          text-align: center;
          font-size: 0.9rem;
          opacity: 0.9;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .providers-grid {
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .header-content {
            padding: 0 1rem;
          }

          .nav {
            gap: 1rem;
          }

          .nav-link {
            font-size: 0.9rem;
            padding: 0.4rem 0.8rem;
          }

          .content-wrapper {
            padding: 0 1rem;
          }

          .page-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .page-title {
            font-size: 2rem;
          }

          .providers-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .provider-card {
            padding: 1.5rem;
          }

          .card-header {
            flex-direction: column;
            text-align: center;
          }

          .icon-container {
            margin: 0 auto;
          }
        }

        @media (max-width: 480px) {
          .logo-text {
            display: none;
          }

          .nav {
            gap: 0.5rem;
          }

          .page-title {
            font-size: 1.8rem;
          }

          .provider-card {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ProveedoresDirectory;