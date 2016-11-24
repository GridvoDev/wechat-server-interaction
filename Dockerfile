FROM node:latest
MAINTAINER linmadan <772181827@qq.com>
COPY ./package.json /home/wechat-server-interaction/
WORKDIR /home/wechat-server-interaction
RUN ["npm","install"]
COPY ./app.js app.js
COPY ./lib lib
COPY ./test test
COPY ./unittest_application_bcontext.json unittest_application_bcontext.json
COPY ./unittest_express_bcontext.json unittest_express_bcontext.json
COPY ./production_bcontext.json production_bcontext.json
VOLUME ["/home/wechat-server-interaction"]
ENTRYPOINT ["node"]
CMD ["app.js"]