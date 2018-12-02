#!/bin/sh
DEPLOYMENT_NAME=bloglist-backend-part7
now rm ${DEPLOYMENT_NAME}
now -C -f -e MONGO_DB_URI=@mongo-db-uri -n ${DEPLOYMENT_NAME} 

#&& now alias "filaakst1-full-stack-open-2018-part7-backend"
