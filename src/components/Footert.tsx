import { faGithub, faPaypal } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export const Footer = () => {
  return (
    <footer className="bg-dark text-center text-white">
      <hr></hr>
      <div className="container p-4">
        <section className="mb-4">
          <a
            className="btn btn-outline-light btn-floating m-1"
            href="https://github.com/egreer/beermiser.jibbermaster.com"
            role="button"
            target="_blank"
            rel="noreferrer"
          >
            <i className="fab fa-github"></i>
            <FontAwesomeIcon icon={faGithub}></FontAwesomeIcon>
          </a>
          <a
            className="btn btn-outline-light btn-floating m-1"
            href="https://www.paypal.me/egreerme"
            role="button"
            target="_blank"
            rel="noreferrer"
          >
            <FontAwesomeIcon icon={faPaypal}></FontAwesomeIcon>
          </a>
        </section>
      </div>
    </footer>
  );
};
