import React from 'react';

const CentreAide = () => (
  <div className="container py-5">
    <h1 className="display-4 fw-bold mb-4 gradient-text">Centre d'aide</h1>

    <section className="mb-5">
      <p className="lead text-secondary">
        Besoin d’un coup de main ? Vous êtes au bon endroit ! Notre centre d’aide est là pour répondre à vos questions et vous accompagner à chaque étape. Explorez nos questions fréquentes ou contactez notre équipe si vous avez besoin d’assistance supplémentaire.
      </p>
    </section>

    <section className="mb-5">
      <h2 className="h4 fw-bold mb-4 text-primary">Questions fréquentes</h2>
      <div className="accordion" id="faqAccordion">
        <div className="accordion-item">
          <h2 className="accordion-header" id="faq1">
            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1" aria-expanded="true" aria-controls="collapse1">
              Comment réserver un trajet ?
            </button>
          </h2>
          <div id="collapse1" className="accordion-collapse collapse show" aria-labelledby="faq1" data-bs-parent="#faqAccordion">
            <div className="accordion-body">
              Pour réserver un trajet, recherchez l’itinéraire souhaité via notre moteur de recherche, sélectionnez l’annonce qui vous convient, cliquez sur « Réserver » et suivez les étapes indiquées. Vous recevrez ensuite une confirmation par email et dans votre espace personnel.
            </div>
          </div>
        </div>

        <div className="accordion-item">
          <h2 className="accordion-header" id="faq2">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2" aria-expanded="false" aria-controls="collapse2">
              Comment contacter un conducteur ?
            </button>
          </h2>
          <div id="collapse2" className="accordion-collapse collapse" aria-labelledby="faq2" data-bs-parent="#faqAccordion">
            <div className="accordion-body">
              Vous pouvez contacter le conducteur directement depuis l’annonce ou votre page de réservation grâce à la messagerie intégrée. Posez vos questions et convenez des détails avant le départ.
            </div>
          </div>
        </div>

        <div className="accordion-item">
          <h2 className="accordion-header" id="faq3">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse3" aria-expanded="false" aria-controls="collapse3">
              Que faire en cas de problème ?
            </button>
          </h2>
          <div id="collapse3" className="accordion-collapse collapse" aria-labelledby="faq3" data-bs-parent="#faqAccordion">
            <div className="accordion-body">
              Rendez-vous sur la page « Signaler un problème » pour nous décrire la situation. Notre équipe examinera votre demande et vous répondra rapidement avec une solution adaptée.
            </div>
          </div>
        </div>

        <div className="accordion-item">
          <h2 className="accordion-header" id="faq4">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse4" aria-expanded="false" aria-controls="collapse4">
              Comment créer un compte ?
            </button>
          </h2>
          <div id="collapse4" className="accordion-collapse collapse" aria-labelledby="faq4" data-bs-parent="#faqAccordion">
            <div className="accordion-body">
              Cliquez sur « S’inscrire » en haut de la page, remplissez les informations demandées et validez votre email. Vous pourrez ensuite accéder à toutes les fonctionnalités de l’application.
            </div>
          </div>
        </div>

        <div className="accordion-item">
          <h2 className="accordion-header" id="faq5">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse5" aria-expanded="false" aria-controls="collapse5">
              Comment modifier mon profil ?
            </button>
          </h2>
          <div id="collapse5" className="accordion-collapse collapse" aria-labelledby="faq5" data-bs-parent="#faqAccordion">
            <div className="accordion-body">
              Accédez à votre espace personnel et cliquez sur « Modifier mon profil » pour mettre à jour vos informations personnelles, votre photo ou vos préférences de notification.
            </div>
          </div>
        </div>

        <div className="accordion-item">
          <h2 className="accordion-header" id="faq6">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse6" aria-expanded="false" aria-controls="collapse6">
              Comment laisser un avis ?
            </button>
          </h2>
          <div id="collapse6" className="accordion-collapse collapse" aria-labelledby="faq6" data-bs-parent="#faqAccordion">
            <div className="accordion-body">
              Après un trajet effectué, rendez-vous sur la page de vos réservations terminées et cliquez sur « Laisser un avis » pour partager votre expérience avec la communauté.
            </div>
          </div>
        </div>

        <div className="accordion-item">
          <h2 className="accordion-header" id="faq7">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse7" aria-expanded="false" aria-controls="collapse7">
              Comment annuler une réservation ?
            </button>
          </h2>
          <div id="collapse7" className="accordion-collapse collapse" aria-labelledby="faq7" data-bs-parent="#faqAccordion">
            <div className="accordion-body">
              Pour annuler, rendez-vous sur votre page de réservation et cliquez sur « Annuler ». Suivez les instructions pour confirmer l’annulation. Des conditions spécifiques peuvent s’appliquer selon le délai avant le départ.
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="text-center mt-5">
      <p className="mb-3 text-secondary">
        Vous n’avez pas trouvé la réponse à votre question ? Notre équipe reste à votre disposition pour vous aider et vous répondre dans les meilleurs délais.
      </p>
      <a href="/contact" className="btn btn-primary btn-lg px-4 rounded-pill fw-semibold">
        Contacter le support
      </a>
    </section>
  </div>
);

export default CentreAide;
