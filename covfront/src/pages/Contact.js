import React, { useState } from 'react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // You could add actual email sending logic here (e.g., emailJS, API call)
  };

  return (
    <div className="container py-5">
      <h1 className="display-4 fw-bold mb-4 gradient-text text-center">Contactez-nous</h1>
      <p className="lead text-secondary text-center mb-5">
        Une question ? Un partenariat ? Une suggestion ? N'hésitez pas à nous écrire. Notre équipe vous répondra rapidement !
      </p>

      <div className="row g-5">
        <div className="col-lg-6">
          <div className="card p-4 shadow-sm h-100 border-0">
            <h5 className="fw-bold mb-3 text-primary">📬 Envoyez-nous un message</h5>

            {submitted ? (
              <div className="alert alert-success fw-semibold">
                ✅ Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Nom complet</label>
                  <input
                    type="text"
                    className="form-control rounded"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Votre nom"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    className="form-control rounded"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="vous@example.com"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Objet</label>
                  <input
                    type="text"
                    className="form-control rounded"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Sujet du message"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Message</label>
                  <textarea
                    className="form-control rounded"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Écrivez votre message ici..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 rounded-pill fw-semibold"
                >
                  Envoyer le message
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card p-4 shadow-sm h-100 border-0">
            <h5 className="fw-bold mb-3 text-primary">📌 Informations de contact</h5>
            <p className="mb-2">
              <strong>Email :</strong> <a href="mailto:contact@covoiturageapp.com">contact@covoiturageapp.com</a>
            </p>
            <p className="mb-2">
              <strong>Téléphone :</strong> <a href="tel:+21628402298">+216 28 402 298</a>
            </p>
            <p className="mb-4">
              <strong>Adresse :</strong> 123 Rue de l'environnement, Korba, Tunisie
            </p>
            <div className="ratio ratio-16x9 rounded overflow-hidden">
              <iframe
                src="https://www.google.com/maps?q=Korba+Tunisie&output=embed"
                title="Carte Korba"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
