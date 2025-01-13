from flask import Flask, request, jsonify
import joblib
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# Load the trained model and vectorizer
vectorizer = joblib.load('vectorizer.pkl')  # Update the path accordingly
model = joblib.load('model.pkl')  # Update the path accordingly

# Ensure the 'uploads' directory exists
if not os.path.exists('uploads'):
    os.makedirs('uploads')

@app.route('/classify', methods=['POST'])
def classify():
    # Check if a file is part of the request
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    # Save the uploaded file temporarily in the 'uploads' directory
    file_path = os.path.join('uploads', file.filename)
    file.save(file_path)

    # Read the document from the file
    with open(file_path, 'r') as f:
        document = f.read()

    # Preprocess the document using the vectorizer
    document_vector = vectorizer.transform([document])

    # Predict the class using the trained model
    prediction = model.predict(document_vector)

    return jsonify({'prediction': prediction[0]}), 200

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
