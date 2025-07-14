import React from 'react';

const Presse = () => {
  const handleDownloadKit = () => {
    // Créer un lien temporaire pour le téléchargement
    const link = document.createElement('a');
    link.href = '/kit-media-covoiturageapp.zip'; // Chemin vers le fichier ZIP du kit média
    link.download = 'kit-media-covoiturageapp.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container py-5">
      <h1 className="display-4 fw-bold mb-4 gradient-text">Presse</h1>

      <section className="mb-5">
        <p className="lead text-secondary">
          Bienvenue dans notre espace presse. Vous trouverez ici nos communiqués officiels, les informations essentielles sur notre projet et les moyens de nous contacter pour toute demande ou collaboration. Nous nous tenons à votre disposition pour partager notre vision d'une mobilité plus durable et solidaire.
        </p>
      </section>

      <section className="mb-5">
        <h2 className="h3 fw-bold mb-3 text-primary">Communiqués de presse</h2>
        <ul className="list-group mb-4">
          <li className="list-group-item">
            <h5 className="fw-bold mb-1">Lancement de CovoiturageApp – Janvier 2025</h5>
            <p className="text-secondary mb-0">
              Après des mois de développement intensif, CovoiturageApp annonce son lancement officiel. Cette plateforme vise à faciliter le partage de trajets, réduire l'empreinte carbone et renforcer les liens sociaux grâce à une expérience simple et intuitive. Nous invitons les médias à relayer cette initiative qui propose une alternative concrète et engagée à la mobilité individuelle.
            </p>
          </li>
          <li className="list-group-item">
            <h5 className="fw-bold mb-1">Notre vision pour la mobilité durable – Mars 2025</h5>
            <p className="text-secondary mb-0">
              CovoiturageApp dévoile sa stratégie pour promouvoir le covoiturage au quotidien. Notre mission : rendre le transport plus responsable et plus accessible grâce à des fonctionnalités adaptées et une communauté engagée. Ce communiqué détaille nos engagements environnementaux et sociaux pour les mois à venir.
            </p>
          </li>
        </ul>
      </section>

      <section className="mb-5">
        <h2 className="h4 fw-bold mb-4 text-primary">Contact presse</h2>
        <div className="card shadow-sm p-4">
          <p className="text-secondary mb-2">
            Pour toute demande d'interview, de reportage ou d'informations complémentaires, n'hésitez pas à nous contacter. Nous nous engageons à répondre rapidement à toutes les sollicitations des médias.
          </p>
          <p className="mb-2">
            <strong>Email :</strong> <a href="mailto:presse@covoiturageapp.com">presse@covoiturageapp.com</a>
          </p>
          <p className="mb-0">
            <strong>Téléphone :</strong> +216 28 402 298
          </p>
        </div>
      </section>

      <section className="text-center mt-5">
        <p className="mb-3 text-secondary">
          Vous souhaitez en savoir plus ? Téléchargez notre kit média pour découvrir l'identité visuelle de CovoiturageApp, nos visuels officiels et nos éléments de communication.
        </p>
        <button 
          onClick={handleDownloadKit}
          className="btn btn-gradient btn-lg px-4 rounded-pill fw-semibold"
        >
          Télécharger le kit média
        </button>
      </section>

      {/* Styles pour le bouton gradient */}
      <style>{`
        .btn-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff !important;
          border: none;
          font-weight: 600;
          font-size: 1.1rem;
          border-radius: 2rem;
          padding: 0.75rem 2.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
        }
        .btn-gradient:hover, .btn-gradient:focus {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
          color: #fff !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .btn-gradient:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default Presse;
