import { middyfy } from '@libs/lambda';
import { App, ExpressReceiver } from '@slack/bolt';
import { APIGatewayEvent, Context, Handler } from 'aws-lambda';
import * as awsServerlessExpress from 'aws-serverless-express';
import { ENV } from '../../config';

// ------------------------
// Bolt App Initialization
// ------------------------

// カスタムレシーバーの初期化
const expressReceiver = new ExpressReceiver({
  signingSecret: ENV.SLACK_SIGNING_SECRET,
  // processBeforeResponse: あらゆるFaaS環境で必須。
  // このオプションにより、Bolt フレームワークが `ack()` などでリクエストへの応答を返す前に
  // `app.message` などのメソッドが Slack からのリクエストを処理できるようになります。FaaS では
  // 応答を返した後にハンドラーがただちに終了してしまうため、このオプションの指定が重要になります。
  processBeforeResponse: true,
});

const app = new App({
  token: ENV.SLACK_BOT_TOKEN,
  receiver: expressReceiver,
  processBeforeResponse: true,
});

// ------------------------
// Application Logic
// ------------------------
app.command('/tell-me-word', async ({ command, logger, ack, say }) => {
  try {
    await say(`${command.text}`);
    await ack();
  } catch (e) {
    logger.error(e);
    await ack(`:x: Failed to post a message (error: ${e})`);
  }
});

// ------------------------
// AWS Lambda handler
// ------------------------
const server = awsServerlessExpress.createServer(expressReceiver.app);
const tellMeWord: Handler = async (event: APIGatewayEvent, context: Context) => {
  awsServerlessExpress.proxy(server, event, context);
};

export const main = middyfy(tellMeWord);
