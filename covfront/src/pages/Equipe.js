import React from 'react';
import faresImg from '../assets/images/fares.jpg';
import oumeymaImg from '../assets/images/oumeyma.jpg';

const team = [
  {
    name: 'Oumeyma Laajimi',
    role: 'Co-fondatrice & Responsable Produit',
    img: oumeymaImg,
    bio: `Oumeyma pilote la vision produit et l’expérience utilisateur avec passion. Véritable force créative, elle s’assure que chaque fonctionnalité de CovoiturageApp réponde aux besoins réels des utilisateurs tout en restant intuitive et agréable à utiliser. Toujours à l’écoute des retours de la communauté, elle est déterminée à faire du covoiturage une alternative pratique, écologique et humaine.`,
    linkedin: 'https://www.linkedin.com/in/oumeyma-laajimi-5179561a2/'
  },
  {
    name: 'Fares Afdhal',
    role: 'Co-fondateur & Développeur Full Stack',
    img: faresImg,
    bio: `Fares conçoit et développe l’architecture technique de CovoiturageApp. Ingénieur passionné par la tech et la mobilité durable, il s’investit pour proposer une plateforme fiable, performante et sécurisée. Son objectif : rendre le covoiturage accessible à tous grâce à un service moderne et fluide, capable d’accompagner des milliers de trajets quotidiens.`,
    linkedin: 'https://www.linkedin.com/in/fares-afdhal-367576214/'
  }
];

const Equipe = () => (
  <div className="container py-5">
    <h1 className="display-4 fw-bold mb-5 gradient-text text-center">Notre équipe</h1>
    <div className="row justify-content-center g-4">
      {team.map((member, idx) => (
        <div className="col-md-5" key={idx}>
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body text-center">
              <img
                src={member.img}
                alt={member.name}
                className="rounded-circle mb-3"
                style={{
                  width: 140,
                  height: 140,
                  objectFit: 'cover',
                  border: '4px solid var(--primary-color)'
                }}
              />
              <h4 className="fw-bold mb-1">{member.name}</h4>
              <h6 className="text-primary mb-3">{member.role}</h6>
              <p className="text-secondary">{member.bio}</p>
              <a
                href={member.linkedin}
                className="btn btn-outline-primary btn-sm rounded-pill mt-3"
                target="_blank"
                rel="noopener noreferrer"
              >
                Voir le profil LinkedIn
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="text-center mt-5">
      <h5 className="fw-bold text-primary">Envie de nous rejoindre ?</h5>
      <p className="text-secondary">
        Nous sommes toujours à la recherche de passionnés pour faire grandir CovoiturageApp et promouvoir une mobilité plus responsable.
      </p>
      <a href="/contact" className="btn btn-primary rounded-pill">
        Contactez-nous
      </a>
    </div>
  </div>
);

export default Equipe;
