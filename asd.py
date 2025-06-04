import pandas as pd 
from joblib import load
from flask import Flask, request, jsonify 
from flask_cors import CORS
from category_encoders import BinaryEncoder

# Load the trained model
model = load("decision_tree_model.joblib")

# Read dataset for training the encoder
x = pd.read_csv("dataset.csv")

# List of categorical features
categorical_features = ['General_Health', 'Exercise', 'Depression', 'Diabetes', 'Sex',
       'Age_Category', 'Smoking_History', 'Alcohol_Consumption']

# Initialize the encoder and fit it to the dataset
encoder = BinaryEncoder()
encoder.fit_transform(x[categorical_features])

# Create Flask app
api = Flask(__name__)
CORS(api)

@api.route('/api/hfp_prediction', methods=['POST'])
def predict_heart_failure():
    data = request.json['inputs']
    input_df = pd.DataFrame(data)

    # Ensure data types are correct
    for col in categorical_features:
        input_df[col] = input_df[col].astype(str)

    # Debugging - Check Input Data Types and Structure
    print("Raw Input Data:", data)
    print("Input DataFrame:\n", input_df.head())

    # Encoding the categorical features
    input_encoded = encoder.transform(input_df[categorical_features])

    # Debugging - Check Encoded DataFrame
    print("Encoded DataFrame:\n", input_encoded.head())

    # Dropping categorical features from the original input DataFrame
    input_df = input_df.drop(categorical_features, axis=1)

    # Resetting the index of both the input_df and encoded data
    input_encoded = input_encoded.reset_index(drop=True)
    input_df = input_df.reset_index(drop=True)
    
    # Concatenating the encoded features (without ID)
    final_input = pd.concat([input_df, input_encoded], axis=1)

    # Debugging - Check Final Input DataFrame
    print("Final Input for Model:\n", final_input.head())

    # Making the prediction using the model
    prediction = model.predict_proba(final_input)
    class_labels = model.classes_

    # Debugging - Check Model Prediction Probabilities
    print("Model Prediction Probabilities:", prediction)

    # Preparing the response with the prediction probabilities
    response = []
    for prob in prediction:
        prob_dict = {}
        for k, v in zip(class_labels, prob):
            prob_dict[str(k)] = round(float(v) * 100, 2)
        response.append(prob_dict)

    # Returning the response as JSON
    return jsonify({'prediction': response})

# Run the Flask app
if __name__ == "__main__":
    api.run(port=8000)