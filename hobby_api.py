import pandas as pd
from joblib import load
from flask import Flask, request, jsonify
from flask_cors import CORS
from category_encoders import BinaryEncoder

# import model
model = load('decision_tree_model.joblib')

# import the dataset
x = pd.read_csv('Hobby_Data.csv')

# Fit the encoder only if 'diagnosis' column exists
categorical_features = ['Olympiad_Participation', 'Scholarship', 'School', 'Fav_sub', 'Projects','Grasp_pow', 'Time_sprt', 'Medals', 'Career_sprt', 'Act_sprt', 'Fant_arts', 'Won_arts', 'Time_art']
encoder = BinaryEncoder()
if all(feature in x.columns for feature in categorical_features):
    encoder.fit(x[categorical_features])

api = Flask(__name__)
CORS(api)

@api.route('/api/hobby_prediction', methods=['POST'])
def prediction_hobby():
    # get the request data from the client
    data = request.json['inputs']
    input_df = pd.DataFrame(data)

    if all(feature in input_df.columns for feature in categorical_features):
        # If 'diagnosis' column exists in input, encode it
        input_encoded = encoder.transform(input_df[categorical_features])
        input_df = input_df.drop(categorical_features, axis=1)
        input_encoded = input_encoded.reset_index(drop=True)
        final_input = pd.concat([input_df, input_encoded], axis=1)
    else:
        # If no 'diagnosis' column, skip encoding
        final_input = input_df

    prediction = model.predict_proba(final_input)
    class_labels = model.classes_

    # build the response
    response = []
    for prob in prediction:
        prob_dict = {}
        for k, v in zip(class_labels, prob):
            prob_dict[str(k)] = round(float(v) * 100, 2)
        response.append(prob_dict)

    return jsonify({"Prediction": response})

if __name__ == "__main__":
    api.run(port=8000)
