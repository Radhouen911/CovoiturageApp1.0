import React from 'react';

const Terms = () => (
  <div className="container py-5">
    <h1 className="display-4 fw-bold mb-4 gradient-text">Conditions générales</h1>
    
    <div className="row">
      <div className="col-lg-12">
        <div className="mb-4">
          <h2 className="h3 fw-bold mb-3 text-primary">Conditions Générales d'Utilisation applicables à compter du 20 août 2024</h2>
        </div>

        <section className="mb-5">
          <h3 className="h4 fw-bold mb-3 text-primary">1. Objet</h3>
          <p className="text-secondary mb-3">
            CovoiturageApp édite une plateforme de covoiturage accessible sur un site internet notamment à l'adresse www.covoiturageapp.com ou sous forme d'application mobile et destinée à (i) mettre en relation des conducteurs se rendant à une destination donnée pour leur propre compte avec des passagers allant dans la même direction afin de leur permettre de partager le trajet et donc les frais qui y sont associés, (ii) rechercher et procéder à l'achat de Billets de bus auprès des opérateurs de transport (les « Autocaristes ») et à (iii) rechercher et procéder à l'achat auprès de CovoiturageApp de Billets de Train d'un opérateur de transport (les "Entreprises ferroviaires") que nous distribuons (ci-après, la « Plateforme »).
          </p>
          <p className="text-secondary mb-3">
            Les présentes Conditions Générales d'Utilisation ont pour objet d'encadrer l'accès et les modalités d'utilisation de la Plateforme. Nous vous invitons à en prendre attentivement connaissance. Vous comprenez et reconnaissez que CovoiturageApp n'est partie à aucun accord, contrat ou relation contractuelle, de quelque nature que ce soit, conclus entre les Membres de sa Plateforme ou avec un Autocariste ou Entreprise ferroviaire.
          </p>
          <p className="text-secondary">
            En cliquant sur le bouton « Connexion avec Facebook » ou « Inscription avec un e-mail » ou "Payer", vous reconnaissez avoir pris connaissance et accepter l'intégralité des présentes Conditions Générales d'Utilisation.
          </p>
        </section>

        <section className="mb-5">
          <h3 className="h4 fw-bold mb-3 text-primary">2. Définitions</h3>
          <p className="text-secondary mb-3">Dans les présentes,</p>
          
          <div className="mb-3">
            <p className="text-secondary"><strong>« Annonce »</strong> désigne indistinctement une Annonce de Covoiturage ou une Annonce de Bus ou une Annonce de Train ;</p>
            <p className="text-secondary"><strong>« Annonce de Covoiturage »</strong> désigne une annonce concernant un Trajet posté sur la Plateforme par un Conducteur ;</p>
            <p className="text-secondary"><strong>« Annonce de Bus »</strong> désigne une annonce concernant un Trajet en Bus opéré par un Autocariste publiée sur la Plateforme ;</p>
            <p className="text-secondary"><strong>"Annonce de Train"</strong> désigne une annonce concernant un Trajet en Train opéré par une Entreprise ferroviaire distribué sur la Plateforme ;</p>
            <p className="text-secondary"><strong>« Autocariste »</strong> désigne une entreprise de transport de passagers professionnelle dont les Trajets en Bus sont distribués sur la Plateforme par CovoiturageApp ;</p>
            <p className="text-secondary"><strong>« Billet »</strong> désigne le titre de transport nominatif en cours de validité remis au Client, à la suite de la Commande pour un Trajet en Bus ou en Train, constituant la preuve de l'existence d'un contrat de transport entre le Passager et l'Autocariste ou l'Entreprise ferroviaire, lequel contrat est régi par les CGV, sans préjudice d'éventuelles conditions particulières additionnelles stipulées entre le Passager et l'Autocariste ou l'Entreprise ferroviaire et visées sur le Billet ;</p>
            <p className="text-secondary"><strong>« CovoiturageApp »</strong> a la signification qui lui est donnée à l'article 1 ci-dessus ;</p>
            <p className="text-secondary"><strong>« CGU »</strong> désigne les présentes Conditions Générales d'Utilisation ;</p>
            <p className="text-secondary"><strong>« CGV »</strong> désigne les Conditions Générales de Vente de Transport de l'Autocariste concerné selon le Trajet en Bus sélectionné par le Client, et les conditions particulières applicables, accessibles sur le Site, et que le Client reconnaît avoir lues et avoir acceptées avant de passer sa Commande ;</p>
            <p className="text-secondary"><strong>« CGV Train »</strong> désigne les Conditions Générales de Vente de Transport de l'Entreprise ferroviaire (ci-après "CGV Train") concerné selon le Trajet en Train sélectionné par le Client, et les conditions particulières applicables, et que le Client reconnaît avoir lues et avoir acceptées avant de passer sa Commande ;</p>
            <p className="text-secondary"><strong>« Client »</strong> désigne toute personne physique (étant Membre ou non) ayant acheté, soit pour son compte, soit pour le compte d'un tiers qui sera le Passager, un Billet de Bus ou un Billet de Train par l'intermédiaire de la Plateforme pour effectuer un Trajet opéré par l'Autocariste ou l'Entreprise ferroviaire ;</p>
            <p className="text-secondary"><strong>« Commande »</strong> désigne l'opération par laquelle le Client réserve toutes Prestations auprès de CovoiturageApp, quel que soit le moyen de réservation employé, hors le cas de l'achat en Point de Vente, et qui emporte l'obligation pour le Client de payer le prix afférent aux Prestations concernées ;</p>
            <p className="text-secondary"><strong>« Compte »</strong> désigne le compte qui doit être créé pour pouvoir devenir Membre et accéder à certains Services proposés par la Plateforme ;</p>
            <p className="text-secondary"><strong>« Compte Facebook »</strong> a la signification qui lui est donnée à l'article 3.2 ci-dessous ;</p>
            <p className="text-secondary"><strong>« Conducteur »</strong> désigne le Membre proposant, sur la Plateforme, de transporter une autre personne physique en contrepartie de la Participation aux Frais, pour un trajet et un horaire défini par lui seul ;</p>
            <p className="text-secondary"><strong>« Confirmation de Réservation »</strong> a la signification qui lui est donnée à l'article 4.2.1 ci-dessous ;</p>
            <p className="text-secondary"><strong>« Contenu Membre »</strong> a la signification qui lui est donnée à l'article 11.2 ci-dessous ;</p>
            <p className="text-secondary"><strong>« Entreprise ferroviaire »</strong> désigne une entreprise de transport de passagers professionnelle dont les Trajets en train sont distribués sur la Plateforme ;</p>
            <p className="text-secondary"><strong>« Frais de Service »</strong> a la signification qui lui est donnée à l'article 5.2 ci-dessous ;</p>
            <p className="text-secondary"><strong>« Membre »</strong> désigne toute personne physique ayant créé un Compte sur la Plateforme ;</p>
            <p className="text-secondary"><strong>« Passager »</strong> désigne (i) le Membre ayant accepté la proposition d'être transporté par le Conducteur ou, le cas échéant, la personne pour le compte de laquelle un Membre a réservé une Place ou (ii) le Client ayant acheté un Billet auprès de l'Autocariste ou de l'Entreprise ferroviaire ou, le cas échéant, la personne pour le compte de laquelle un Client a acheté un Billet auprès de l'Autocariste ou de l'Entreprise ferroviaire ;</p>
            <p className="text-secondary"><strong>« Participation aux Frais »</strong> désigne, pour un Trajet en Covoiturage donné, la somme d'argent demandée par le Conducteur et acceptée par le Passager au titre de sa participation aux frais de déplacement ;</p>
            <p className="text-secondary"><strong>« Place »</strong> désigne la place réservée par un Client à bord du véhicule d'un Conducteur ou à bord d'un véhicule opéré par un Autocariste ou à bord d'un Train ;</p>
            <p className="text-secondary"><strong>« Plateforme »</strong> a la signification qui lui est donnée à l'article 1, ci-dessus ;</p>
            <p className="text-secondary"><strong>« Point de Vente »</strong> désigne les guichets ou bornes physiques et dans lesquels les Billets peuvent être proposés à la vente ;</p>
            <p className="text-secondary"><strong>« Prestations »</strong> désigne la ou les prestation(s) de transport souscrite(s) par le Passager d'un Trajet en Bus ou en Train et fournies par l'Autocariste ou l'Entreprise ferroviaire ;</p>
            <p className="text-secondary"><strong>« Prix »</strong> désigne, pour un Trajet en Bus ou un Trajet en Train donné, le prix toutes taxes, frais et coûts de service y afférents compris, payé par le Client sur la Plateforme, au moment de la validation de la Commande, pour une Place sur un Trajet en Bus ou un Trajet en Train donné ;</p>
            <p className="text-secondary"><strong>« Réservation »</strong> a la signification qui lui est donnée à l'article 4.2.1. ci-dessous ;</p>
            <p className="text-secondary"><strong>« Services »</strong> désigne l'ensemble des services rendus par CovoiturageApp par l'intermédiaire de la Plateforme ;</p>
            <p className="text-secondary"><strong>« Site »</strong> désigne le site internet accessible à l'adresse www.covoiturageapp.com ;</p>
            <p className="text-secondary"><strong>« Sous-Trajet »</strong> a la signification qui lui est donnée à l'article 4.1 ci-dessous ;</p>
            <p className="text-secondary"><strong>« Trajet »</strong> désigne indistinctement un Trajet en Covoiturage ou un Trajet en Bus ou un Trajet en Train ;</p>
            <p className="text-secondary"><strong>« Trajet en Covoiturage »</strong> désigne le trajet faisant l'objet d'une Annonce de Covoiturage publiée par un Conducteur sur la Plateforme et pour lequel il accepte de transporter des Passagers en contrepartie de la Participation aux Frais ;</p>
            <p className="text-secondary"><strong>« Trajet en Bus »</strong> désigne le trajet faisant l'objet d'une Annonce de Bus sur la Plateforme et pour lequel un Autocariste propose des places à bord du véhicule en contrepartie du Prix ;</p>
            <p className="text-secondary"><strong>« Trajet en Train»</strong> désigne le trajet faisant l'objet d'une Annonce de Train sur la Plateforme et pour lequel CovoiturageApp propose des places.</p>
          </div>
        </section>

        <section className="mb-5">
          <h3 className="h4 fw-bold mb-3 text-primary">3. Inscription à la Plateforme et création de Compte</h3>
          
          <div className="mb-4">
            <h4 className="h5 fw-bold mb-2 text-primary">3.1. Conditions d'inscription à la Plateforme</h4>
            <p className="text-secondary">
              L'utilisation de Plateforme est réservée aux personnes physiques âgées de 18 ans ou plus. Toute inscription sur la Plateforme par une personne mineure est strictement interdite. En accédant, utilisant ou vous inscrivant sur la Plateforme, vous déclarez et garantissez avoir 18 ans ou plus.
            </p>
          </div>

          <div className="mb-4">
            <h4 className="h5 fw-bold mb-2 text-primary">3.2. Création de Compte</h4>
            <p className="text-secondary mb-3">
              La Plateforme permet aux Membres de publier des Annonces de Covoiturage et consulter des Annonces ainsi que d'interagir entre eux pour la réservation de Place. Vous pouvez consulter les Annonces même si vous n'êtes pas inscrit sur la Plateforme. En revanche, vous ne pouvez ni publier une Annonce de Covoiturage ni réserver une Place dans un covoiturage sans avoir, au préalable, créé un Compte et être devenu Membre.
            </p>
            <p className="text-secondary mb-3">
              Pour créer votre Compte, vous pouvez :
            </p>
            <ul className="text-secondary mb-3">
              <li>soit remplir l'ensemble des champs obligatoires figurant sur le formulaire d'inscription ;</li>
              <li>soit vous connecter, via notre Plateforme, à votre compte Facebook (ci-après, votre « Compte Facebook »). En utilisant une telle fonctionnalité, vous comprenez que CovoiturageApp aura accès, publiera sur la Plateforme et conservera certaines informations de votre Compte Facebook.</li>
            </ul>
            <p className="text-secondary">
              Pour vous inscrire sur la Plateforme, vous devez avoir lu et accepter les présentes CGU.
            </p>
          </div>
        </section>

        <section className="mb-5">
          <h3 className="h4 fw-bold mb-3 text-primary">4. Utilisation des Services</h3>
          
          <div className="mb-4">
            <h4 className="h5 fw-bold mb-2 text-primary">4.1. Publication des Annonces de Covoiturage</h4>
            <p className="text-secondary mb-3">
              En tant que Membre, et sous réserve que vous remplissiez les conditions ci-dessous, vous pouvez créer et publier des Annonces de Covoiturage sur la Plateforme en indiquant des informations quant au Trajet en Covoiturage que vous comptez effectuer (dates/heures et lieux de départ et d'arrivée, nombre de places offertes, options proposées, montant de la Participation aux Frais, etc.).
            </p>
            <p className="text-secondary">
              Vous n'êtes autorisé à publier une Annonce de Covoiturage que si vous remplissez l'ensemble des conditions suivantes :
            </p>
            <ul className="text-secondary">
              <li>vous êtes titulaire d'un permis de conduire valide ;</li>
              <li>vous ne proposez des Annonces de Covoiturage que pour des véhicules dont vous êtes le propriétaire ou que vous utilisez avec l'autorisation expresse du propriétaire ;</li>
              <li>vous êtes et demeurez le conducteur principal du véhicule, objet de l'Annonce de Covoiturage ;</li>
              <li>le véhicule bénéficie d'une assurance au tiers valide ;</li>
              <li>vous n'avez aucune contre-indication ou incapacité médicale à conduire ;</li>
              <li>le véhicule que vous comptez utiliser pour le Trajet est une voiture de tourisme à 4 roues, disposant d'un maximum de 7 places assises ;</li>
              <li>vous êtes un consommateur et n'agissez pas à titre professionnel.</li>
            </ul>
          </div>

          <div className="mb-4">
            <h4 className="h5 fw-bold mb-2 text-primary">4.2. Réservation d'une Place</h4>
            <p className="text-secondary mb-3">
              CovoiturageApp a mis en place un système de réservation de Places en ligne (la « Réservation ») pour les Trajets proposés sur la Plateforme.
            </p>
            <p className="text-secondary">
              Les modalités de réservation d'une Place dépendent de la nature du Trajet envisagé.
            </p>
          </div>
        </section>

        <section className="mb-5">
          <h3 className="h4 fw-bold mb-3 text-primary">5. Conditions financières</h3>
          <p className="text-secondary mb-3">
            L'accès et l'inscription à la Plateforme, de même que la recherche, la consultation et la publication d'Annonces sont gratuits. En revanche, la Réservation est payante dans les conditions décrites ci-dessous.
          </p>
          
          <div className="mb-4">
            <h4 className="h5 fw-bold mb-2 text-primary">5.1. Participation aux Frais et Prix</h4>
            <p className="text-secondary mb-3">
              Dans le cadre d'un Trajet en Covoiturage, le montant de la Participation aux Frais est déterminé par vous, en tant que Conducteur, sous votre seule responsabilité. Il est strictement interdit de tirer le moindre bénéfice du fait de l'utilisation de notre Plateforme.
            </p>
            <p className="text-secondary">
              En ce qui concerne les Trajets en Bus ou en Train, le Prix par Place est fixé à sa seule discrétion par l'Autocariste ou l'Entreprise ferroviaire.
            </p>
          </div>

          <div className="mb-4">
            <h4 className="h5 fw-bold mb-2 text-primary">5.2. Frais de Service</h4>
            <p className="text-secondary">
              CovoiturageApp peut prélever, en contrepartie de l'utilisation de la Plateforme, des frais de service à ses utilisateurs (ci-après, les « Frais de Service »). L'utilisateur sera informé avant toute application de Frais de Service le cas échéant.
            </p>
          </div>
        </section>

        <section className="mb-5">
          <h3 className="h4 fw-bold mb-3 text-primary">6. Finalité non commerciale et non professionnelle</h3>
          <p className="text-secondary mb-3">
            Vous vous engagez à n'utiliser les Services et la Plateforme que pour être mis en relation, à titre non professionnel et non commercial, avec des personnes souhaitant partager un Trajet en Covoiturage avec vous ou pour réserver une Place dans le cadre d'un Trajet en Bus ou en Train.
          </p>
          <p className="text-secondary">
            En tant que Conducteur, vous vous engagez à ne pas demander une Participation aux Frais supérieure aux frais que vous supportez réellement et susceptible de vous faire générer un bénéfice.
          </p>
        </section>

        <section className="mb-5">
          <h3 className="h4 fw-bold mb-3 text-primary">7. Politique d'annulation</h3>
          <p className="text-secondary mb-3">
            Seuls les Trajets en Covoiturage font l'objet de la présente politique d'annulation, CovoiturageApp n'offrant aucune garantie, de quelque nature que ce soit, en cas d'annulation, pour quelque raison que ce soit.
          </p>
          <p className="text-secondary">
            L'annulation d'une Place d'un Trajet en Covoiturage par le Conducteur ou le Passager après la Confirmation de Réservation est soumise aux stipulations spécifiques détaillées dans nos conditions complètes.
          </p>
        </section>

        <section className="mb-5">
          <h3 className="h4 fw-bold mb-3 text-primary">8. Comportement des utilisateurs de la Plateforme</h3>
          <p className="text-secondary mb-3">
            Vous reconnaissez être seul responsable du respect de l'ensemble des lois, règlements et obligations applicables à votre utilisation de la Plateforme.
          </p>
          <p className="text-secondary">
            Par ailleurs, en utilisant la Plateforme et lors des Trajets, vous vous engagez à respecter les règles de bonne conduite et les obligations spécifiques aux Conducteurs et Passagers.
          </p>
        </section>

        <section className="mb-5">
          <h3 className="h4 fw-bold mb-3 text-primary">9. Restrictions et suspension</h3>
          <p className="text-secondary mb-3">
            Vous avez la possibilité de mettre fin à votre relation contractuelle avec CovoiturageApp à tout moment, sans frais et sans motif.
          </p>
          <p className="text-secondary">
            En cas de violation de votre part des présentes CGU, CovoiturageApp se réserve la possibilité de suspendre votre Compte, limiter votre accès aux Services ou résilier les présentes CGU.
          </p>
        </section>

        <section className="mb-5">
          <h3 className="h4 fw-bold mb-3 text-primary">10. Données personnelles</h3>
          <p className="text-secondary">
            Dans le cadre de votre utilisation de la Plateforme, CovoiturageApp est amenée à collecter et traiter certaines de vos données personnelles tel que cela est décrit dans sa Politique de Confidentialité.
          </p>
        </section>

        <section className="mb-5">
          <h3 className="h4 fw-bold mb-3 text-primary">11. Contact</h3>
          <p className="text-secondary">
            Pour toute question concernant ces conditions générales, vous pouvez nous contacter à l'adresse suivante : <a href="mailto:contact@covoiturageapp.com" className="text-primary">contact@covoiturageapp.com</a>.
          </p>
        </section>
      </div>
    </div>
  </div>
);

export default Terms; 