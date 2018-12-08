#!/bin/bash
source ./.env
now secret add mongo-db-uri-e7 ${MONGO_DB_URI}
now secret add login-secret-e7 ${SECRET}
