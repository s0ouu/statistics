# Co-Statistics 統計分析ツール

## 概要
Co-Statisticsは、Pythonによる統計分析機能とHTML/CSS/JavaScriptによるユーザーインターフェースを組み合わせた統計分析ツールです。

## 機能
- **データ管理**: サンプルデータの読み込み、データプレビュー
- **データクリーニング**: 空行削除、欠損値処理、データ標準化
- **統計分析**:
  - 基本統計量の計算
  - 相関分析
  - 回帰分析
  - 因子分析（主成分分析）
  - 因果分析
- **分析履歴**: 実行した分析の履歴管理
- **レコメンデーション**: 次に実行すべき分析の提案

## プロジェクト構造
```
co-statistics-tool/
├── frontend/
│   ├── index.html      # メインのHTMLファイル
│   ├── style.css       # スタイルシート
│   └── script.js       # JavaScript機能
└── backend/
    └── app.py          # Flaskバックエンドサーバー
```

## 使用技術
### フロントエンド
- HTML5
- CSS3
- JavaScript (ES6+)

### バックエンド
- Python 3.11
- Flask
- pandas
- numpy
- scikit-learn
- matplotlib
- seaborn

## セットアップ

### 必要なパッケージのインストール
```bash
pip install flask flask-cors pandas numpy scikit-learn matplotlib seaborn
```

### サーバーの起動
```bash
# バックエンドサーバーの起動
cd backend
python app.py

# フロントエンドの表示
# ブラウザでfrontend/index.htmlを開く
```

## 使用方法
1. ブラウザでfrontend/index.htmlを開く
2. 「サンプルデータ読み込み」ボタンでデータを読み込む
3. 上部のナビゲーションメニューから分析を選択
4. 左サイドバーで分析履歴を確認
5. 下部のレコメンデーションで次の分析を確認

## API エンドポイント
- `GET /` - API情報
- `POST /api/load_sample_data` - サンプルデータ読み込み
- `GET /api/basic_statistics` - 基本統計量取得
- `GET /api/correlation_analysis` - 相関分析実行
- `POST /api/regression_analysis` - 回帰分析実行
- `GET /api/factor_analysis` - 因子分析実行
- `POST /api/visualization` - 可視化生成
- `GET /api/data_info` - データ情報取得

## 特徴
- **直感的なUI**: 左サイドバーでのデータ管理、メインエリアでの結果表示
- **分析履歴管理**: 実行した分析の履歴を自動記録
- **インテリジェントレコメンデーション**: 分析の流れに応じた次の分析提案
- **レスポンシブデザイン**: デスクトップとモバイルに対応

## 今後の拡張予定
- CSVファイルのアップロード機能
- より高度な統計分析手法の追加
- 可視化機能の強化
- データエクスポート機能
- ユーザー認証機能

## ライセンス
MIT License

