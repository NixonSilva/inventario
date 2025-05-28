
// import { useAuth } from '../AuthContext';
import "../styles/Footer.css"

function Footer() {
 
    return (
        <footer className="footer border-top-blue">
                <div className="height-space-min"></div>
                <div className="row border-top-blue pt-4" style={{ height: '50px' }}>
                    <div className="col-12 d-flex align-items-center justify-content-center">
                        <p className="derechos-footer"> Navemar</p>
                    </div>
            </div>
        </footer>
    );
}
 
export default Footer;