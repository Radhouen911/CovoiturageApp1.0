import React, { useState } from 'react';

const SignalerProbleme = () => {
  const [form, setForm] = useState({ email: '', description: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici, tu peux ajouter une vraie gestion (API, envoi email, etc.)
    setSubmitted(true);
  };

  return (
    <div className="container py-5">
      <h1 className="display-4 fw-bold mb-4 gradient-text text-center">Signaler un problème</h1>

      {submitted ? (
        <div className="alert alert-success text-center fs-5">
          <strong>Merci pour votre signalement !</strong><br />
          Notre équipe examine votre demande et reviendra vers vous dans les plus brefs délais.
        </div>
      ) : (
        <form
          className="card p-4 shadow-sm mx-auto"
          style={{ maxWidth: 520 }}
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="mb-4">
            <label htmlFor="email" className="form-label fw-semibold">
              Votre email
            </label>
            <input
              id="email"
              type="email"
              className="form-control rounded"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="exemple@domaine.com"
              required
              aria-describedby="emailHelp"
            />
            <div id="emailHelp" className="form-text">
              Nous ne partagerons jamais votre email.
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="form-label fw-semibold">
              Description détaillée du problème
            </label>
            <textarea
              id="description"
              className="form-control rounded"
              name="description"
              rows={6}
              value={form.description}
              onChange={handleChange}
              placeholder="Décrivez le problème rencontré avec autant de détails que possible..."
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-100 rounded-pill fw-semibold"
            aria-label="Envoyer le signalement"
          >
            Envoyer le signalement
          </button>
        </form>
      )}
    </div>
  );
};

export default SignalerProbleme;
