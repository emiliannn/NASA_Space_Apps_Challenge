from flask import Flask, jsonify, request
from flask_cors import CORS
from sklearn.cluster import KMeans
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from xgboost import XGBClassifier 
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import re

app = Flask(__name__)
CORS(app)

data = None
tfidf_vectorizer = None
tfidf_matrix = None
prediction_model = None

def preprocess_text(text):
    """Preprocess text for TF-IDF"""
    if pd.isna(text):
        return ""
    text = str(text).lower()
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    return text

def create_sample_data():
    """Create sample data"""
    return pd.DataFrame({
        'title': [
            'Effects of Microgravity on Bone Density in Space Missions',
            'Plant Growth Under Reduced Gravity Conditions',
            'Cardiovascular Adaptation to Long-Duration Spaceflight',
            'Microbial Behavior in International Space Station',
            'Radiation Effects on Human Cells During Space Travel',
            'Muscle Atrophy Prevention in Astronauts',
            'Cell Division Under Microgravity Environment',
            'Immune System Response to Spaceflight',
            'Arabidopsis Thaliana Growth in Space',
            'Protein Expression Changes in Microgravity',
            'Calcium Metabolism in Space Environment',
            'Gene Expression in Weightless Conditions',
            'Space Biology Research on ISS Platform',
            'Neurological Changes During Extended Spaceflight',
            'Oxidative Stress in Space Conditions'
        ],
        'year': [2020, 2019, 2021, 2020, 2022, 2021, 2019, 2020, 2021, 2022, 2020, 2021, 2019, 2022, 2020],
        'citations': [45, 32, 67, 28, 51, 39, 22, 44, 36, 29, 41, 33, 19, 48, 38],
        'category': [''] * 15
    })

@app.route('/')
def home():
    return jsonify({'message': '🚀 Space Biology API is running!'})

@app.route('/api/upload', methods=['POST'])
def upload_data():
    global data
    try:
        if 'file' in request.files:
            file = request.files['file']
            data = pd.read_csv(file)
        else:
            data = create_sample_data()
        return jsonify({
            'message': 'Data loaded successfully',
            'rows': len(data),
            'columns': list(data.columns)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/analyze', methods=['POST'])
def analyze_tfidf():
    try:
        params = request.get_json(force=True, silent=True) or {}
        text_column = params.get('text_column')
        max_features = int(params.get('max_features', 50))

        if data is None or data.empty:
            return jsonify({'error': 'Dataset is empty or not loaded.'}), 400

        df = data.copy()

        if not text_column or text_column not in df.columns:
            text_cols = df.select_dtypes(include=['object', 'string']).columns.tolist()
            if not text_cols:
                df['__synthetic_text__'] = df.astype(str).agg(' '.join, axis=1)
                text_column = '__synthetic_text__'
            else:
                text_column = text_cols[0]

        df[text_column] = df[text_column].fillna('').astype(str)
        df['processed_text'] = df[text_column].apply(preprocess_text)

        if not df['processed_text'].str.strip().any():
            df['processed_text'] = df[text_column]

        if not df['processed_text'].str.strip().any():
            df['processed_text'] = df.astype(str).agg(' '.join, axis=1)

        df = df[df['processed_text'].str.strip().astype(bool)]
        if df.empty:
            return jsonify({'error': 'No usable text data found even after fallback.'}), 400

        vectorizer = TfidfVectorizer(max_features=max_features, stop_words='english')
        tfidf_matrix = vectorizer.fit_transform(df['processed_text'])

        feature_names = vectorizer.get_feature_names_out()
        tfidf_scores = tfidf_matrix.mean(axis=0).A1

        tfidf_results = pd.DataFrame({
            'term': feature_names,
            'score': tfidf_scores
        }).sort_values(by='score', ascending=False)

        matrix_array = tfidf_matrix.toarray()
        top_terms_per_doc = []
        for i, row in enumerate(matrix_array):
            top_indices = row.argsort()[-5:][::-1]
            top_terms = [(feature_names[j], float(row[j])) for j in top_indices if row[j] > 0]
            title_value = (
                f"{df.iloc[i][text_column][:80]}..."
                if text_column in df else f"Document {i}"
            )
            top_terms_per_doc.append({
                'document_id': i,
                'title': title_value,
                'link': df.iloc[i]['Link'] if 'Link' in df else None,
                'top_terms': top_terms
            })

        return jsonify({
            'tfidf_scores': tfidf_results.to_dict(orient='records'),
            'top_terms_per_document': top_terms_per_doc[:10],
            'vocabulary_size': len(feature_names),
            'document_count': tfidf_matrix.shape[0],
            'text_column_used': text_column
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/predict', methods=['POST'])
def predict_category():
    global data, prediction_model
    try:
        if data is None or data.empty:
            data = create_sample_data()

        df = data.copy()

        possible_text_cols = [c for c in df.columns if df[c].dtype == object or df[c].dtype.name == 'string']
        if 'Title' in df.columns:
            text_col = 'Title'
        elif 'title' in df.columns:
            text_col = 'title'
        elif possible_text_cols:
            text_col = possible_text_cols[0]
        else:
            df['__synthetic_text__'] = df.astype(str).agg(' '.join, axis=1)
            text_col = '__synthetic_text__'

        df[text_col] = df[text_col].fillna('').astype(str)
        df['processed_text'] = df[text_col].apply(preprocess_text)

        if not df['processed_text'].str.strip().any():
            df['processed_text'] = df[text_col]
        if not df['processed_text'].str.strip().any():
            df['processed_text'] = df.astype(str).agg(' '.join, axis=1)
        df = df[df['processed_text'].str.strip().astype(bool)]
        if df.empty:
            return jsonify({'error': 'No usable text data found even after fallback.'}), 400

        vectorizer = TfidfVectorizer(max_features=1000, ngram_range=(1, 2), stop_words='english')
        X_tfidf = vectorizer.fit_transform(df['processed_text'])
        if X_tfidf.shape[1] == 0:
            return jsonify({'error': 'No valid features extracted from text.'}), 400

        n_clusters = min(5, len(df))
        kmeans = KMeans(n_clusters=n_clusters, random_state=42)
        cluster_labels = kmeans.fit_predict(X_tfidf)

        terms = vectorizer.get_feature_names_out()
        cluster_names = []
        for i in range(n_clusters):
            center = kmeans.cluster_centers_[i]
            top_idx = center.argsort()[-5:][::-1]
            top_keywords = [terms[j] for j in top_idx]
            readable_name = " ".join(top_keywords)
            cluster_names.append(readable_name.title())

        cluster_map = {i: cluster_names[i] for i in range(n_clusters)}
        df['dynamic_category'] = [cluster_map[c] for c in cluster_labels]

        le = LabelEncoder()
        y_encoded = le.fit_transform(df['dynamic_category'])

        X = X_tfidf.toarray()
        if 'year' in df.columns:
            years = (df['year'] - df['year'].min()) / (df['year'].max() - df['year'].min() + 1)
            X = np.column_stack([X, years])
        if 'citations' in df.columns:
            cites = (df['citations'] - df['citations'].min()) / (df['citations'].max() - df['citations'].min() + 1)
            X = np.column_stack([X, cites])

        X_train, X_test, y_train, y_test = train_test_split(
            X, y_encoded, test_size=0.3, random_state=42, stratify=y_encoded if len(np.unique(y_encoded)) > 1 else None
        )

        prediction_model = GradientBoostingClassifier(
            n_estimators=300, learning_rate=0.05, max_depth=5, random_state=42
        )
        prediction_model.fit(X_train, y_train)

        y_pred = prediction_model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)

        all_predictions_encoded = prediction_model.predict(X)
        all_predictions = le.inverse_transform(all_predictions_encoded)
        df['predicted_category'] = all_predictions

        dist = pd.Series(all_predictions).value_counts().to_dict()

        return jsonify({
            'accuracy': float(accuracy),
            'predictions': [
                { (text_col.lower() if k == text_col else k): v for k, v in rec.items() }
                for rec in df[[text_col, 'predicted_category']].head(15).to_dict('records')
            ],
            'prediction_distribution': dist,
            'categories_inferred': cluster_names,
            'model_type': 'Gradient Boosting (TF-IDF + KMeans Dynamic)',
            'feature_count': X.shape[1],
            'training_samples': len(X_train),
            'test_samples': len(X_test),
            'text_column_used': text_col
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 400






@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    global data
    try:
        if data is None:
            data = create_sample_data()

        stats = {
            'total_documents': len(data),
            'columns': list(data.columns),
            'missing_values': data.isnull().sum().to_dict()
        }

        num_cols = data.select_dtypes(include=[np.number]).columns
        if len(num_cols) > 0:
            stats['numeric_summary'] = data[num_cols].describe().to_dict()

        if 'title' in data.columns:
            data['title_length'] = data['title'].astype(str).str.len()
            stats['text_statistics'] = {
                'avg_length': float(data['title_length'].mean()),
                'max_length': int(data['title_length'].max()),
                'min_length': int(data['title_length'].min())
            }

        if 'year' in data.columns:
            stats['year_distribution'] = data['year'].value_counts().to_dict()

        if 'predicted_category' in data.columns:
            stats['category_distribution'] = data['predicted_category'].value_counts().to_dict()

        return jsonify(stats)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'data_loaded': data is not None,
        'tfidf_ready': tfidf_matrix is not None,
        'model_trained': prediction_model is not None
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
