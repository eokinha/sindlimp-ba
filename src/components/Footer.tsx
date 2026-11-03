import Icon from "./Icon";
import Logo from "./Logo";
import { PHONE, SOCIAL } from "./site";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="container footer-main__grid">
          <div className="footer-widget">
            <h4 className="widget-title">SINDILIMP</h4>
            <p>Sindicato dos trabalhadores e trabalhadoras da limpeza pública e terceirizados da Bahia</p>
            <p>
              Endereço:
              <br />
              Rua Cônego Pereira, 51 – Sede própria - Bairro: Sete Portas – Salvador-BA
            </p>
            <div className="footer-badges">
              <a href={SOCIAL.facebook} aria-label="Facebook" target="_blank" rel="noreferrer">
                <Icon name="facebook" size={20} />
              </a>
              <a href={SOCIAL.instagram} aria-label="Instagram" target="_blank" rel="noreferrer">
                <Icon name="instagram" size={20} />
              </a>
            </div>
          </div>
          <div className="footer-widget">
            <div className="contact-area">
              <span className="contact-icon">
                <Icon name="mail" />
              </span>
              <span className="contact-info">
                <span className="text">E-mail</span>
                <span className="title">sindilimp_ba@hotmail.com</span>
              </span>
            </div>
            <div className="contact-area">
              <span className="contact-icon">
                <Icon name="phone" />
              </span>
              <a href="tel:+557130328550" className="contact-info">
                <span className="text">Nosso Telefone</span>
                <span className="title">{PHONE}</span>
              </a>
            </div>
          </div>
        </div>
        <span className="footer-whatsapp" aria-hidden="true">
          <Icon name="whatsapp" size={28} />
        </span>
      </div>
      <div className="footer-copyright">
        <div className="container footer-copyright__grid">
          <Logo light />
          <div className="footer-copyright__social">
            <a href={SOCIAL.facebook} aria-label="Facebook" target="_blank" rel="noreferrer">
              <Icon name="facebook" size={14} />
            </a>
            <a href={SOCIAL.instagram} aria-label="Instagram" target="_blank" rel="noreferrer">
              <Icon name="instagram" size={14} />
            </a>
          </div>
          <div className="copyright-text">
            Copyright © 2026 Sindlimp - Todos os Direitos Reservados
          </div>
        </div>
      </div>
    </footer>
  );
}
