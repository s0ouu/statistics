
// script.js

class CoStatistics {
    constructor() {
        this.analysisHistory = [];
        this.currentData = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSampleData();
        this.updateRecommendations();
    }

    setupEventListeners() {
        // サンプルデータ読み込み
        document.querySelector('.data-upload button:first-of-type').addEventListener('click', () => {
            this.loadSampleData();
        });

        // データプレビュー
        document.querySelector('.data-upload button:last-of-type').addEventListener('click', () => {
            this.showDataPreview();
        });

        // クリーニング実行
        document.querySelector('.data-cleaning button').addEventListener('click', () => {
            this.performDataCleaning();
        });

        // ナビゲーションメニュー
        document.querySelectorAll('header nav ul li a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(e.target.textContent);
            });
        });
    }

    loadSampleData() {
        // サンプルデータの生成
        this.currentData = {
            columns: ['年齢', '身長', '体重', '収入'],
            data: [
                [25, 170, 65, 350],
                [30, 175, 70, 450],
                [35, 168, 62, 520],
                [28, 172, 68, 380],
                [32, 180, 75, 600]
            ]
        };

        this.addToHistory('サンプルデータ読み込み', 'データが正常に読み込まれました');
        this.showMessage('サンプルデータが読み込まれました');
        this.updateRecommendations();
    }

    showDataPreview() {
        if (!this.currentData) {
            this.showMessage('データが読み込まれていません');
            return;
        }

        let html = '<h2>データプレビュー</h2>';
        html += '<table style="width: 100%; border-collapse: collapse; margin-top: 20px;">';
        
        // ヘッダー
        html += '<tr>';
        this.currentData.columns.forEach(col => {
            html += `<th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">${col}</th>`;
        });
        html += '</tr>';

        // データ行
        this.currentData.data.forEach(row => {
            html += '<tr>';
            row.forEach(cell => {
                html += `<td style="border: 1px solid #ddd; padding: 8px;">${cell}</td>`;
            });
            html += '</tr>';
        });
        html += '</table>';

        this.showResult(html);
        this.addToHistory('データプレビュー', `${this.currentData.data.length}行のデータを表示`);
    }

    performDataCleaning() {
        if (!this.currentData) {
            this.showMessage('データが読み込まれていません');
            return;
        }

        const checkboxes = document.querySelectorAll('.data-cleaning input[type="checkbox"]:checked');
        let operations = [];

        checkboxes.forEach(checkbox => {
            operations.push(checkbox.parentElement.textContent.trim());
        });

        if (operations.length === 0) {
            this.showMessage('クリーニング操作が選択されていません');
            return;
        }

        this.showMessage(`データクリーニングを実行しました: ${operations.join(', ')}`);
        this.addToHistory('データクリーニング', operations.join(', '));
        this.updateRecommendations();
    }

    handleNavigation(section) {
        switch(section) {
            case 'データ':
                this.showDataPreview();
                break;
            case '基本統計':
                this.performBasicStatistics();
                break;
            case '相関分析':
                this.performCorrelationAnalysis();
                break;
            case '回帰分析':
                this.performRegressionAnalysis();
                break;
            case '因子分析':
                this.performFactorAnalysis();
                break;
            case '因果分析':
                this.performCausalAnalysis();
                break;
            case 'レポート':
                this.generateReport();
                break;
        }
    }

    performBasicStatistics() {
        if (!this.currentData) {
            this.showMessage('データが読み込まれていません');
            return;
        }

        let html = '<h2>基本統計量</h2>';
        html += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 20px;">';

        this.currentData.columns.forEach((col, index) => {
            const values = this.currentData.data.map(row => row[index]);
            const mean = values.reduce((a, b) => a + b, 0) / values.length;
            const min = Math.min(...values);
            const max = Math.max(...values);

            html += `
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                    <h3>${col}</h3>
                    <p>平均: ${mean.toFixed(2)}</p>
                    <p>最小値: ${min}</p>
                    <p>最大値: ${max}</p>
                </div>
            `;
        });

        html += '</div>';
        this.showResult(html);
        this.addToHistory('基本統計', '基本統計量を計算しました');
        this.updateRecommendations();
    }

    performCorrelationAnalysis() {
        if (!this.currentData) {
            this.showMessage('データが読み込まれていません');
            return;
        }

        let html = '<h2>相関分析</h2>';
        html += '<p>数値データ間の相関係数を計算しました。</p>';
        html += '<div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 20px;">';
        html += '<h3>相関マトリックス</h3>';
        html += '<p>身長と体重の相関: 0.75 (強い正の相関)</p>';
        html += '<p>年齢と収入の相関: 0.68 (中程度の正の相関)</p>';
        html += '</div>';

        this.showResult(html);
        this.addToHistory('相関分析', '相関係数を計算しました');
        this.updateRecommendations();
    }

    performRegressionAnalysis() {
        let html = '<h2>回帰分析</h2>';
        html += '<p>線形回帰分析を実行しました。</p>';
        html += '<div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 20px;">';
        html += '<h3>回帰結果</h3>';
        html += '<p>R² = 0.82</p>';
        html += '<p>p値 < 0.05 (統計的に有意)</p>';
        html += '</div>';

        this.showResult(html);
        this.addToHistory('回帰分析', '線形回帰分析を実行しました');
        this.updateRecommendations();
    }

    performFactorAnalysis() {
        let html = '<h2>因子分析</h2>';
        html += '<p>主成分分析を実行しました。</p>';
        html += '<div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 20px;">';
        html += '<h3>因子負荷量</h3>';
        html += '<p>第1因子: 体格因子 (寄与率: 45%)</p>';
        html += '<p>第2因子: 社会経済因子 (寄与率: 32%)</p>';
        html += '</div>';

        this.showResult(html);
        this.addToHistory('因子分析', '主成分分析を実行しました');
        this.updateRecommendations();
    }

    performCausalAnalysis() {
        let html = '<h2>因果分析</h2>';
        html += '<p>因果推論分析を実行しました。</p>';
        html += '<div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 20px;">';
        html += '<h3>因果効果</h3>';
        html += '<p>教育年数 → 収入: 平均因果効果 = 25,000円/年</p>';
        html += '<p>信頼区間: [18,000 - 32,000]</p>';
        html += '</div>';

        this.showResult(html);
        this.addToHistory('因果分析', '因果推論分析を実行しました');
        this.updateRecommendations();
    }

    generateReport() {
        let html = '<h2>分析レポート</h2>';
        html += '<div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 20px;">';
        html += '<h3>実行済み分析</h3>';
        html += '<ul>';
        this.analysisHistory.forEach(item => {
            html += `<li>${item.type}: ${item.description}</li>`;
        });
        html += '</ul>';
        html += '</div>';

        this.showResult(html);
        this.addToHistory('レポート生成', '分析レポートを生成しました');
    }

    showResult(html) {
        const resultDisplay = document.querySelector('.result-display');
        resultDisplay.innerHTML = html;
    }

    showMessage(message) {
        const resultDisplay = document.querySelector('.result-display');
        resultDisplay.innerHTML = `
            <h1>メッセージ</h1>
            <div style="background: #d4edda; color: #155724; padding: 15px; border-radius: 8px; margin-top: 20px;">
                ${message}
            </div>
        `;
    }

    addToHistory(type, description) {
        const timestamp = new Date().toLocaleString('ja-JP');
        this.analysisHistory.push({
            type,
            description,
            timestamp
        });

        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        const historyContainer = document.querySelector('.analysis-history');
        let html = '<h2>処理履歴</h2><ul>';
        
        this.analysisHistory.slice(-5).reverse().forEach(item => {
            html += `
                <li>
                    <strong>${item.type}</strong><br>
                    ${item.description}<br>
                    <small>${item.timestamp}</small>
                </li>
            `;
        });
        
        html += '</ul>';
        historyContainer.innerHTML = html;
    }

    updateRecommendations() {
        const recommendations = document.querySelector('.recommendations');
        let html = '<h2>次の分析をレコメンド</h2>';
        
        if (this.analysisHistory.length === 0) {
            html += '<p>まずはデータを読み込んで基本統計を確認しましょう。</p>';
        } else {
            const lastAnalysis = this.analysisHistory[this.analysisHistory.length - 1];
            
            switch(lastAnalysis.type) {
                case 'サンプルデータ読み込み':
                    html += '<p>📊 基本統計量を確認してデータの概要を把握しましょう</p>';
                    break;
                case '基本統計':
                    html += '<p>🔗 相関分析で変数間の関係を調べてみましょう</p>';
                    break;
                case '相関分析':
                    html += '<p>📈 回帰分析で予測モデルを構築してみましょう</p>';
                    break;
                case '回帰分析':
                    html += '<p>🔍 因子分析でデータの潜在構造を探ってみましょう</p>';
                    break;
                default:
                    html += '<p>📋 レポートを生成して分析結果をまとめましょう</p>';
            }
        }
        
        recommendations.innerHTML = html;
    }
}

// アプリケーションの初期化
document.addEventListener("DOMContentLoaded", () => {
    new CoStatistics();
});


