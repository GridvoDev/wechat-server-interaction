FROM node:latest
MAINTAINER linmadan <772181827@qq.com>
COPY ./package.json /home/wechat-server-interaction/
WORKDIR /home/wechat-server-interaction
RUN ["npm","config","set","registry","http://registry.npm.taobao.org"]
RUN ["npm","install","--save","co@4.6.0"]
RUN ["npm","install","--save","express@4.14.1"]
RUN ["npm","install","--save","kafka-node@1.6.0"]
RUN ["npm","install","--save","rest@2.0.0"]
RUN ["npm","install","--save","underscore@1.8.3"]
RUN ["npm","install","--save","wechat-crypto@0.0.2"]
RUN ["npm","install","--save","xml2js@0.4.17"]
RUN ["npm","install","--save","gridvo-common-js@0.0.23"]
COPY ./app.js app.js
COPY ./lib lib
VOLUME ["/home/wechat-server-interaction"]
ENTRYPOINT ["node"]
CMD ["app.js"]