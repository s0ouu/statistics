from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import pandas as pd
import numpy as np
import json
import os
from scipy import stats
from sklearn.decomposition import PCA
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64

app = Flask(__name__)
CORS(app)  # すべてのオリジンからのCORSリクエストを許可

# 日本語フォントの設定
plt.rcParams['font.family'] = 'DejaVu Sans'

class StatisticsAnalyzer:
    def __init__(self):
        self.data = None
        self.columns = None
        
    def load_sample_data(self):
        """サンプルデータを生成"""
        np.random.seed(42)
        n_samples = 100
        
        age = np.random.normal(30, 8, n_samples)
        height = np.random.normal(170, 10, n_samples)
        weight = 0.7 * height + np.random.normal(0, 5, n_samples) - 50
        income = age * 15 + height * 2 + np.random.normal(0, 50, n_samples) + 200
        
        self.data = pd.DataFrame({
            '年齢': age,
            '身長': height,
            '体重': weight,
            '収入': income
        })
        self.columns = list(self.data.columns)
        return self.data
    
    def basic_statistics(self):
        """基本統計量を計算"""
        if self.data is None:
            return None
            
        stats_dict = {}
        for col in self.data.columns:
            if self.data[col].dtype in ['int64', 'float64']:
                stats_dict[col] = {
                    'mean': float(self.data[col].mean()),
                    'std': float(self.data[col].std()),
                    'min': float(self.data[col].min()),
                    'max': float(self.data[col].max()),
                    'median': float(self.data[col].median()),
                    'count': int(self.data[col].count())
                }
        return stats_dict
    
    def correlation_analysis(self):
        """相関分析を実行"""
        if self.data is None:
            return None
            
        numeric_data = self.data.select_dtypes(include=[np.number])
        correlation_matrix = numeric_data.corr()
        
        # 相関行列を辞書形式に変換
        corr_dict = {}
        for i, col1 in enumerate(correlation_matrix.columns):
            corr_dict[col1] = {}
            for j, col2 in enumerate(correlation_matrix.columns):
                corr_dict[col1][col2] = float(correlation_matrix.iloc[i, j])
        
        return corr_dict
    
    def regression_analysis(self, target_col, feature_cols):
        """回帰分析を実行"""
        if self.data is None:
            return None
            
        try:
            X = self.data[feature_cols]
            y = self.data[target_col]
            
            # 欠損値を除去
            mask = ~(X.isnull().any(axis=1) | y.isnull())
            X = X[mask]
            y = y[mask]
            
            model = LinearRegression()
            model.fit(X, y)
            
            y_pred = model.predict(X)
            r2_score = model.score(X, y)
            
            # 統計的有意性の計算（簡易版）
            n = len(y)
            p = len(feature_cols)
            f_statistic = (r2_score / p) / ((1 - r2_score) / (n - p - 1))
            
            return {
                'r2_score': float(r2_score),
                'coefficients': [float(coef) for coef in model.coef_],
                'intercept': float(model.intercept_),
                'feature_names': feature_cols,
                'f_statistic': float(f_statistic),
                'n_samples': int(n)
            }
        except Exception as e:
            return {'error': str(e)}
    
    def factor_analysis(self):
        """因子分析（主成分分析）を実行"""
        if self.data is None:
            return None
            
        try:
            numeric_data = self.data.select_dtypes(include=[np.number])
            
            # 標準化
            scaler = StandardScaler()
            scaled_data = scaler.fit_transform(numeric_data)
            
            # PCA実行
            pca = PCA()
            pca.fit(scaled_data)
            
            # 結果をまとめる
            explained_variance_ratio = pca.explained_variance_ratio_
            components = pca.components_
            
            return {
                'explained_variance_ratio': [float(x) for x in explained_variance_ratio],
                'cumulative_variance_ratio': [float(x) for x in np.cumsum(explained_variance_ratio)],
                'components': components.tolist(),
                'feature_names': list(numeric_data.columns),
                'n_components': len(explained_variance_ratio)
            }
        except Exception as e:
            return {'error': str(e)}
    
    def generate_visualization(self, plot_type, **kwargs):
        """可視化を生成"""
        if self.data is None:
            return None
            
        plt.figure(figsize=(10, 6))
        
        if plot_type == 'correlation_heatmap':
            numeric_data = self.data.select_dtypes(include=[np.number])
            correlation_matrix = numeric_data.corr()
            sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', center=0)
            plt.title('Correlation Matrix')
            
        elif plot_type == 'histogram':
            column = kwargs.get('column')
            if column and column in self.data.columns:
                plt.hist(self.data[column], bins=20, alpha=0.7)
                plt.title(f'Histogram of {column}')
                plt.xlabel(column)
                plt.ylabel('Frequency')
                
        elif plot_type == 'scatter':
            x_col = kwargs.get('x_column')
            y_col = kwargs.get('y_column')
            if x_col and y_col and x_col in self.data.columns and y_col in self.data.columns:
                plt.scatter(self.data[x_col], self.data[y_col], alpha=0.6)
                plt.xlabel(x_col)
                plt.ylabel(y_col)
                plt.title(f'{x_col} vs {y_col}')
        
        # 画像をbase64エンコードして返す
        img_buffer = io.BytesIO()
        plt.savefig(img_buffer, format='png', bbox_inches='tight', dpi=150)
        img_buffer.seek(0)
        img_base64 = base64.b64encode(img_buffer.getvalue()).decode()
        plt.close()
        
        return img_base64

# グローバルアナライザーインスタンス
analyzer = StatisticsAnalyzer()

@app.route('/')
def index():
    return jsonify({
        'message': 'Co-Statistics Backend API',
        'version': '1.0.0',
        'endpoints': [
            '/api/load_sample_data',
            '/api/basic_statistics',
            '/api/correlation_analysis',
            '/api/regression_analysis',
            '/api/factor_analysis',
            '/api/visualization'
        ]
    })

@app.route('/api/load_sample_data', methods=['POST'])
def load_sample_data():
    """サンプルデータを読み込み"""
    try:
        data = analyzer.load_sample_data()
        return jsonify({
            'success': True,
            'message': 'サンプルデータが正常に読み込まれました',
            'data_shape': data.shape,
            'columns': analyzer.columns,
            'preview': data.head().to_dict('records')
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/basic_statistics', methods=['GET'])
def get_basic_statistics():
    """基本統計量を取得"""
    try:
        stats = analyzer.basic_statistics()
        if stats is None:
            return jsonify({'success': False, 'error': 'データが読み込まれていません'}), 400
        
        return jsonify({
            'success': True,
            'statistics': stats
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/correlation_analysis', methods=['GET'])
def get_correlation_analysis():
    """相関分析を実行"""
    try:
        correlation = analyzer.correlation_analysis()
        if correlation is None:
            return jsonify({'success': False, 'error': 'データが読み込まれていません'}), 400
        
        return jsonify({
            'success': True,
            'correlation_matrix': correlation
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/regression_analysis', methods=['POST'])
def perform_regression_analysis():
    """回帰分析を実行"""
    try:
        data = request.json
        target_col = data.get('target_column')
        feature_cols = data.get('feature_columns', [])
        
        if not target_col or not feature_cols:
            return jsonify({'success': False, 'error': '目的変数と説明変数を指定してください'}), 400
        
        result = analyzer.regression_analysis(target_col, feature_cols)
        if result is None:
            return jsonify({'success': False, 'error': 'データが読み込まれていません'}), 400
        
        return jsonify({
            'success': True,
            'regression_result': result
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/factor_analysis', methods=['GET'])
def get_factor_analysis():
    """因子分析を実行"""
    try:
        result = analyzer.factor_analysis()
        if result is None:
            return jsonify({'success': False, 'error': 'データが読み込まれていません'}), 400
        
        return jsonify({
            'success': True,
            'factor_analysis_result': result
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/visualization', methods=['POST'])
def generate_visualization():
    """可視化を生成"""
    try:
        data = request.json
        plot_type = data.get('plot_type')
        
        if not plot_type:
            return jsonify({'success': False, 'error': 'プロットタイプを指定してください'}), 400
        
        img_base64 = analyzer.generate_visualization(plot_type, **data)
        if img_base64 is None:
            return jsonify({'success': False, 'error': 'データが読み込まれていません'}), 400
        
        return jsonify({
            'success': True,
            'image': img_base64
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/data_info', methods=['GET'])
def get_data_info():
    """データの情報を取得"""
    try:
        if analyzer.data is None:
            return jsonify({'success': False, 'error': 'データが読み込まれていません'}), 400
        
        return jsonify({
            'success': True,
            'data_info': {
                'shape': analyzer.data.shape,
                'columns': analyzer.columns,
                'dtypes': analyzer.data.dtypes.to_dict(),
                'null_counts': analyzer.data.isnull().sum().to_dict()
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)


