import React, { useState } from 'react';
import axios from 'axios';

function Form() {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      alert("Please upload a file!");
      return;
    }
    
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post("https://documentclassifier.onrender.com/classify", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error("Error during classification:", error);
      alert("Error classifying the document.");
    }
  };

  return (
    <div className="container mt-5">
  <div className="card shadow-lg">
    <div className="card-body">
      <h1 className="text-center text-primary mb-4">Document Classifier</h1>
      <p className="text-center text-muted">
        An easy way to classify your documents based on the content they contain.
      </p>
      <form onSubmit={handleSubmit} className="d-flex flex-column align-items-center">
        <div className="mb-3 w-50">
          <input type="file" className="form-control" onChange={handleFileChange} />
        </div>
        <button className="btn btn-primary w-25" type="submit">
          Classify
        </button>
      </form>
      {prediction && (
        <div className="alert alert-success mt-4 text-center">
          <strong>Prediction:</strong> {prediction}
        </div>
      )}
    </div>
  </div>
</div>

  );
}

export default Form;
