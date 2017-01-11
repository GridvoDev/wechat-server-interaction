FROM node:latest
MAINTAINER linmadan <772181827@qq.com>
COPY ./package.json /home/wechat-server-interaction/
WORKDIR /home/wechat-server-interaction
RUN ["npm","config","set","registry","http://registry.npm.taobao.org"]
RUN ["npm","install","--save-dev","mocha@3.2.0"]
RUN ["npm","install","--save-dev","muk@0.5.3"]
RUN ["npm","install","--save-dev","should@11.1.1"]
RUN ["npm","install","--save-dev","supertest@2.0.1"]
RUN ["npm","install","--save","co@4.6.0"]
RUN ["npm","install","--save","express@4.14.0"]
RUN ["npm","install","--save","kafka-node@1.0.7"]
RUN ["npm","install","--save","rest@2.0.0"]
RUN ["npm","install","--save","underscore@1.8.3"]
RUN ["npm","install","--save","wechat-crypto@0.0.2"]
RUN ["npm","install","--save","xml2js@0.4.17"]
RUN ["npm","install","--save","gridvo-common-js@0.0.3"]
COPY ./app.js app.js
COPY ./lib lib
COPY ./test test
VOLUME ["/home/wechat-server-interaction"]
ENTRYPOINT ["node"]
CMD ["app.js"]