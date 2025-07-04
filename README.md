# nextjs-prisma-graphql-sample

Next.js、Prisma、GraphQLを使用したモダンなTodoアプリケーションのサンプルリポジトリです。

## 概要

このプロジェクトは、現代的なWebアプリケーション開発のベストプラクティスを示すサンプルアプリケーションです。

ユーザー認証機能付きのTodoアプリケーションを通じて、以下の技術スタックの連携を学ぶことができます。

## 技術スタック

- **Frontend**: Next.js 13, React 18, TypeScript, Tailwind CSS
- **Backend**: GraphQL (Apollo Server), Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js (メール認証)
- **Code Generation**: GraphQL Code Generator
- **Testing**: Vitest, React Testing Library
- **Development**: Docker Compose, ESLint, Prettier

## 主な機能

### 🔐 認証機能
- メールアドレスによる認証（NextAuth.js）
- MailHogを使用したローカル環境でのメール送信テスト
- セッション管理

### 📝 Todo管理機能
- Todoの追加、更新、削除
- 完了状態の切り替え
- ユーザー別のTodo管理
- リアルタイムでの状態同期

### 🔧 開発者向け機能
- GraphQL Code Generatorによる型安全なAPI操作
- Prismaによるデータベーススキーマ管理
- TypeScriptによる型安全性
- Vitestによるユニットテスト
- ESLint/Prettierによるコード品質管理

## データベーススキーマ

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  Todo          Todo[]
}

model Todo {
  id        String   @id @default(cuid())
  userId    String
  title     String
  completed Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## 動かし方

### 前提条件
- Node.js 18以上（Node.js 23.xでも動作確認済み）
- Docker & Docker Compose
- yarn

**注意**: Node.js 23.xを使用している場合、一部のパッケージが新しいバージョンとの互換性を完全にサポートしていない可能性があります。この場合、`.yarnrc`ファイルで `--ignore-engines true` を設定することで、エンジンチェックを無効化できます。

### 1. リポジトリのクローン
```bash
git clone https://github.com/your-username/nextjs-prisma-graphql-sample.git
cd nextjs-prisma-graphql-sample
```

### 2. 依存関係のインストール
```bash
yarn install
```

### 3. 環境変数の設定
```bash
cp .env.example .env.local
```

`.env.local`に以下の環境変数を設定してください：

```env
# Database (Docker Composeで起動するPostgreSQLに接続)
DATABASE_URL="postgresql://postgres:password@localhost:5432/nextjs-prisma-graphql-codegen-sample"

# NextAuth.js設定
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-development-secret-change-this-in-production-12345"

# Mail (MailHogを使用したローカル開発用)
EMAIL_SERVER="smtp://localhost:1025"
EMAIL_FROM="noreply@localhost"

# GraphQL Endpoint (開発環境用)
NEXT_PUBLIC_GRAPHQL_ENDPOINT="http://localhost:3000/api/graphql"
```

**各設定の説明:**

- **DATABASE_URL**: Docker Composeで起動するPostgreSQLのデータベースURL
  - `postgres:password`: docker-compose.ymlで設定されたユーザー名とパスワード
  - `localhost:5432`: PostgreSQLのホストとポート
  - `nextjs-prisma-graphql-codegen-sample`: データベース名

- **NEXTAUTH_URL**: アプリケーションのベースURL（開発環境では`http://localhost:3000`）

- **NEXTAUTH_SECRET**: NextAuth.jsで使用する秘密鍵（開発環境では任意の文字列でOK）

- **EMAIL_SERVER**: メールサーバーのSMTP設定（MailHogを使用）
  - `smtp://localhost:1025`: MailHogのSMTPサーバーアドレス

- **EMAIL_FROM**: 送信元メールアドレス（開発環境では任意でOK）

- **NEXT_PUBLIC_GRAPHQL_ENDPOINT**: GraphQL APIのエンドポイント（開発環境用）

### 4. データベースとメールサーバーの起動

以下のコマンドでデータベースとメールサーバーのコンテナを立ち上げる

```bash
docker compose up -d
```

終了させるときは以下のコマンドを実行

```bash
docker compose stop
docker compose rm
```

### 5. データベースマイグレーション
```bash
yarn prisma migrate dev
```

### 6. GraphQL型定義の生成
```bash
yarn codegen
```

### 7. 開発サーバーの起動
```bash
yarn dev
```

アプリケーションが http://localhost:3000 で起動します。

### 8. メール確認
MailHogのWebインターフェースで送信されたメールを確認できます：
http://localhost:8025

## 開発用コマンド

```bash
# 開発サーバー起動
yarn dev

# 型チェック
yarn typecheck

# リンター実行
yarn lint

# フォーマッター実行
yarn format

# テスト実行
yarn test

# テスト（ウォッチモード）
yarn test:watch

# GraphQL型定義生成
yarn codegen

# Prismaマイグレーション
yarn prisma migrate dev

# Prismaスタジオ起動
yarn prisma studio
```

## プロジェクト構成

```
src/
├── components/          # Reactコンポーネント
│   └── TodoList/       # Todoリストコンポーネント
├── generated/          # GraphQL Code Generator生成ファイル
├── graphql/            # GraphQL関連
│   ├── context.ts      # GraphQLコンテキスト
│   ├── resolvers/      # GraphQLリゾルバー
│   └── typeDefs/       # GraphQLスキーマ定義
├── libs/               # ユーティリティ
├── pages/              # Next.jsページ
│   └── api/           # API Routes
└── styles/            # スタイル
```

## テスト

```bash
# 全テスト実行
yarn test

# 特定のテストファイル実行
yarn test TodoList.test.tsx

# カバレッジ付きテスト実行
yarn test --coverage
```

## デプロイ

本番環境へのデプロイ時は、以下の環境変数を設定してください：

- `DATABASE_URL`: 本番データベースのURL
- `NEXTAUTH_SECRET`: NextAuth.jsのシークレット
- `EMAIL_SERVER`: メールサーバーのSMTP設定
- `EMAIL_FROM`: 送信元メールアドレス

## トラブルシューティング

### Node.js互換性エラー

Node.js 23.xなど新しいバージョンを使用している場合、以下のようなエラーが発生することがあります：

```
error next-auth@4.18.8: The engine "node" is incompatible with this module.
```

**解決方法**:
`.yarnrc`ファイルをプロジェクトルートに作成し、以下の内容を追加してください：

```
# Disable engine check to allow installation with Node.js 23.x
--ignore-engines true
```

その後、再度インストールを実行してください：

```bash
yarn install
```

### データベース接続エラー

#### 問題: `User was denied access on the database`

PostgreSQLのユーザー権限に関するエラーが発生する場合があります。

**解決方法**:
1. データベースコンテナを完全にリセットしてください：

```bash
docker compose down -v
docker compose up -d
```

2. 数秒待ってからマイグレーションを再実行してください：

```bash
sleep 5
yarn prisma migrate dev
```

#### 問題: データベースが起動していない

データベースが起動していない場合、以下のコマンドでDockerコンテナを起動してください：

```bash
docker compose up -d
```

**注意**: `docker-compose`コマンドが使用できない場合は、`docker compose`（スペース区切り）を使用してください。

### メール送信の問題

#### 問題: MailHogでメールが表示されない

MailHogのログではメールが正常に受信されているが、Webインターフェースで表示されない場合があります。

**解決方法**:
1. MailHogのWebインターフェースを強制再読み込みしてください：
   ```
   http://localhost:8025
   ```
   - ページを強制再読み込み（Cmd+Shift+R または Ctrl+Shift+R）

2. MailHogコンテナを再起動してください：
   ```bash
   docker compose restart mailhog
   ```

3. MailHogのログでメール受信を確認：
   ```bash
   docker compose logs mailhog
   ```

#### 問題: メールが送信されない

**確認項目**:
- MailHogコンテナが正常に起動しているか確認
- 環境変数の設定が正しいか確認
- NextAuth.jsの設定でメールプロバイダーが有効になっているか確認

### GraphQL型定義の問題

型定義が古い場合、以下のコマンドで再生成してください：

```bash
yarn codegen
```

## 参考文献

- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org)
- [GraphQL Code Generator](https://the-guild.dev/graphql/codegen)
- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [MailHog](https://github.com/mailhog/MailHog)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- [Tailwind CSS](https://tailwindcss.com/)
- [GraphQL Yoga](https://the-guild.dev/graphql/yoga-server)
- [Bulletproof React](https://github.com/alan2207/bulletproof-react)
- [Awesome Tailwind CSS](https://github.com/aniftyco/awesome-tailwindcss)