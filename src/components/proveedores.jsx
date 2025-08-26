import React from 'react';
import { useNavigate } from 'react-router-dom';

  
const ProveedoresDirectory = () => {
    const navigate = useNavigate();
  const proveedores = [
    {
      id: 1,
      category: "COMPONENTES POR COLOMBIA (IMCORPSA)",
      service: "IMPRESORAS",
      contacts: [
        { name: "MARCELA OCAMPO", email: "lm.ocampo@componentescolombia.com" },
        { name: "ANDRES RAMIREZ", email: "a.ramirez@componentescolombia.com", phone: "+57 317 7658206" }
      ]
    },
    {
      id: 2,
      category: "TECNOLOGIA INFORMATICA (TECINF)",
      service: "COTIZACIONES Y REPARACIONES",
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
      contacts: [
        { name: "GLADYS VILLAMIZAR", email: "gladys@mantenimicros.com", phone: "+57 317 4239746" }
      ]
    },
    {
      id: 4,
      category: "TRANS INTERNATIONAL COURIER (TRANSINTCO)",
      service: "ENVIOS",
      contacts: [
        { name: "JHON PUERTA", email: "comercial@transintco.com", phone: "+57 311 5190002" }
      ]
    },
    {
      id: 5,
      category: "EVERGREEN",
      service: "SOPORTE CON SOL",
      contacts: [
        { name: "ALEJANDRO DIMAS", email: "alejandrodimas@evergreen-shipping.com.co", phone: "+57 318 215 3668" },
        { name: "CARLOS GARZON", email: "carlosgarzon@evergreen-shipping.com.co", phone: "+57 317 5061376" }
      ]
    },
    {
      id: 6,
      category: "INGENIERIA Y TECNOLOGIA INTEGRAL (COMSEIN)",
      service: "AIRE ACONDICIONADO DATACENTER BOGOTA",
      contacts: [
        { name: "SANTIAGO", email: "comseiningenieria@gmail.com", phone: "+57 320 9847005" }
      ]
    },
    {
      id: 7,
      category: "AATELCOM",
      service: "SOPORTE TECNICO BUENAVENTURA",
      contacts: [
        { name: "ARIS ARIAS", phone: "+57 300 6830828" }
      ]
    },
    {
      id: 8,
      category: "TECNOLOGIA Y SOLUCIONES DEL CARIBE",
      service: "SOPORTE TECNICO CARTAGENA HAPAG",
      contacts: [
        { name: "KEVIN", email: "tyscsas@gmail.com", phone: "+57 305 3734554" }
      ]
    },
    {
      id: 9,
      category: "LT SEGURIDAD ELECTRONICA",
      service: "SOPORTE BIOMETRICO CARTAGENA HAPAG",
      contacts: [
        { name: "GERENCIA", email: "gerencia@ltseguridadelectronica.com", phone: "+57 318 8706147" }
      ]
    },
    {
      id: 10,
      category: "DISTRIBUIDORA REPPLICTRNCÓN",
      service: "AIRE ACONDICIONADO CARTAGENA HAPAG",
      contacts: [
        { name: "JORGE AYALA", phone: "+57 350 7457159" }
      ]
    },
    {
      id: 11,
      category: "SOLUCIONES INTEGRALES DE TECNOLOGIA (SOINDETEC DR)",
      service: "SOPORTE TECNICO BARRANQUILLA",
      contacts: [
        { name: "DIOSCAR ROJAS", email: "soindetec@gmail.com", phone: "+57 300 7210534" }
      ]
    },
    {
      id: 12,
      category: "IFX",
      service: "SERVICIOS TECNOLOGICOS",
      contacts: [
        { name: "JHON GOMEZ", phone: "+57 316 5278058", alt_phone: "(601) 3693024" }
      ]
    },
    {
      id: 13,
      category: "CLARO",
      service: "TELECOMUNICACIONES",
      contacts: [
        { name: "GINA NOVOA", email: "jgomez@ifxcorp.com", alt_email: "care@ifxcorp.com", phone: "310 2013937" }
      ]
    },
    {
      id: 14,
      category: "ETB",
      service: "TELECOMUNICACIONES",
      contacts: [
        { name: "LIBIA YISETH SANTOS CHARRY", email: "libia.santosc.pr@etb.com.co", phone: "6013777777" }
      ]
    },
    {
      id: 15,
      category: "TIGO",
      service: "TELECOMUNICACIONES",
      contacts: [
        { name: "EDWIN MOVIL", email: "Edwin.Movil@tigo.com.co", phone: "+57 315 8885764" }
      ]
    },
    {
      id: 16,
      category: "DIALNET COLOMBIA S.A.",
      service: "CONTRATO DE INTERNET SANTA MARTA",
      contacts: [
        { name: "OSCAR EDUARDO QUINTANA", email: "comercialhogar7@dialnet.net.co", phone: "+57 301 4893601" }
      ]
    }
  ];

  return (
    <div className="container">
      <div className="header-section">
        <h1 className="main-title">DIRECTORIO DE PROVEEDORES</h1>
        <div className="divider"></div>
        <button className="back-button" onClick={() => navigate("/")}>
          ← Volver al Inicio
        </button>
      </div>
      
      <div className="content">
        {proveedores.map((proveedor) => (
          <div key={proveedor.id} className="provider-section">
            <div className="provider-header">
              <h2 className="provider-name">{proveedor.category}</h2>
              <span className="service-type">{proveedor.service}</span>
            </div>
            
            <div className="contacts-grid">
              {proveedor.contacts.map((contact, index) => (
                <div key={index} className="contact-card">
                  <div className="contact-name">{contact.name}</div>
                  <div className="contact-details">
                    {contact.email && (
                      <div className="contact-item">
                        <span className="label">Email:</span>
                        <span className="value">{contact.email}</span>
                      </div>
                    )}
                    {contact.alt_email && (
                      <div className="contact-item">
                        <span className="label">Email Alt:</span>
                        <span className="value">{contact.alt_email}</span>
                      </div>
                    )}
                    {contact.phone && (
                      <div className="contact-item">
                        <span className="label">Teléfono:</span>
                        <span className="value">{contact.phone}</span>
                      </div>
                    )}
                    {contact.alt_phone && (
                      <div className="contact-item">
                        <span className="label">Tel. Alt:</span>
                        <span className="value">{contact.alt_phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .container {
          min-height: 100vh;
          background: #ffffff;
          font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
          color: #2c3e50;
          line-height: 1.6;
        }

        .header-section {
          padding: 60px 40px 40px;
          text-align: center;
          background: linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%);
          border-bottom: 1px solid #e1e8ed;
          position: relative;
          overflow: hidden;
        }

        .header-section::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at center, rgba(49, 130, 206, 0.03) 0%, transparent 70%);
          pointer-events: none;
        }

        .main-title {
          font-size: 2.5rem;
          font-weight: 400;
          color: #1a202c;
          letter-spacing: 2px;
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
        }

        .divider {
          width: 80px;
          height: 3px;
          background: linear-gradient(90deg,  #304173, #4299e1);
          margin: 0 auto 30px;
          border-radius: 2px;
          box-shadow: 0 2px 4px rgba(49, 130, 206, 0.2);
        }

        .back-button {
          background: linear-gradient(135deg,  #304173 0%, #4299e1 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(49, 130, 206, 0.2);
          position: relative;
          z-index: 1;
          font-family: inherit;
        }

        .back-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(49, 130, 206, 0.3);
          background: linear-gradient(135deg, #2c5aa0 0%,  #304173 100%);
        }

        .back-button:active {
          transform: translateY(0);
          box-shadow: 0 2px 6px rgba(49, 130, 206, 0.2);
        }

        .content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 40px;
          position: relative;
        }

        .provider-section {
          margin-bottom: 60px;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 50px;
          position: relative;
        }

        .provider-section::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(180deg,  #304173, #4299e1);
          border-radius: 2px;
        }

        .provider-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }

        .provider-header {
          margin-bottom: 30px;
          padding-left: 20px;
          position: relative;
        }

        .provider-name {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          position: relative;
        }

        .service-type {
          font-size: 0.9rem;
          color:  #304173;
          font-weight: 500;
          background: linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%);
          padding: 8px 18px;
          border-radius: 25px;
          display: inline-block;
          border: 1px solid rgba(49, 130, 206, 0.1);
          box-shadow: 0 2px 4px rgba(49, 130, 206, 0.1);
        }

        .contacts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
          padding-left: 20px;
        }

        .contact-card {
          background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 28px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .contact-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg,  #304173, #4299e1, #63b3ed);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }

        .contact-card:hover {
          border-color:  #304173;
          box-shadow: 0 8px 25px rgba(49, 130, 206, 0.12);
          transform: translateY(-2px);
        }

        .contact-card:hover::before {
          transform: scaleX(1);
        }

        .contact-name {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 20px;
          text-transform: capitalize;
          position: relative;
          padding-bottom: 12px;
        }

        .contact-name::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 30px;
          height: 2px;
          background: #cbd5e0;
          border-radius: 1px;
        }

        .contact-details {
          space-y: 12px;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 14px;
          gap: 12px;
          padding: 8px 12px;
          border-radius: 6px;
          transition: background-color 0.2s ease;
        }

        .contact-item:hover {
          background-color: #f7fafc;
        }

        .contact-item:last-child {
          margin-bottom: 0;
        }

        .label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #718096;
          min-width: 75px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          position: relative;
          padding-left: 16px;
        }

        .label::before {
          content: '•';
          position: absolute;
          left: 0;
          color:  #304173;
          font-weight: bold;
        }

        .value {
          font-size: 0.9rem;
          color: #2d3748;
          word-break: break-all;
          flex: 1;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .header-section {
            padding: 40px 20px 30px;
          }

          .main-title {
            font-size: 2rem;
          }

          .back-button {
            padding: 10px 20px;
            font-size: 0.9rem;
          }

          .content {
            padding: 40px 20px;
          }

          .content::before {
            display: none;
          }

          .provider-section {
            margin-bottom: 40px;
            padding-bottom: 30px;
          }

          .provider-section::before {
            width: 3px;
          }

          .provider-header {
            padding-left: 16px;
          }

          .provider-name {
            font-size: 1.2rem;
          }

          .contacts-grid {
            grid-template-columns: 1fr;
            gap: 16px;
            padding-left: 16px;
          }

          .contact-card {
            padding: 20px;
          }

          .contact-item {
            flex-direction: column;
            gap: 4px;
            padding: 6px 8px;
          }

          .label {
            min-width: auto;
            padding-left: 12px;
          }
        }

        @media (max-width: 480px) {
          .header-section {
            padding: 30px 16px 20px;
          }

          .main-title {
            font-size: 1.7rem;
            letter-spacing: 1px;
          }

          .back-button {
            padding: 8px 16px;
            font-size: 0.85rem;
          }

          .content {
            padding: 30px 16px;
          }

          .provider-header {
            padding-left: 12px;
          }

          .contacts-grid {
            padding-left: 12px;
          }

          .contact-card {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProveedoresDirectory;