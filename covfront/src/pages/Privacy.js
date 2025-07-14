import React from 'react';

const Privacy = () => (
  <div className="container py-5">
    <h1 className="display-4 fw-bold mb-4 gradient-text">Politique de confidentialité</h1>
    
    <div className="mb-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="/terms" className="text-decoration-none">Conditions Générales</a></li>
          <li className="breadcrumb-item active" aria-current="page">Politique de Confidentialité</li>
          <li className="breadcrumb-item"><a href="/cookies" className="text-decoration-none">Utilisation des Cookies</a></li>
          <li className="breadcrumb-item"><a href="/terms" className="text-decoration-none">Conditions Générales Super Driver</a></li>
        </ol>
      </nav>
    </div>

    <div className="row">
      <div className="col-lg-12">
        <div className="mb-4">
          <h2 className="h3 fw-bold mb-3 text-primary">Version applicable à compter du 17 février 2025</h2>
        </div>

        <section className="mb-5">
          <h3 className="h4 fw-bold mb-3 text-primary">1. Généralités</h3>
          <p className="text-secondary mb-3">
            CovoiturageApp (dont le siège social est situé au 123 Rue de l'environnement, Korba, Tunisie) attache une grande importance à la protection et au respect de votre vie privée.
          </p>
          <p className="text-secondary mb-3">
            CovoiturageApp édite une plateforme de covoiturage accessible sur un site internet ou sous forme d'application mobile, destinée à (i) mettre en relation des conducteurs se rendant à une destination donnée pour leur propre compte avec des passagers allant dans la même direction afin de leur permettre de partager le trajet et donc les frais qui y sont associés, (ii) rechercher et procéder à l'achat de Billets de Bus auprès d'opérateurs de bus (les « Autocaristes ») et à (iii) rechercher et procéder à l'achat auprès de CovoiturageApp de Billets de Train des opérateurs de train (les "Entreprises Ferroviaires") que nous distribuons (ci-après, la « Plateforme »).
          </p>
          <p className="text-secondary mb-3">
            CovoiturageApp agit en tant que responsable de traitement concernant la collecte, l'utilisation et le partage des informations que vous êtes amenés à nous fournir par le biais de la Plateforme.
          </p>
          <p className="text-secondary">
            Cette Politique de Confidentialité (ainsi que nos Conditions générales d'utilisation et tout document auquel il y est fait référence ainsi que notre Politique en matière de cookies) présente la manière dont nous traitons les données personnelles que nous recueillons et que vous nous fournissez. Nous vous invitons à lire attentivement le présent document pour connaître et comprendre nos pratiques quant aux traitements de vos données personnelles que nous mettons en œuvre.
          </p>
        </section>

        <section className="mb-5">
          <h3 className="h4 fw-bold mb-3 text-primary">2. Les informations que nous recueillons</h3>
          <p className="text-secondary mb-3">Nous sommes susceptibles de recueillir et de traiter les données suivantes :</p>
          
          <div className="mb-4">
            <h4 className="h5 fw-bold mb-2 text-primary">2.1. Les informations que vous nous transmettez directement</h4>
            <p className="text-secondary mb-3">
              En utilisant notre Plateforme, vous êtes amenés à nous transmettre des informations, dont certaines sont de nature à vous identifier ou à identifier les passagers pour lesquels vous effectuez des réservations (« Données Personnelles »). C'est notamment le cas lorsque vous remplissez des formulaires (comme par exemple le formulaire d'inscription), lorsque vous participez à l'un de nos jeux, concours, offres promotionnelles, études ou sondages, lorsque vous nous contactez – que ce soit par téléphone, email ou tout autre moyen de communication – ou lorsque vous nous faites part d'un problème concernant l'utilisation de notre Plateforme.
            </p>
            <p className="text-secondary mb-3">Ces informations contiennent notamment les données suivantes :</p>
            
            <div className="mb-3">
              <h5 className="h6 fw-bold mb-2 text-primary">2.1.1. Les données nécessaires à l'inscription et à la fourniture du service :</h5>
              <ul className="text-secondary">
                <li><strong>Création d'un compte :</strong> Vos nom et prénom, adresse e-mail, date de naissance, mot de passe sont obligatoires pour la création d'un compte sur la Plateforme.</li>
                <li><strong>Réservation et/ou publication d'un trajet en covoiturage :</strong> Votre numéro de téléphone est nécessaire pour la publication ou la réservation d'un trajet en covoiturage.</li>
                <li><strong>Réservation d'un Billet de Bus :</strong> Vous pouvez réserver un billet de bus via votre compte ou uniquement avec votre adresse email. Les informations relatives aux passagers (nom, prénom et date de naissance) sont obligatoires.</li>
                <li><strong>Réservation d'un Billet de Train :</strong> Vous pouvez réserver un billet de train via votre compte ou uniquement avec votre adresse email et votre numéro de téléphone. Les informations relatives aux passagers (nom, prénom, date de naissance et numéro du papier d'identité pour une réservation en Espagne) sont obligatoires.</li>
              </ul>
            </div>

            <div className="mb-3">
              <h5 className="h6 fw-bold mb-2 text-primary">2.1.2. Autres données collectées :</h5>
              <ul className="text-secondary">
                <li>Une photographie publiée sur votre profil</li>
                <li>Une adresse postale</li>
                <li>Votre mini-biographie</li>
                <li>Votre genre lorsque vous renseignez ces informations</li>
                <li>Une copie de tous les échanges écrits intervenus entre vous et CovoiturageApp</li>
                <li>Une copie de l'ensemble des réservations ou des publications effectuées sur notre Plateforme</li>
                <li>Le détail des opérations financières ou comptables effectuées sur notre Plateforme</li>
                <li>Le détail de vos visites sur notre Plateforme et des contenus auxquels vous avez accédé</li>
                <li>Vos réponses à nos sondages et questionnaires et les avis que vous avez laissés</li>
                <li>Les données liées à votre localisation</li>
                <li>Une copie de votre passeport, votre carte d'identité ou tout autre document similaire</li>
              </ul>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="h5 fw-bold mb-2 text-primary">2.2. Les données que nous recueillons automatiquement</h4>
            <p className="text-secondary mb-3">
              Lors de chacune de vos visites, nous sommes susceptibles de recueillir, conformément à la législation applicable et avec votre accord, le cas échéant, des informations relatives aux appareils sur lesquels vous utilisez nos services ou aux réseaux depuis lesquels vous accédez à nos services, tels que notamment vos adresses IP, données de connexion, types et versions de navigateurs internet utilisés, types et versions des plugins de votre navigateur, systèmes et plateformes d'exploitation, données concernant votre parcours de navigation sur notre Plateforme.
            </p>
            <p className="text-secondary">
              Parmi les technologies utilisées pour recueillir ces informations, nous avons notamment recours aux cookies (pour en savoir plus à ce sujet, veuillez vous référer à notre Politique en matière de cookies).
            </p>
          </div>

          <div className="mb-4">
            <h4 className="h5 fw-bold mb-2 text-primary">2.3. Durée de conservation de vos données</h4>
            <p className="text-secondary mb-3">
              A l'exception des catégories de Données Personnelles visées ci-dessous, vos Données Personnelles sont archivées à l'issue des périodes suivantes :
            </p>
            <ul className="text-secondary">
              <li>5 ans après votre dernière utilisation de notre Plateforme, si vous n'avez pas fermé votre compte</li>
              <li>30 jours après la fermeture de votre compte, sauf si vous avez reçu un avis négatif ou un signalement, auquel cas vos données sont conservées pendant 2 ans suivant la fermeture de votre compte</li>
            </ul>
            <p className="text-secondary">
              Les données financières sont conservées pour la durée requise par les lois applicables en matière fiscale et comptable (par exemple, les documents et pièces comptables sont conservés jusqu'à 10 ans).
            </p>
          </div>
        </section>

        <section className="mb-5">
          <h3 className="h4 fw-bold mb-3 text-primary">3. Comment utilisons-nous les données que nous recueillons ?</h3>
          <p className="text-secondary mb-3">
            Nous mettons en œuvre différents traitements portant sur vos données personnelles, dont les finalités et bases légales sont détaillées ci-après :
          </p>
          
          <div className="table-responsive mb-4">
            <table className="table table-bordered">
              <thead className="table-primary">
                <tr>
                  <th>FINALITÉS</th>
                  <th>FONDEMENT LÉGAL</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Vous permettre d'utiliser la Plateforme et exécuter les contrats conclus entre vous et nous</td>
                  <td>Ce traitement est nécessaire à l'exécution de nos obligations contractuelles respectives.</td>
                </tr>
                <tr>
                  <td>Percevoir vos paiements et vous transmettre les sommes qui vous sont dues</td>
                  <td>Ce traitement est nécessaire à l'exécution de nos obligations contractuelles respectives et à la conformité avec nos obligations légales.</td>
                </tr>
                <tr>
                  <td>Vous permettre de personnaliser votre profil sur notre Plateforme</td>
                  <td>Ce traitement est réalisé sur la base de votre consentement. Vous pouvez à tout moment retirer votre consentement.</td>
                </tr>
                <tr>
                  <td>Vous permettre de communiquer et d'échanger avec les autres membres</td>
                  <td>Ce traitement est nécessaire à l'exécution de nos obligations contractuelles respectives.</td>
                </tr>
                <tr>
                  <td>Gestion du Service Client et amélioration de nos services</td>
                  <td>Ce traitement est fondé sur notre intérêt légitime (vous fournir un support client de qualité).</td>
                </tr>
                <tr>
                  <td>Lutte contre la fraude et respect des CGU</td>
                  <td>Ce traitement est fondé sur notre intérêt légitime (éviter tout contournement des règles en vigueur).</td>
                </tr>
                <tr>
                  <td>Communications marketing et publicitaires</td>
                  <td>Ce traitement est fondé sur votre consentement ou notre intérêt légitime selon les cas.</td>
                </tr>
                <tr>
                  <td>Amélioration et sécurisation de notre Plateforme</td>
                  <td>Ce traitement est fondé sur notre intérêt légitime (assurer la sécurité et améliorer nos services).</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-5">
          <h3 className="h4 fw-bold mb-3 text-primary">4. Qui sont les destinataires des informations que nous recueillons ?</h3>
          <p className="text-secondary mb-3">
            Nous partageons vos données personnelles avec les destinataires suivants :
          </p>
          
          <div className="mb-3">
            <h4 className="h5 fw-bold mb-2 text-primary">4.1. Membres de notre communauté</h4>
            <p className="text-secondary">
              Dans le cadre de l'utilisation de nos services, certaines de vos informations sont transmises aux autres membres de notre communauté par l'intermédiaire de votre profil public ou dans le cadre du processus de réservation.
            </p>
          </div>

          <div className="mb-3">
            <h4 className="h5 fw-bold mb-2 text-primary">4.2. Autocaristes et Entreprises Ferroviaires</h4>
            <p className="text-secondary">
              Nous partageons vos données personnelles avec les Autocaristes et les Entreprises Ferroviaires aux fins de l'exécution des prestations de transport. Dans ces cas-là, les Autocaristes et les Entreprises Ferroviaires agissent en tant que responsables de traitement distincts.
            </p>
          </div>

          <div className="mb-3">
            <h4 className="h5 fw-bold mb-2 text-primary">4.3. Autorités publiques</h4>
            <p className="text-secondary">
              Nous pouvons divulguer des informations vous concernant aux tribunaux, aux autorités policières, aux douanes, aux autorités gouvernementales ou publiques, aux autorités fiscales, ou à des tiers autorisés, si et dans la mesure où nous avons l'obligation légale de le faire.
            </p>
          </div>

          <div className="mb-3">
            <h4 className="h5 fw-bold mb-2 text-primary">4.4. Prestataires de services</h4>
            <p className="text-secondary">
              Nous travaillons avec des prestataires de services qui peuvent avoir accès à vos Données Personnelles, notamment pour les prestations techniques, services de paiement, vérification d'identité, centres de relation client ou encore les fournisseurs de solutions analytiques.
            </p>
          </div>
        </section>

        <section className="mb-5">
          <h3 className="h4 fw-bold mb-3 text-primary">5. Comment utilisons-nous et modérons nous vos messages ?</h3>
          <p className="text-secondary mb-3">
            Nous pouvons prendre connaissance des messages que vous échangez avec d'autres membres de notre communauté via notre Plateforme notamment à des fins de prévention des fraudes, d'amélioration de nos services, d'assistance utilisateur, de vérification du respect par nos membres des contrats conclus avec nous.
          </p>
          <p className="text-secondary">
            Nous ne prenons jamais connaissance de vos communications avec d'autres membres de notre communauté à des fins promotionnelles ou de ciblage publicitaire.
          </p>
        </section>

        <section className="mb-5">
          <h3 className="h4 fw-bold mb-3 text-primary">6. Publicité ciblée en ligne</h3>
          <p className="text-secondary mb-3">
            Conformément à la législation applicable et avec votre consentement lorsqu'il est requis, nous pourrons utiliser les données que vous nous fournissez sur notre Plateforme pour vous afficher des publicités ciblées sur les plateformes de médias sociaux ou des sites tiers, selon votre profil et en fonction de vos intérêts ou activités sur notre plateforme.
          </p>
          <p className="text-secondary">
            Vous pouvez vous opposer à tout moment à ce traitement en configurant les paramètres relatifs à la publicité de votre compte directement sur la plateforme dudit réseau social ou en nous contactant.
          </p>
        </section>

        <section className="mb-5">
          <h3 className="h4 fw-bold mb-3 text-primary">7. Vos données sont-elles transférées, comment et où ?</h3>
          <p className="text-secondary mb-3">
            En règle générale, nous conservons vos Données Personnelles au sein de l'Union Européenne. Cependant, dans la mesure où certains de nos prestataires de service sont situés dans des pays en dehors de l'Union Européenne (« Pays Tiers »), nous transférons certaines de vos Données Personnelles dans des Pays Tiers.
          </p>
          <p className="text-secondary">
            Dans un tel cas, nous nous assurons que ce transfert soit effectué en conformité avec la réglementation applicable et garantisse un niveau de protection suffisant de la vie privée et des droits fondamentaux des personnes.
          </p>
        </section>

        <section className="mb-5">
          <h3 className="h4 fw-bold mb-3 text-primary">8. Quels sont vos droits sur vos données personnelles ?</h3>
          <p className="text-secondary mb-3">Vous disposez des droits suivants :</p>
          
          <ul className="text-secondary mb-3">
            <li><strong>Droit d'accès :</strong> Vous disposez du droit de recevoir une copie de vos Données Personnelles en notre possession.</li>
            <li><strong>Droit de retrait du consentement :</strong> Pour les activités de traitement effectuées sur la base de votre consentement, vous pouvez retirer votre consentement à tout moment.</li>
            <li><strong>Droit d'effacement et de rectification :</strong> Vous pouvez demander l'effacement de vos Données Personnelles ainsi que la rectification des Données Personnelles erronées ou obsolètes.</li>
            <li><strong>Droit d'opposition :</strong> Vous disposez du droit de vous opposer à tout moment au traitement de vos Données Personnelles à des fins de marketing direct, ou à d'autres traitements effectués sur le fondement de notre intérêt légitime.</li>
            <li><strong>Droit à la limitation :</strong> Vous disposez du droit de limiter les traitements effectués sur vos Données Personnelles.</li>
            <li><strong>Droit à la portabilité :</strong> Vous disposez du droit de recevoir les Données Personnelles que vous nous avez fournis dans un format structuré et de les transmettre à un autre responsable du traitement.</li>
            <li><strong>Droit de réclamation :</strong> Vous disposez du droit d'introduire une réclamation auprès de l'autorité de contrôle compétente.</li>
          </ul>
          
          <p className="text-secondary">
            Pour exercer ces droits, vous pouvez contacter notre Délégué à la Protection des Données Personnelles selon les modalités définies à l'article 14 ci-dessous.
          </p>
        </section>

        <section className="mb-5">
          <h3 className="h4 fw-bold mb-3 text-primary">9. Cookies et technologies semblables</h3>
          <p className="text-secondary">
            Pour en savoir plus, consultez notre <a href="/cookies" className="text-primary">Politique en matière de Cookies</a>.
          </p>
        </section>

        <section className="mb-5">
          <h3 className="h4 fw-bold mb-3 text-primary">10. Confidentialité de votre mot de passe</h3>
          <p className="text-secondary mb-3">
            Vous êtes responsable de la confidentialité du mot de passe que vous avez choisi pour accéder à votre compte sur notre Plateforme.
          </p>
          <p className="text-secondary">
            Vous vous engagez à conserver ce mot de passe secret et à ne le communiquer à personne.
          </p>
        </section>

        <section className="mb-5">
          <h3 className="h4 fw-bold mb-3 text-primary">11. Liens vers d'autres sites internet et réseaux sociaux</h3>
          <p className="text-secondary">
            Notre Plateforme peut occasionnellement contenir des liens vers les sites internet de nos partenaires ou de sociétés tierces. Veuillez noter que ces sites internet ont leur propre politique de confidentialité et que nous déclinons toute responsabilité quant à l'utilisation faite par ces sites des informations collectées lorsque vous cliquez sur ces liens.
          </p>
        </section>

        <section className="mb-5">
          <h3 className="h4 fw-bold mb-3 text-primary">12. Modification de notre Politique de Confidentialité</h3>
          <p className="text-secondary">
            Nous pouvons être amenés à modifier occasionnellement la présente Politique de Confidentialité. Lorsque cela est nécessaire, nous vous en informerons et/ou solliciterons votre accord. Nous vous conseillons de consulter régulièrement cette page pour prendre connaissance des éventuelles modifications ou mises à jour apportées à notre Politique de Confidentialité.
          </p>
        </section>

        <section className="mb-5">
          <h3 className="h4 fw-bold mb-3 text-primary">13. Contact</h3>
          <p className="text-secondary">
            Pour toute question relative à la présente Politique de Confidentialité ou pour toute demande relative à vos Données Personnelles, vous pouvez nous contacter en adressant un email à notre délégué à la protection des données à l'adresse <a href="mailto:contact@covoiturageapp.com" className="text-primary">contact@covoiturageapp.com</a> ou en nous adressant un courrier à l'adresse mentionnée en tête du présent document.
          </p>
        </section>
      </div>
    </div>
  </div>
);

export default Privacy; 