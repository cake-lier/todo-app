FROM mongo:5.0.6

WORKDIR /config

COPY setup.sh ./
COPY wait-for-it.sh ./
COPY setup.js ./

CMD [ "./setup.sh" ]
