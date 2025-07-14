import React from 'react';
import { Link } from 'react-router-dom';

const Carrieres = () => (
  <div className="container py-5">
    <h1 className="display-4 fw-bold mb-4 gradient-text">Carrières</h1>

    <section className="mb-5">
      <h2 className="h3 fw-bold mb-3 text-primary">Rejoignez notre équipe</h2>
      <p className="lead text-secondary">
        Chez CovoiturageApp, nous croyons que chaque trajet peut devenir une opportunité de créer du lien, de protéger la planète et de changer les habitudes de mobilité. Si vous partagez cette conviction et souhaitez contribuer à un projet innovant en pleine croissance, nous serions ravis d’apprendre à vous connaître.
      </p>
    </section>

    <section className="mb-5">
      <h2 className="h4 fw-bold mb-4 text-primary">Postes ouverts</h2>
      <ul className="list-group mb-4">
        <li className="list-group-item">
          Développeur(se) Full Stack – Vous participerez à la conception et à l’amélioration continue de notre plateforme web et mobile.
        </li>
        <li className="list-group-item">
          Responsable Marketing – Vous piloterez la stratégie de communication et contribuerez à faire connaître notre solution auprès du grand public.
        </li>
        <li className="list-group-item">
          Chargé(e) de la relation client – Vous accompagnerez nos utilisateurs et veillerez à leur satisfaction quotidienne.
        </li>
        <li className="list-group-item">
          Stagiaire Communication – Vous aiderez à créer du contenu et à animer nos réseaux sociaux.
        </li>
        <li className="list-group-item">
          Designer UI/UX – Vous concevrez des interfaces simples, élégantes et accessibles.
        </li>
      </ul>
      <p className="text-secondary">
        Si aucun poste ne correspond à votre profil, vous pouvez aussi nous adresser une candidature spontanée. Nous sommes toujours curieux de découvrir de nouveaux talents.
      </p>
    </section>

    <section className="mb-5">
      <h2 className="h4 fw-bold mb-4 text-primary">Pourquoi nous rejoindre ?</h2>
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm text-center">
            <div className="display-6 mb-3">🚀</div>
            <h5 className="card-title">Ambiance startup</h5>
            <p className="card-text text-secondary">
              Rejoignez une équipe à taille humaine où l’initiative, la créativité et la collaboration sont valorisées au quotidien. Vous aurez un impact direct sur le développement du projet.
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm text-center">
            <div className="display-6 mb-3">🌍</div>
            <h5 className="card-title">Impact positif</h5>
            <p className="card-text text-secondary">
              Chaque action contribue à rendre la mobilité plus durable et à réduire l’empreinte carbone. Ensemble, nous participons à bâtir un avenir plus responsable.
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm text-center">
            <div className="display-6 mb-3">📈</div>
            <h5 className="card-title">Évolution</h5>
            <p className="card-text text-secondary">
              Nous vous proposons un environnement stimulant et formateur, propice au développement de vos compétences et à votre épanouissement professionnel.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section className="text-center mt-5">
      <p className="mb-3 text-secondary">
        Prêt(e) à rejoindre l’aventure ? Nous avons hâte de découvrir votre parcours et vos idées.
      </p>
      <Link
        to="/postuler"
        className="btn btn-primary btn-lg px-4 rounded-pill fw-semibold"
      >
        Postuler maintenant
      </Link>
    </section>
  </div>
);

export default Carrieres;
