import { faGithub, faPaypal } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export const Footer = () => {
  return (
    <footer className="bg-dark text-center text-white">
      <hr></hr>
      <div className="container p-4">
        <section className="mb-4">
          <p>
            <em>
              Like what you see? Consider buying me a beer to help support
              future development by donating at{" "}
              <a
                href="https://www.paypal.me/egreerme"
                target="_blank"
                rel="noreferrer"
                title="Buy me a beer!"
              >
                paypal.me/egreerme
              </a>
            </em>
          </p>
          <a
            className="btn btn-outline-light btn-floating m-1"
            href="https://github.com/egreer/beermiser.jibbermaster.com"
            role="button"
            target="_blank"
            rel="noreferrer"
            title="Explore source code at Github"
          >
            <FontAwesomeIcon icon={faGithub}></FontAwesomeIcon>
          </a>
          <a
            className="btn btn-outline-light btn-floating m-1"
            href="https://www.paypal.me/egreerme"
            role="button"
            target="_blank"
            rel="noreferrer"
            title="Donate at Paypal"
          >
            <FontAwesomeIcon icon={faPaypal}></FontAwesomeIcon>
          </a>
        </section>
      </div>
    </footer>
  );
};
