import React from 'react';

const ProveedoresDirectory = () => {
  const proveedores = [
    {
      id: 1,
      icon: "🖨️",
      title: "COMPONENTES POR COLOMBIA",
      subtitle: "IMPRESORAS",
      contacts: [
        { name: "MARCELA OCAMPO", email: "lm.ocampo@componentescolombia.com" },
        { name: "ANDRES RAMIREZ", email: "a.ramirez@componentescolombia.com", phone: "+57 317 7658206" }
      ]
    },
    {
      id: 2,
      icon: "💻",
      title: "TECNOLOGIA INFORMATICA",
      subtitle: "COTIZACIONES Y REPARACIONES",
      contacts: [
        { name: "PAOLA AMAYA", email: "pamaya@tinformatica.com", phone: "+57 314 3960268" },
        { name: "SANDRA SIERRA", email: "ssierra@tinformatica.com" },
        { name: "SERGIO URREGO", email: "salfonso@tinformatica.com", phone: "+57 300 2763075" },
        { name: "DAVID GOMEZ", email: "leondavid626@outlook.com", phone: "+57 321 2531414" }
      ]
    },
    {
      id: 3,
      icon: "🔧",
      title: "MANTENIMICROS",
      subtitle: "COTIZACIONES Y REPARACIONES",
      contacts: [
        { name: "GLADYS VILLAMIZAR", email: "gladys@mantenimicros.com", phone: "+57 317 4239746" }
      ]
    },
    {
      id: 4,
      icon: "📦",
      title: "TRANS INTERNATIONAL COURIER",
      subtitle: "ENVIOS",
      contacts: [
        { name: "JHON PUERTA", email: "comercial@transintco.com", phone: "+57 311 5190002" }
      ]
    },
    {
      id: 5,
      icon: "🚢",
      title: "EVERGREEN",
      subtitle: "SOPORTE CON SOL",
      contacts: [
        { name: "ALEJANDRO DIMAS", email: "alejandrodimas@evergreen-shipping.com.co", phone: "+57 318 215 3668" },
        { name: "CARLOS GARZON", email: "carlosgarzon@evergreen-shipping.com.co", phone: "+57 317 5061376" }
      ]
    },
    {
      id: 6,
      icon: "❄️",
      title: "INGENIERIA Y TECNOLOGIA INTEGRAL",
      subtitle: "AIRE ACONDICIONADO DATACENTER",
      contacts: [
        { name: "SANTIAGO", email: "comseiningenieria@gmail.com", phone: "+57 320 9847005" }
      ]
    },
    {
      id: 7,
      icon: "🛠️",
      title: "AATELCOM",
      subtitle: "SOPORTE TECNICO BUENAVENTURA",
      contacts: [
        { name: "ARIS ARIAS", phone: "+57 300 6830828" }
      ]
    },
    {
      id: 8,
      icon: "🏝️",
      title: "TECNOLOGIA Y SOLUCIONES DEL CARIBE",
      subtitle: "SOPORTE TECNICO CARTAGENA",
      contacts: [
        { name: "KEVIN", email: "tyscsas@gmail.com", phone: "+57 305 3734554" }
      ]
    },
    {
      id: 9,
      icon: "🔒",
      title: "LT SEGURIDAD ELECTRONICA",
      subtitle: "SOPORTE BIOMETRICO CARTAGENA",
      contacts: [
        { name: "GERENCIA", email: "gerencia@ltseguridadelectronica.com", phone: "+57 318 8706147" }
      ]
    },
    {
      id: 10,
      icon: "🌡️",
      title: "DISTRIBUIDORA REPPLICTRNCÓN",
      subtitle: "AIRE ACONDICIONADO CARTAGENA",
      contacts: [
        { name: "JORGE AYALA", phone: "+57 350 7457159" }
      ]
    },
    {
      id: 11,
      icon: "⚙️",
      title: "SOINDETEC DR",
      subtitle: "SOPORTE TECNICO BARRANQUILLA",
      contacts: [
        { name: "DIOSCAR ROJAS", email: "soindetec@gmail.com", phone: "+57 300 7210534" }
      ]
    },
    {
      id: 12,
      icon: "📡",
      title: "IFX",
      subtitle: "SERVICIOS TECNOLOGICOS",
      contacts: [
        { name: "JHON GOMEZ", phone: "+57 316 5278058", alt_phone: "(601) 3693024" }
      ]
    },
    {
      id: 13,
      icon: "📱",
      title: "CLARO",
      subtitle: "TELECOMUNICACIONES",
      contacts: [
        { name: "GINA NOVOA", email: "jgomez@ifxcorp.com", alt_email: "care@ifxcorp.com", phone: "310 2013937" }
      ]
    },
    {
      id: 14,
      icon: "☎️",
      title: "ETB",
      subtitle: "TELECOMUNICACIONES",
      contacts: [
        { name: "LIBIA YISETH SANTOS CHARRY", email: "libia.santosc.pr@etb.com.co", phone: "6013777777" }
      ]
    },
    {
      id: 15,
      icon: "📞",
      title: "TIGO",
      subtitle: "TELECOMUNICACIONES",
      contacts: [
        { name: "EDWIN MOVIL", email: "Edwin.Movil@tigo.com.co", phone: "+57 315 8885764" }
      ]
    },
    {
      id: 16,
      icon: "🌐",
      title: "DIALNET COLOMBIA S.A.",
      subtitle: "INTERNET SANTA MARTA",
      contacts: [
        { name: "OSCAR EDUARDO QUINTANA", email: "comercialhogar7@dialnet.net.co", phone: "+57 301 4893601" }
      ]
    }
  ];

  return (
    <div className="container">
      <main className="main">
        <h1 className="title">Directorio de Proveedores</h1>
        
        <div className="grid">
          {proveedores.map((proveedor) => (
            <div key={proveedor.id} className="card">
              <div className="card-icon">
                {proveedor.icon}
              </div>
              <h3 className="card-title">{proveedor.title}</h3>
              <p className="card-subtitle">{proveedor.subtitle}</p>
              
              <div className="contacts">
                {proveedor.contacts.map((contact, index) => (
                  <div key={index} className="contact">
                    <div className="contact-name">{contact.name}</div>
                    {contact.email && (
                      <div className="contact-email">{contact.email}</div>
                    )}
                    {contact.alt_email && (
                      <div className="contact-email">{contact.alt_email}</div>
                    )}
                    {contact.phone && (
                      <div className="contact-phone">{contact.phone}</div>
                    )}
                    {contact.alt_phone && (
                      <div className="contact-phone">{contact.alt_phone}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .container {
          min-height: 100vh;
          background: #ffffff;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          position: relative;
        }

        .main {
          padding: 3rem 2rem;
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .title {
          text-align: center;
          font-size: 3rem;
          color: #0d47a1;
          margin-bottom: 4rem;
          font-weight: 700;
          text-shadow: 0 2px 4px rgba(13, 71, 161, 0.2);
          letter-spacing: 1px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
          padding: 1rem 0;
        }

        .card {
          background: linear-gradient(145deg, #ffffff 0%, #f8faff 100%);
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: 0 8px 32px rgba(13, 71, 161, 0.15);
          transition: all 0.4s ease;
          cursor: pointer;
          border: 2px solid rgba(25, 118, 210, 0.1);
          position: relative;
          overflow: hidden;
        }

        .card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #0d47a1, #1565c0, #1976d2, #2196f3);
        }

        .card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 48px rgba(13, 71, 161, 0.25);
          border-color: rgba(25, 118, 210, 0.3);
        }

        .card-icon {
          font-size: 3.5rem;
          text-align: center;
          margin-bottom: 1.5rem;
          background: linear-gradient(45deg, #1565c0, #2196f3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 2px 4px rgba(25, 118, 210, 0.3));
        }

        .card-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #0d47a1;
          text-align: center;
          margin-bottom: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .card-subtitle {
          font-size: 1rem;
          color: #1565c0;
          text-align: center;
          margin-bottom: 2rem;
          font-weight: 600;
          padding: 0.5rem 1rem;
          background: rgba(25, 118, 210, 0.1);
          border-radius: 20px;
          border: 1px solid rgba(25, 118, 210, 0.2);
        }

        .contacts {
          border-top: 2px solid rgba(25, 118, 210, 0.2);
          padding-top: 1.5rem;
          background: linear-gradient(135deg, rgba(248, 250, 255, 0.8) 0%, rgba(232, 245, 255, 0.8) 100%);
          border-radius: 12px;
          padding: 1.5rem;
          margin-top: 1rem;
        }

        .contact {
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: white;
          border-radius: 10px;
          border-left: 4px solid #2196f3;
          box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
          transition: all 0.3s ease;
        }

        .contact:hover {
          transform: translateX(5px);
          box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
        }

        .contact:last-child {
          margin-bottom: 0;
        }

        .contact-name {
          font-weight: 700;
          color: #0d47a1;
          font-size: 1rem;
          margin-bottom: 0.5rem;
          text-transform: capitalize;
          letter-spacing: 0.3px;
        }

        .contact-email {
          font-size: 0.9rem;
          color: #1565c0;
          margin-bottom: 0.3rem;
          word-break: break-all;
          background: rgba(33, 150, 243, 0.1);
          padding: 0.3rem 0.6rem;
          border-radius: 6px;
          font-weight: 500;
        }

        .contact-phone {
          font-size: 0.9rem;
          color: #1976d2;
          margin-bottom: 0.3rem;
          font-weight: 600;
          background: rgba(25, 118, 210, 0.1);
          padding: 0.3rem 0.6rem;
          border-radius: 6px;
        }

        @media (max-width: 768px) {
          .title {
            font-size: 2.5rem;
            margin-bottom: 3rem;
          }

          .grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .main {
            padding: 2rem 1rem;
          }

          .card {
            padding: 2rem;
          }

          .card-icon {
            font-size: 3rem;
          }

          .card-title {
            font-size: 1.1rem;
          }

          .contacts {
            padding: 1rem;
          }

          .contact {
            padding: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ProveedoresDirectory;