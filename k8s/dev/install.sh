#!/bin/bash
kubectl get svc | grep -q wechat-server-interaction
if [ "$?" == "1" ];then
	kubectl create -f wechat_server_interaction-service.yaml --record
	kubectl get svc | grep -q wechat-server-interaction
	if [ "$?" == "0" ];then
		echo "wechat_server_interaction-service install success!"
	else
		echo "wechat_server_interaction-service install fail!"
	fi
else
	echo "wechat_server_interaction-service is exist!"
fi
kubectl get pods | grep -q wechat-server-interaction
if [ "$?" == "1" ];then
	kubectl create -f wechat_server_interaction-deployment.yaml --record
	kubectl get pods | grep -q wechat-server-interaction
	if [ "$?" == "0" ];then
		echo "wechat_server_interaction-deployment install success!"
	else
		echo "wechat_server_interaction-deployment install fail!"
	fi
else
	kubectl delete -f wechat_server_interaction-deployment.yaml
	kubectl get pods | grep -q wechat-server-interaction
	while ( "$?" == "0" )
	do
	kubectl get pods | grep -q wechat-server-interaction
	done
	kubectl create -f wechat_server_interaction-deployment.yaml --record
	kubectl get pods | grep -q wechat-server-interaction
	if [ "$?" == "0" ];then
		echo "wechat_server_interaction-deployment update success!"
	else
		echo "wechat_server_interaction-deployment update fail!"
	fi
fi