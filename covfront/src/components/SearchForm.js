"use client"

import { useState } from "react"

const SearchForm = ({ onSearch }) => {
  const [searchData, setSearchData] = useState({
    from: "",
    to: "",
    date: "",
    passengers: 1,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(searchData)
  }

  const handleChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Départ</label>
          <input
            type="text"
            className="form-control"
            name="from"
            value={searchData.from}
            onChange={handleChange}
            placeholder="Ville de départ"
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Arrivée</label>
          <input
            type="text"
            className="form-control"
            name="to"
            value={searchData.to}
            onChange={handleChange}
            placeholder="Ville d'arrivée"
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            name="date"
            value={searchData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Passagers</label>
          <select className="form-select" name="passengers" value={searchData.passengers} onChange={handleChange}>
            <option value={1}>1 passager</option>
            <option value={2}>2 passagers</option>
            <option value={3}>3 passagers</option>
            <option value={4}>4 passagers</option>
          </select>
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary w-100">
            <i className="fas fa-search me-2"></i>
            Rechercher
          </button>
        </div>
      </div>
    </form>
  )
}

export default SearchForm
