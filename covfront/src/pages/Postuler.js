import React, { useState } from 'react';

const Postuler = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '', cv: null });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would handle the form submission (API, email, etc.)
  };

  return (
    <div className="container py-5">
      <h1 className="display-4 fw-bold mb-4 gradient-text">Postuler</h1>
      {submitted ? (
        <div className="alert alert-success">Merci pour votre candidature ! Nous vous contacterons bientôt.</div>
      ) : (
        <form className="card p-4 shadow-sm mx-auto" style={{ maxWidth: 500 }} onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Nom complet</label>
            <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Message / Motivation</label>
            <textarea className="form-control" name="message" rows={4} value={form.message} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold">CV (PDF, max 2Mo)</label>
            <input type="file" className="form-control" name="cv" accept=".pdf,.doc,.docx" onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill fw-semibold">Envoyer la candidature</button>
        </form>
      )}
    </div>
  );
};

export default Postuler; 