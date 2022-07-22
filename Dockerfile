FROM node:16-alpine

ARG AWS_ACCESS_KEY
ARG AWS_SECRET_KEY

ENV isDevelopment='isDevelopment'

RUN apk --no-cache update \
  && apk add --update python3 \
  && apk add make gcc g++ tzdata \
  && npm install -g serverless

# AWSの認証情報を~/.aws/credentialsに書き込む
# Serverless Frameworkは~/.aws/credentialsの認証情報を利用する
RUN serverless config credentials --provider aws --key $AWS_ACCESS_KEY --secret $AWS_SECRET_KEY

RUN cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
  echo "Asia/Tokyo" > /etc/timezone && \
  apk del tzdata

WORKDIR /app
