import React from 'react';

const APropos = () => (
  <div className="container py-5">
    <h1 className="display-4 fw-bold mb-4 gradient-text">À propos</h1>

    <section className="mb-5">
      <h2 className="h3 fw-bold mb-3 text-primary">Qui sommes-nous ?</h2>
      <p className="lead text-secondary">
        CovoiturageApp est bien plus qu'une simple plateforme de mobilité. C’est un projet né de l’envie de repenser la manière dont nous nous déplaçons au quotidien. Nous croyons fermement que le partage de trajets peut transformer positivement nos habitudes de transport : il permet non seulement de réduire les coûts et les émissions de CO₂, mais aussi de créer des liens humains, de favoriser l'entraide et de redonner du sens à chaque trajet.
      </p>
    </section>

    <section className="mb-5">
      <h2 className="h4 fw-bold mb-4 text-primary">Notre histoire</h2>
      <ul className="timeline list-unstyled">
        <li className="mb-4">
          <div className="fw-bold">2025</div>
          <div className="text-secondary">
            Nous avons commencé cette aventure avec une simple idée, une volonté forte de répondre à un besoin réel. Sans modèle tout fait ni solution clé en main, nous avons construit CovoiturageApp depuis zéro, ligne par ligne, fonctionnalité par fonctionnalité. Cela a été un processus long, exigeant et enrichissant. Nous avons fait face à des défis techniques, des choix de conception et des nuits de réflexion, mais toujours avec une motivation intacte. Aujourd'hui, nous sommes fiers de vous présenter le fruit de ce travail passionné : le lancement officiel de notre application, prête à accompagner vos trajets dès les premiers kilomètres.
          </div>
        </li>
      </ul>
    </section>

    <section>
      <h2 className="h4 fw-bold mb-4 text-primary">Fonctionnalités clés</h2>
      <div className="row g-4">
        <div className="col-md-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <div className="display-6 mb-3">🔒</div>
              <h5 className="card-title">Sécurité</h5>
              <p className="card-text text-secondary">
                Chaque utilisateur est vérifié et noté pour garantir une expérience fiable et rassurante. Vos trajets sont entre de bonnes mains, grâce à un système d’évaluation transparent et à des profils certifiés.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <div className="display-6 mb-3">💬</div>
              <h5 className="card-title">Communication</h5>
              <p className="card-text text-secondary">
                Une messagerie intégrée permet aux conducteurs et passagers d’échanger avant, pendant ou après le trajet. Organisez les détails, posez vos questions, et voyagez en toute clarté.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <div className="display-6 mb-3">⚡</div>
              <h5 className="card-title">Rapidité</h5>
              <p className="card-text text-secondary">
                Trouvez ou proposez un trajet en quelques clics seulement. Grâce à notre interface intuitive, vous gagnez du temps à chaque étape de la réservation.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <div className="display-6 mb-3">✨</div>
              <h5 className="card-title">Simplicité d’utilisation</h5>
              <p className="card-text text-secondary">
                Une interface claire et conviviale pensée pour tous : que vous soyez conducteur ou passager, la prise en main est rapide et agréable. Nous avons voulu une expérience fluide pour que réserver ou proposer un trajet devienne un geste quotidien simple et efficace.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default APropos;
