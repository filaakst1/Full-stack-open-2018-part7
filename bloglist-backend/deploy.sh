#!/bin/bash
source ./.env

DEPLOYMENT_ALIAS=filaakst-bloglist-part7
sh ../bloglist-frontend/build.sh
retVal=$?
if [ $retVal -ne 0 ]; then
    echo "Frontend fails to build"
    exit $retVal
fi
rm -rf ./build
cp -r ../bloglist-frontend/dist ./build
DEPLOYMENT_NAME=bloglist-part7
now secret add mongo-db-uri-e7 ${MONGO_DB_URI}
now rm ${DEPLOYMENT_NAME}
now -C -f -e MONGO_DB_URI=@mongo-db-uri-e7 -e PORT=${PORT} -n ${DEPLOYMENT_NAME} 

#&& now alias "filaakst1-full-stack-open-2018-part7-backend"
